import * as THREE from 'three'
import type { Materials } from '../materials'
import type { ModelDef, OptionDef } from '../types'
import { choiceLabel, num, on, str } from '../types'
import {
  block, centerXZ, extrudeUp, extrudeZ, group, instances, lathe, mesh, polyShape, rectHole, rectShape, seededRandom,
} from '../helpers'

// ---------- shared ----------

const COLORS: Record<string, { label: string; hex: string }> = {
  grey: { label: 'Grey', hex: '#9a968f' },
  red: { label: 'Red', hex: '#9c4a3a' },
  yellow: { label: 'Yellow', hex: '#c9a24a' },
  charcoal: { label: 'Charcoal', hex: '#55524f' },
}

const COLOR: OptionDef = {
  key: 'color', label: 'Colour', default: 'grey',
  choices: Object.entries(COLORS).map(([value, c]) => ({ value, label: c.label })),
}

const colorOf = (p: Record<string, string | boolean>) => COLORS[str(p, 'color')].hex

type Cell = { x: number; z: number; ry?: number }

// Lay one paver geometry at many positions; the geometry is shrunk slightly to leave joints
function paverField(geo: THREE.BufferGeometry, mat: THREE.Material, cells: Cell[], y = 0) {
  return instances(geo, mat, cells.map((c) => ({ x: c.x, y, z: c.z, ry: c.ry })))
}

function shrink(geo: THREE.BufferGeometry, l: number, w: number, gap: number) {
  centerXZ(geo)
  return geo.scale((l - gap) / l, 1, (w - gap) / w)
}

// Straight block bond (stretcher), centred on the origin
function stretcherCells(cols: number, rows: number, l: number, w: number): Cell[] {
  const cells: Cell[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: (c - (cols - 1) / 2) * l + (r % 2 ? l / 4 : -l / 4), z: (r - (rows - 1) / 2) * w })
    }
  }
  return cells
}

// ---------- Precast pavers ----------

// Zigzag (uni) paver: long sides follow the same wave so rows interlock exactly
function zigzagShape(l: number, w: number, periods = 4) {
  const p = l / periods
  const a = w * 0.12
  const pts: [number, number][] = [[0, 0]]
  for (let i = 0; i < periods; i++) pts.push([i * p + p / 4, a], [i * p + (3 * p) / 4, -a], [(i + 1) * p, 0])
  pts.push([l, w])
  for (let i = periods - 1; i >= 0; i--) pts.push([i * p + (3 * p) / 4, w - a], [i * p + p / 4, w + a], [i * p, w])
  return polyShape(pts)
}

const PAVER_SHAPE: OptionDef = {
  key: 'shape', label: 'Shape', default: 'zigzag',
  choices: [{ value: 'zigzag', label: 'Zigzag' }, { value: 'rect', label: 'Rectangle' }],
}

const precastPavers: ModelDef = {
  options: [
    PAVER_SHAPE,
    { key: 'thickness', label: 'Thickness (mm)', default: '60', choices: ['60', '80'].map((v) => ({ value: v, label: v })) },
    COLOR,
  ],
  readout: (p) => ({ title: `${choiceLabel(PAVER_SHAPE, p)} paver · ${str(p, 'thickness')} mm`, subtitle: `${choiceLabel(COLOR, p)} finish` }),
  build: (p, m) => {
    const t = num(p, 'thickness') / 1000
    const zig = str(p, 'shape') === 'zigzag'
    const [l, w] = zig ? [0.225, 0.1125] : [0.2, 0.1]
    const shape = zig ? zigzagShape(l, w) : rectShape(l, w)
    const geo = shrink(extrudeUp(shape, t, 0.004), l, w, 0.004)
    const cells = zig ? stretcherCells(6, 10, l, w) : stretcherCells(7, 12, l, w)
    return paverField(geo, m.concrete(colorOf(p)), cells)
  },
}

// ---------- Chequered tiles ----------

const CHEQUER_PATTERN: OptionDef = {
  key: 'pattern', label: 'Pattern', default: 'squares',
  choices: [{ value: 'squares', label: 'Raised squares' }, { value: 'dots', label: 'Raised dots' }],
}

const chequeredTiles: ModelDef = {
  options: [CHEQUER_PATTERN, COLOR],
  readout: (p) => ({ title: choiceLabel(CHEQUER_PATTERN, p), subtitle: `${choiceLabel(COLOR, p)} · 3 × 3 tile layout` }),
  build: (p, m) => {
    const size = 0.3
    const t = 0.025
    const mat = m.concrete(colorOf(p))
    const tiles: Cell[] = []
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) tiles.push({ x: i * (size + 0.004), z: j * (size + 0.004) })
    const g = group(paverField(extrudeUp(rectShape(size, size), t, 0.002), mat, tiles))

    const grid = 8
    const step = size / grid
    const studs: Cell[] = []
    for (const tile of tiles) {
      for (let i = 0; i < grid; i++) {
        for (let j = 0; j < grid; j++) studs.push({ x: tile.x + (i + 0.5) * step - size / 2, z: tile.z + (j + 0.5) * step - size / 2 })
      }
    }
    const studGeo = str(p, 'pattern') === 'dots'
      ? new THREE.CylinderGeometry(0.011, 0.011, 0.005, 16).translate(0, 0.0025, 0)
      : new THREE.BoxGeometry(0.024, 0.005, 0.024).translate(0, 0.0025, 0)
    g.add(paverField(studGeo, mat, studs, t))
    return g
  },
}

// ---------- Kerb stones ----------

const KERB_PROFILE: OptionDef = {
  key: 'profile', label: 'Profile', default: 'battered',
  choices: [{ value: 'battered', label: 'Half battered' }, { value: 'bullnose', label: 'Bullnose' }, { value: 'square', label: 'Square' }],
}

function kerbProfile(type: string, w: number, h: number) {
  if (type === 'square') return rectShape(w, h, 0, h / 2)
  if (type === 'bullnose') {
    const r = 0.06
    const s = new THREE.Shape()
    s.moveTo(-w / 2, 0)
    s.lineTo(w / 2, 0)
    s.lineTo(w / 2, h)
    s.lineTo(-w / 2 + r, h)
    s.absarc(-w / 2 + r, h - r, r, Math.PI / 2, Math.PI, false)
    s.closePath()
    return s
  }
  return polyShape([[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2 + 0.05, h], [-w / 2, h - 0.1]])
}

const kerbStones: ModelDef = {
  options: [KERB_PROFILE],
  toggles: [{ key: 'painted', label: 'Black & Yellow Paint', default: false }],
  readout: (p) => ({ title: '300 × 150 × 600 mm', subtitle: `${choiceLabel(KERB_PROFILE, p)} kerb${on(p, 'painted') ? ' · painted' : ''}` }),
  build: (p, m) => {
    const len = 0.6
    const geo = extrudeZ(kerbProfile(str(p, 'profile'), 0.15, 0.3), len, 0.004)
    const g = group()
    for (let i = 0; i < 3; i++) {
      const mat = on(p, 'painted') ? m.concrete(i % 2 ? '#2d2c2b' : '#d8b02a') : m.concrete()
      g.add(mesh(i === 0 ? geo : geo.clone(), mat, 0, 0, (i - 1) * (len + 0.006)))
    }
    return g
  },
}

// ---------- Saucer drains ----------

const saucerDrains: ModelDef = {
  toggles: [{ key: 'run', label: 'Run of 4', default: true }],
  readout: (p) => ({ title: '300 × 300 mm', subtitle: on(p, 'run') ? 'Run of four units' : 'Single unit' }),
  build: (p, m) => {
    const s = new THREE.Shape()
    s.moveTo(-0.15, 0)
    s.lineTo(0.15, 0)
    s.lineTo(0.15, 0.1)
    s.quadraticCurveTo(0, 0.02, -0.15, 0.1) // shallow dish, 40 mm deep at the centre
    s.closePath()
    const geo = extrudeZ(s, 0.3, 0.003)
    const count = on(p, 'run') ? 4 : 1
    const g = group()
    for (let i = 0; i < count; i++) g.add(mesh(i === 0 ? geo : geo.clone(), m.concrete(), 0, 0, (i - (count - 1) / 2) * 0.304))
    return g
  },
}

// ---------- Concrete blocks ----------

const INCH_MM: Record<string, number> = { '4': 100, '6': 150, '8': 200 }

function masonry(m: Materials, thicknessMm: number, hollow: boolean, wall: boolean) {
  const l = 0.39
  const h = 0.19
  const d = thicknessMm / 1000
  const shape = rectShape(l, d)
  if (hollow) {
    const web = 0.03
    const holeW = (l - 3 * web) / 2
    const holeD = d - 0.05
    for (const side of [-1, 1]) shape.holes.push(rectHole(holeW, holeD, side * (web / 2 + holeW / 2), 0))
  }
  const geo = extrudeUp(shape, h, 0.003)
  const cells = wall
    ? Array.from({ length: 4 }, (_, r) => [0, 1, 2].map((c) => ({ x: (c - 1) * 0.4 + (r % 2 ? 0.2 : 0), y: r * 0.2, z: 0 }))).flat()
    : [{ x: 0, y: 0, z: 0 }]
  return instances(geo, m.concrete(), cells)
}

function blockModel(hollow: boolean, sizes: string[]): ModelDef {
  return {
    options: [{ key: 'size', label: 'Thickness', default: sizes[0], choices: sizes.map((v) => ({ value: v, label: `${v} inch` })) }],
    toggles: [{ key: 'wall', label: 'Wall Layout', default: false }],
    readout: (p) => ({
      title: `${str(p, 'size')} inch ${hollow ? 'hollow' : 'solid'} block`,
      subtitle: `${INCH_MM[str(p, 'size')]} mm thick${on(p, 'wall') ? ' · laid in stretcher bond' : ''}`,
    }),
    build: (p, m) => masonry(m, INCH_MM[str(p, 'size')], hollow, on(p, 'wall')),
  }
}

// ---------- Pavers (laying patterns) ----------

const PATTERN: OptionDef = {
  key: 'pattern', label: 'Pattern', default: 'herringbone',
  choices: [{ value: 'herringbone', label: 'Herringbone' }, { value: 'basket', label: 'Basket weave' }, { value: 'stretcher', label: 'Stretcher' }],
}

// Cells in units of the paver width (paver = 2 × 1 units); `v` = turned 90°
function patternCells(pattern: string, half: number): { x: number; y: number; v: boolean }[] {
  const out: { x: number; y: number; v: boolean }[] = []
  if (pattern === 'herringbone') {
    // Staircase strips of horizontal + vertical pavers; strips repeat every (2, -2)
    for (let s = -10; s <= 10; s++) {
      for (let k = -20; k <= 20; k++) {
        out.push({ x: k + 2 * s + 1, y: k - 2 * s + 0.5, v: false })
        out.push({ x: k + 2 * s + 0.5, y: k - 2 * s + 2, v: true })
      }
    }
  } else if (pattern === 'basket') {
    for (let i = -half / 2; i < half / 2; i++) {
      for (let j = -half / 2; j < half / 2; j++) {
        const cx = i * 2 + 1
        const cy = j * 2 + 1
        const horizontal = (((i + j) % 2) + 2) % 2 === 0
        for (const o of [-0.5, 0.5]) out.push(horizontal ? { x: cx, y: cy + o, v: false } : { x: cx + o, y: cy, v: true })
      }
    }
  } else {
    for (let j = -half; j < half; j++) {
      for (let i = -half; i <= half; i++) out.push({ x: i * 2 + (j % 2 ? 1 : 0), y: j + 0.5, v: false })
    }
  }
  return out.filter((c) => Math.abs(c.x) <= half && Math.abs(c.y) <= half)
}

const pavers: ModelDef = {
  options: [PATTERN, COLOR],
  readout: (p) => ({ title: `${choiceLabel(PATTERN, p)} pattern`, subtitle: `${choiceLabel(COLOR, p)} rectangular pavers` }),
  build: (p, m) => {
    const u = 0.1
    const geo = shrink(extrudeUp(rectShape(2 * u, u), 0.06, 0.004), 2 * u, u, 0.004)
    const cells = patternCells(str(p, 'pattern'), 6).map((c) => ({ x: c.x * u, z: c.y * u, ry: c.v ? Math.PI / 2 : 0 }))
    return paverField(geo, m.concrete(colorOf(p)), cells)
  },
}

// ---------- Grass pavers ----------

const grassPavers: ModelDef = {
  toggles: [{ key: 'grass', label: 'Grass Filled', default: true }],
  readout: (p) => ({ title: 'Grass paver', subtitle: on(p, 'grass') ? 'Cells filled with soil and grass' : 'Empty cells' }),
  build: (p, m) => {
    const size = 0.4
    const t = 0.08
    const hole = 0.085
    const pitch = hole + (size - 3 * hole) / 4
    const shape = rectShape(size, size)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) shape.holes.push(rectHole(hole, hole, i * pitch, j * pitch))

    const blocks: Cell[] = []
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) blocks.push({ x: i * (size + 0.004), z: j * (size + 0.004) })
    const g = group(paverField(extrudeUp(shape, t, 0.003), m.concrete(), blocks))

    if (on(p, 'grass')) {
      const cells: Cell[] = []
      for (const b of blocks) for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) cells.push({ x: b.x + i * pitch, z: b.z + j * pitch })
      g.add(paverField(new THREE.BoxGeometry(hole, 0.06, hole).translate(0, 0.03, 0), m.soil, cells))
      const rand = seededRandom(7)
      const blades = cells.flatMap((c) =>
        Array.from({ length: 14 }, () => ({
          x: c.x + (rand() - 0.5) * hole * 0.85,
          y: 0.06,
          z: c.z + (rand() - 0.5) * hole * 0.85,
          rx: (rand() - 0.5) * 0.5,
          rz: (rand() - 0.5) * 0.5,
          s: 0.7 + rand() * 0.6,
        })),
      )
      g.add(instances(new THREE.ConeGeometry(0.004, 0.04, 4).translate(0, 0.02, 0), m.grass, blades))
    }
    return g
  },
}

// ---------- Paving tiles ----------

const TILE_PATTERN: OptionDef = {
  key: 'pattern', label: 'Layout', default: 'plain',
  choices: [{ value: 'plain', label: 'Single colour' }, { value: 'checker', label: 'Two-tone' }],
}

const pavingTiles: ModelDef = {
  options: [TILE_PATTERN, COLOR],
  readout: (p) => ({ title: choiceLabel(TILE_PATTERN, p), subtitle: `${choiceLabel(COLOR, p)} paving tiles` }),
  build: (p, m) => {
    const size = 0.4
    const geo = extrudeUp(rectShape(size - 0.004, size - 0.004), 0.04, 0.003)
    const a: Cell[] = []
    const b: Cell[] = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) ((i + j) % 2 && str(p, 'pattern') === 'checker' ? b : a).push({ x: (i - 1.5) * size, z: (j - 1.5) * size })
    }
    const g = group(paverField(geo, m.concrete(colorOf(p)), a))
    if (b.length) {
      const alt = str(p, 'color') === 'grey' ? COLORS.charcoal.hex : '#c9c5bd'
      g.add(paverField(geo.clone(), m.concrete(alt), b))
    }
    return g
  },
}

// ---------- Flagstones ----------

const FLAG_COLORS: Record<string, string[]> = {
  sandstone: ['#c2a27a', '#b8966c', '#cbb08c'],
  grey: ['#9a968f', '#8c8882', '#a8a49c'],
  slate: ['#5f6366', '#565a5d', '#6a6e70'],
}

const FLAG_LAYOUT: OptionDef = {
  key: 'layout', label: 'Layout', default: 'path',
  choices: [{ value: 'path', label: 'Garden path' }, { value: 'patio', label: 'Patio' }],
}
const FLAG_COLOR: OptionDef = {
  key: 'color', label: 'Colour', default: 'sandstone',
  choices: [{ value: 'sandstone', label: 'Sandstone' }, { value: 'grey', label: 'Grey' }, { value: 'slate', label: 'Slate' }],
}

const flagstones: ModelDef = {
  options: [FLAG_LAYOUT, FLAG_COLOR],
  readout: (p) => ({ title: choiceLabel(FLAG_LAYOUT, p), subtitle: `${choiceLabel(FLAG_COLOR, p)} flagstones` }),
  build: (p, m) => {
    const rand = seededRandom(42)
    const cell = 0.45
    const [cols, rows] = str(p, 'layout') === 'path' ? [2, 7] : [5, 5]
    const shades = FLAG_COLORS[str(p, 'color')]
    const g = group()
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Irregular polygon around a jittered cell centre
        const sides = 6 + Math.floor(rand() * 3)
        const pts: [number, number][] = Array.from({ length: sides }, (_, k) => {
          const a = ((k + (rand() - 0.5) * 0.5) / sides) * Math.PI * 2
          const r = cell * (0.38 + rand() * 0.1)
          return [Math.cos(a) * r, Math.sin(a) * r]
        })
        const t = 0.04 + rand() * 0.015
        const x = (i - (cols - 1) / 2) * cell + (rand() - 0.5) * 0.06 + (j % 2 ? cell * 0.25 : 0)
        const z = (j - (rows - 1) / 2) * cell + (rand() - 0.5) * 0.06
        g.add(mesh(extrudeUp(polyShape(pts), t, 0.008), m.concrete(shades[Math.floor(rand() * shades.length)]), x, 0, z))
      }
    }
    return g
  },
}

// ---------- Water channels ----------

const waterChannels: ModelDef = {
  toggles: [{ key: 'grating', label: 'Steel Grating', default: true }],
  readout: (p) => ({ title: 'Water channel', subtitle: on(p, 'grating') ? 'With steel grating' : 'Open channel' }),
  build: (p, m) => {
    const s = new THREE.Shape()
    s.moveTo(-0.125, 0)
    s.lineTo(0.125, 0)
    s.lineTo(0.125, 0.2)
    s.lineTo(0.075, 0.2)
    s.lineTo(0.075, 0.125)
    s.absarc(0, 0.125, 0.075, 0, Math.PI, true) // round invert
    s.lineTo(-0.075, 0.2)
    s.lineTo(-0.125, 0.2)
    s.closePath()
    const len = 1
    const geo = extrudeZ(s, len, 0.004)
    const g = group()
    const bars: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * (len + 0.004)
      g.add(mesh(i === 0 ? geo : geo.clone(), m.concrete(), 0, 0, z))
      if (on(p, 'grating')) {
        for (const x of [-0.085, 0.085]) g.add(block(0.012, 0.02, len - 0.01, m.steel, x, 0.2, z))
        for (let k = 0; k < 39; k++) bars.push({ x: 0, y: 0.2, z: z - len / 2 + 0.02 + k * 0.025 })
      }
    }
    if (bars.length) g.add(instances(new THREE.BoxGeometry(0.18, 0.02, 0.006).translate(0, 0.01, 0), m.steel, bars))
    return g
  },
}

// ---------- Walls and fencing ----------

const FENCE_STYLE: OptionDef = {
  key: 'style', label: 'Style', default: 'panel',
  choices: [{ value: 'panel', label: 'Panel fence' }, { value: 'balustrade', label: 'Balustrade' }],
}

const wallsAndFencing: ModelDef = {
  options: [FENCE_STYLE],
  readout: (p) => ({ title: choiceLabel(FENCE_STYLE, p), subtitle: 'Three bays of precast fencing' }),
  build: (p, m) => {
    const mat = m.concrete()
    const bay = 1.8
    const g = group()
    const balustrade = str(p, 'style') === 'balustrade'
    const postH = balustrade ? 1 : 1.5
    const post = balustrade ? 0.15 : 0.12
    for (let i = 0; i <= 3; i++) {
      const x = (i - 1.5) * bay
      g.add(block(post, postH, post, mat, x, 0, 0, 0.004))
      g.add(block(post + 0.05, 0.05, post + 0.05, mat, x, postH, 0, 0.008))
    }
    const span = bay - post - 0.004
    if (balustrade) {
      const baluster = lathe([
        [0, 0], [0.04, 0], [0.04, 0.04], [0.026, 0.07], [0.05, 0.26], [0.055, 0.33], [0.03, 0.47],
        [0.022, 0.56], [0.032, 0.63], [0.04, 0.66], [0.04, 0.7], [0, 0.7],
      ], 24)
      const items: { x: number; y: number; z: number }[] = []
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * bay
        g.add(block(span, 0.1, 0.12, mat, x, 0.05, 0, 0.004))
        g.add(block(span, 0.1, 0.14, mat, x, 0.85, 0, 0.008))
        for (let k = 0; k < 10; k++) items.push({ x: x - span / 2 + (k + 0.5) * (span / 10), y: 0.15, z: 0 })
      }
      g.add(instances(baluster, mat, items))
    } else {
      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 4; k++) g.add(block(span, 0.29, 0.05, mat, (i - 1) * bay, 0.05 + k * 0.3, 0, 0.004))
      }
    }
    return g
  },
}

// ---------- Furniture and decor ----------

const FURNITURE: OptionDef = {
  key: 'item', label: 'Item', default: 'bench',
  choices: [{ value: 'bench', label: 'Bench' }, { value: 'planter', label: 'Planter' }, { value: 'table', label: 'Table set' }],
}

const furnitureAndDecor: ModelDef = {
  options: [FURNITURE],
  readout: (p) => ({ title: choiceLabel(FURNITURE, p), subtitle: 'Precast concrete outdoor furniture' }),
  build: (p, m) => {
    const mat = m.concrete('#b0aba3')
    const item = str(p, 'item')
    if (item === 'planter') {
      const pot = mesh(lathe([
        [0, 0], [0.2, 0], [0.215, 0.02], [0.27, 0.48], [0.29, 0.5], [0.29, 0.54], [0.25, 0.54], [0.2, 0.08], [0, 0.08],
      ], 48), mat)
      const g = group(pot, mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.01, 32), m.soil, 0, 0.475, 0))
      const rand = seededRandom(3)
      for (let i = 0; i < 9; i++) {
        const r = 0.1 + rand() * 0.08
        const a = (i / 9) * Math.PI * 2
        const d = i === 0 ? 0 : 0.1 + rand() * 0.06
        g.add(mesh(new THREE.IcosahedronGeometry(r, 1), m.grass, Math.cos(a) * d, 0.62 + rand() * 0.25, Math.sin(a) * d))
      }
      return g
    }
    if (item === 'table') {
      const g = group(
        mesh(lathe([[0, 0], [0.25, 0], [0.25, 0.04], [0.1, 0.1], [0.08, 0.6], [0.15, 0.7], [0, 0.7]]), mat),
        mesh(lathe([[0, 0], [0.43, 0], [0.45, 0.015], [0.45, 0.035], [0.43, 0.05], [0, 0.05]], 64), mat, 0, 0.7, 0),
      )
      const stool = lathe([[0, 0], [0.17, 0], [0.15, 0.05], [0.12, 0.4], [0.18, 0.42], [0.18, 0.45], [0, 0.45]])
      g.add(instances(stool, mat, [0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.5
        return { x: Math.cos(a) * 0.78, y: 0, z: Math.sin(a) * 0.78 }
      })))
      return g
    }
    return group(
      block(0.1, 0.4, 0.42, mat, -0.55, 0, 0, 0.01),
      block(0.1, 0.4, 0.42, mat, 0.55, 0, 0, 0.01),
      block(1.5, 0.07, 0.44, mat, 0, 0.4, 0, 0.015),
    )
  },
}

export const dsineTilesModels = {
  'precast-pavers': precastPavers,
  'chequered-tiles': chequeredTiles,
  'kerb-stones': kerbStones,
  'saucer-drains': saucerDrains,
  'hollow-blocks': blockModel(true, ['4', '6', '8']),
  'solid-blocks': blockModel(false, ['4', '6']),
  pavers,
  'grass-pavers': grassPavers,
  'paving-tiles': pavingTiles,
  flagstones,
  'water-channels': waterChannels,
  'walls-and-fencing': wallsAndFencing,
  'furniture-and-decor': furnitureAndDecor,
} satisfies Record<string, ModelDef>
