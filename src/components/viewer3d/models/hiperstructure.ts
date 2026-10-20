import * as THREE from 'three'
import type { Materials } from '../materials'
import type { ModelDef, OptionDef } from '../types'
import { choiceLabel, num, on, str } from '../types'
import {
  block, circleHole, extrudeUp, extrudeZ, group, instances, lathe, mesh, mm, pipeGeo, polyHole, polyShape,
  rectHole, rectShape, taperedBox, tube,
} from '../helpers'

// ---------- shared profiles ----------

// U cross-section centred on x, sitting on y = 0, with haunches in the inner corners
function uShape(w: number, h: number, t: number, base = t) {
  const ow = w + 2 * t
  const oh = h + base
  const haunch = Math.min(w, h) * 0.08
  return polyShape([
    [-ow / 2, 0], [ow / 2, 0], [ow / 2, oh], [w / 2, oh], [w / 2, base + haunch], [w / 2 - haunch, base],
    [-w / 2 + haunch, base], [-w / 2, base + haunch], [-w / 2, oh], [-ow / 2, oh],
  ])
}

// Box culvert opening with chamfered (haunched) corners, floor at y = t
function culvertOpening(w: number, h: number, t: number) {
  const c = Math.min(w, h) * 0.1
  return polyHole([
    [-w / 2 + c, t], [-w / 2, t + c], [-w / 2, t + h - c], [-w / 2 + c, t + h],
    [w / 2 - c, t + h], [w / 2, t + h - c], [w / 2, t + c], [w / 2 - c, t],
  ])
}

// Closed box section; `wall` lets the spigot ring reuse the same opening with thinner walls
function boxSection(w: number, h: number, t: number, wall = t) {
  const s = rectShape(w + 2 * wall, h + 2 * wall, 0, h / 2 + t)
  s.holes.push(culvertOpening(w, h, t))
  return s
}

// Four lifting sockets on top of a section
function liftingSockets(m: Materials, xs: number[], y: number, zs: number[], r: number) {
  const items = xs.flatMap((x) => zs.map((z) => ({ x, y: y + 0.001, z })))
  return instances(new THREE.CylinderGeometry(r, r, 0.012, 20), m.dark, items)
}

// Chamber walls (catch basin / manhole) with optional pipe openings and cutaway front
function chamber(m: Materials, w: number, depth: number, t: number, pipeR: number, cutaway: boolean) {
  const g = group()
  const base = t * 1.2
  const ow = w + 2 * t
  const mat = m.concrete()
  g.add(block(ow, base, ow, mat))

  // Side walls (±x) carry the inlet and outlet pipes
  for (const side of [-1, 1]) {
    const s = rectShape(w, depth, 0, depth / 2)
    s.holes.push(circleHole(pipeR, 0, pipeR + depth * 0.15))
    const wall = mesh(extrudeZ(s, t), mat, side * (w / 2 + t / 2), base, 0)
    wall.rotation.y = Math.PI / 2
    g.add(wall)
    const p = mesh(pipeGeo(pipeR * 0.86, pipeR, 0.5), mat, side * (w / 2 + t - 0.05), base + pipeR + depth * 0.15, 0)
    p.rotation.z = side * -Math.PI / 2
    g.add(p)
  }
  // Back and front walls (±z) span the full outer width
  g.add(block(ow, depth, t, mat, 0, base, -(w / 2 + t / 2)))
  if (!cutaway) g.add(block(ow, depth, t, mat, 0, base, w / 2 + t / 2))
  return { g, top: base + depth, ow }
}

// ---------- U drains ----------

const UDRAIN_SIZES = [300, 450, 600, 750, 900, 1200]
const UDRAIN_LENGTH = 2000

const uDrains: ModelDef = {
  options: [
    { key: 'size', label: 'Size (mm)', default: '600', choices: UDRAIN_SIZES.map((s) => ({ value: String(s), label: String(s) })) },
    { key: 'load', label: 'Load class', default: '25T', choices: [{ value: '6T', label: '6 Ton' }, { value: '25T', label: '25 Ton' }] },
  ],
  toggles: [{ key: 'cover', label: 'RCC Cover', default: false }],
  readout: (p) => ({
    title: `${str(p, 'size')} × ${str(p, 'size')} × ${UDRAIN_LENGTH} mm`,
    subtitle: str(p, 'load') === '25T' ? '25 Ton heavy duty' : '6 Ton standard',
  }),
  build: (p, m) => {
    const size = num(p, 'size')
    const w = mm(size)
    const h = mm(size)
    // Wall/base thickness for the visual model only — heavier load class gets thicker sections
    const base = 60 + size * 0.07
    const t = mm(Math.round(str(p, 'load') === '25T' ? base * 1.35 : base))
    const len = mm(UDRAIN_LENGTH)
    const oh = h + t
    const ow = w + 2 * t
    const mat = m.concrete()

    const g = group(mesh(extrudeZ(uShape(w, h, t), len, 0.006), mat))

    // Groove joint: a thinner spigot protruding from one end that seats into the next unit
    const spigotLen = Math.max(0.04, t * 0.5)
    g.add(mesh(extrudeZ(uShape(w, h - t * 0.15, t * 0.45), spigotLen), mat, 0, 0, len / 2 + spigotLen / 2))

    g.add(liftingSockets(m, [-(w / 2 + t / 2), w / 2 + t / 2], oh, [-len / 4, len / 4], t * 0.22))

    if (on(p, 'cover')) {
      const coverT = Math.max(0.075, t * 0.9)
      g.add(block(ow, coverT, len, mat, 0, oh + 0.004, 0))
    }
    return g
  },
}

// ---------- Box culverts ----------

const CULVERT_SIZES: [number, number][] = [
  [600, 600], [1000, 1000], [1200, 1200], [1500, 1500], [1500, 1800], [1800, 1800], [2000, 2000], [2500, 2500], [3000, 3000],
]

const boxCulverts: ModelDef = {
  options: [{
    key: 'size', label: 'Size (mm)', default: '1200x1200',
    choices: CULVERT_SIZES.map(([w, h]) => ({ value: `${w}x${h}`, label: `${w}×${h}` })),
  }],
  toggles: [{ key: 'run', label: '3 Units Joined', default: false }],
  readout: (p) => {
    const [w, h] = str(p, 'size').split('x')
    return { title: `${w} × ${h} × 2000 mm`, subtitle: on(p, 'run') ? 'Three units joined in line' : 'Single unit' }
  },
  build: (p, m) => {
    const [wmm, hmm] = str(p, 'size').split('x').map(Number)
    const w = mm(wmm)
    const h = mm(hmm)
    const t = 0.1 + 0.065 * w
    const len = 2
    const mat = m.concrete()
    const g = group()
    const units = on(p, 'run') ? 3 : 1
    for (let i = 0; i < units; i++) {
      const z = (i - (units - 1) / 2) * (len + 0.01)
      g.add(mesh(extrudeZ(boxSection(w, h, t), len, 0.008), mat, 0, 0, z))
      // Spigot ring that seats into the neighbouring unit
      g.add(mesh(extrudeZ(boxSection(w, h, t, t / 2), 0.05), mat, 0, 0, z + len / 2 + 0.025))
      g.add(liftingSockets(m, [-w / 4, w / 4], h + 2 * t, [z - len / 4, z + len / 4], t * 0.2))
    }
    return g
  },
}

// ---------- Retaining walls ----------

const RW_TYPE: OptionDef = {
  key: 'type', label: 'Type', default: 'L',
  choices: [{ value: 'L', label: 'L-Shape' }, { value: 'T', label: 'T-Shape' }],
}

const retainingWalls: ModelDef = {
  options: [
    RW_TYPE,
    { key: 'height', label: 'Height (m)', default: '2', choices: ['1', '2', '3', '4'].map((v) => ({ value: v, label: `${v} m` })) },
  ],
  toggles: [{ key: 'backfill', label: 'Show Backfill', default: false }],
  readout: (p) => ({ title: `${choiceLabel(RW_TYPE, p)} · ${str(p, 'height')} m high`, subtitle: '2.4 m wide panel' }),
  build: (p, m) => {
    const H = num(p, 'height')
    const B = Math.max(0.8, 0.6 * H)
    const tb = Math.max(0.15, 0.06 * H + 0.1)
    const tsBottom = Math.max(0.15, 0.07 * H + 0.1)
    const tsTop = 0.15
    const len = 2.4
    // Front face of the stem: flush with the toe for L, set back for T
    const x0 = str(p, 'type') === 'L' ? -B / 2 : -B / 2 + B * 0.3
    // Drawn with the exposed face toward -x, then mirrored so it faces the camera and the backfill sits behind
    const mirror = (pts: [number, number][]) => polyShape(pts.map(([x, y]) => [-x, y] as [number, number]).reverse())
    const profile = mirror([
      [-B / 2, 0], [B / 2, 0], [B / 2, tb], [x0 + tsBottom, tb], [x0 + tsTop, H], [x0, H], [x0, tb], [-B / 2, tb],
    ])
    const g = group(mesh(extrudeZ(profile, len, 0.008), m.concrete()))
    if (on(p, 'backfill')) {
      const soil = mirror([
        [x0 + tsBottom + 0.002, tb], [B / 2 + 0.8, tb], [B / 2 + 0.8, H * 0.92], [x0 + tsTop + 0.01, H * 0.92],
      ])
      g.add(mesh(extrudeZ(soil, len - 0.02), m.soil))
    }
    return g
  },
}

// ---------- Catch basins ----------

const catchBasins: ModelDef = {
  toggles: [
    { key: 'grating', label: 'Grating', default: true },
    { key: 'cutaway', label: 'Cutaway', default: false },
  ],
  readout: () => ({ title: '900 × 900 mm', subtitle: 'Stormwater catch basin with inlet / outlet' }),
  build: (p, m) => {
    const w = 0.9
    const { g, top, ow } = chamber(m, w, 0.9, 0.1, 0.15, on(p, 'cutaway'))
    if (on(p, 'grating')) {
      const frame = rectShape(ow, ow)
      frame.holes.push(rectHole(w - 0.04, w - 0.04))
      g.add(mesh(extrudeUp(frame, 0.03), m.dark, 0, top, 0))
      const bars = Array.from({ length: 21 }, (_, i) => ({ x: -w / 2 + 0.03 + i * ((w - 0.06) / 20), y: top + 0.005, z: 0 }))
      g.add(instances(new THREE.BoxGeometry(0.012, 0.025, w - 0.04).translate(0, 0.0125, 0), m.dark, bars))
    }
    return g
  },
}

// ---------- Manhole ----------

const manhole: ModelDef = {
  toggles: [
    { key: 'lid', label: 'Cover Lid', default: true },
    { key: 'cutaway', label: 'Cutaway', default: false },
  ],
  readout: () => ({ title: '1200 × 1200 mm', subtitle: 'Precast manhole chamber' }),
  build: (p, m) => {
    const w = 1.2
    const t = 0.15
    const { g, top, ow } = chamber(m, w, 1.5, t, 0.2, on(p, 'cutaway'))
    const mat = m.concrete()

    // Cover slab with the access opening offset toward the back wall, above the step irons
    const openZ = -w / 2 + 0.4
    const slab = rectShape(ow, ow)
    slab.holes.push(circleHole(0.3, 0, -openZ)) // plan y maps to world -z
    g.add(mesh(extrudeUp(slab, 0.15, 0.006), mat, 0, top, 0))
    if (on(p, 'lid')) {
      g.add(mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 48).translate(0, 0.02, 0), m.dark, 0, top + 0.15, openZ))
    }

    // Step irons on the back wall's inside face
    for (let y = top - 0.35; y > 0.4; y -= 0.3) {
      const z = -w / 2
      g.add(tube([[-0.15, y, z], [-0.15, y, z + 0.12], [0.15, y, z + 0.12], [0.15, y, z]], 0.012, m.steel))
    }
    return g
  },
}

// ---------- Compound walls ----------

const POST = { b: 0.15, d: 0.15, tf: 0.04, tw: 0.06 }
const BAY = 2.0
const COURSE = 0.3

// H-section post, channels open toward ±x to receive panel ends
function postShape() {
  const { b, d, tf, tw } = POST
  return polyShape([
    [-b / 2, -d / 2], [b / 2, -d / 2], [b / 2, -d / 2 + tf], [tw / 2, -d / 2 + tf], [tw / 2, d / 2 - tf], [b / 2, d / 2 - tf],
    [b / 2, d / 2], [-b / 2, d / 2], [-b / 2, d / 2 - tf], [-tw / 2, d / 2 - tf], [-tw / 2, -d / 2 + tf], [-b / 2, -d / 2 + tf],
  ])
}

function compoundWall(m: Materials, bays: number, courses: number, ribbed: boolean, showPanels: boolean) {
  const mat = m.concrete()
  const g = group()
  const postH = courses * COURSE + 0.15
  for (let i = 0; i <= bays; i++) {
    g.add(mesh(extrudeUp(postShape(), postH, 0.004), mat, (i - bays / 2) * BAY, 0, 0))
  }
  if (!showPanels) return g
  const panelLen = BAY - POST.tw - 0.01
  for (let i = 0; i < bays; i++) {
    const x = (i - (bays - 1) / 2) * BAY
    for (let c = 0; c < courses; c++) {
      const y = c * COURSE + 0.002
      g.add(block(panelLen, COURSE - 0.004, 0.05, mat, x, y, 0, 0.004))
      if (ribbed) {
        g.add(block(panelLen - 0.2, 0.03, 0.012, mat, x, y + COURSE * 0.45, 0.031))
      }
    }
  }
  return g
}

const compoundWallPanels: ModelDef = {
  options: [
    { key: 'courses', label: 'Panel courses', default: '6', choices: ['4', '6', '8'].map((v) => ({ value: v, label: `${v} panels high` })) },
    { key: 'finish', label: 'Finish', default: 'plain', choices: [{ value: 'plain', label: 'Plain' }, { value: 'ribbed', label: 'Ribbed' }] },
  ],
  readout: (p) => ({ title: `${str(p, 'courses')} panels high`, subtitle: 'Panels slot between H-section posts' }),
  build: (p, m) => compoundWall(m, 2, num(p, 'courses'), str(p, 'finish') === 'ribbed', true),
}

const compoundWallPosts: ModelDef = {
  toggles: [{ key: 'panels', label: 'Show Panels', default: false }],
  readout: () => ({ title: 'H-section post', subtitle: 'Grooved to receive wall panels' }),
  build: (p, m) => (on(p, 'panels') ? compoundWall(m, 1, 6, false, true) : compoundWall(m, 0, 6, false, false)),
}

// ---------- Precast slabs ----------

const SLAB_TYPE: OptionDef = {
  key: 'type', label: 'Type', default: 'hollow',
  choices: [{ value: 'hollow', label: 'Hollow core' }, { value: 'solid', label: 'Solid' }],
}

const precastSlabs: ModelDef = {
  options: [SLAB_TYPE],
  toggles: [{ key: 'stack', label: 'Stack of 3', default: false }],
  readout: (p) => ({ title: `${choiceLabel(SLAB_TYPE, p)} slab`, subtitle: on(p, 'stack') ? 'Stacked on timber bearers' : 'Single slab' }),
  build: (p, m) => {
    const w = 1.2
    const len = 3
    const hollow = str(p, 'type') === 'hollow'
    const d = hollow ? 0.2 : 0.15
    const section = rectShape(w, d, 0, d / 2)
    if (hollow) {
      for (let i = 0; i < 6; i++) section.holes.push(circleHole(0.068, -w / 2 + 0.1 + i * 0.2, d / 2))
    }
    const geo = extrudeZ(section, len, 0.005)
    const g = group()
    const count = on(p, 'stack') ? 3 : 1
    const bearer = 0.06
    for (let i = 0; i < count; i++) {
      const y = i * (d + bearer)
      g.add(mesh(i === 0 ? geo : geo.clone(), m.concrete(), 0, y, 0))
      if (!hollow) {
        // Cast-in lifting loops
        for (const [x, z] of [[-0.4, -1.1], [0.4, -1.1], [-0.4, 1.1], [0.4, 1.1]]) {
          g.add(tube([[x - 0.05, y + d - 0.01, z], [x - 0.04, y + d + 0.06, z], [x + 0.04, y + d + 0.06, z], [x + 0.05, y + d - 0.01, z]], 0.008, m.steel, 16))
        }
      }
      if (i < count - 1) {
        for (const z of [-1.1, 1.1]) g.add(block(w + 0.1, bearer, 0.08, m.timber, 0, y + d, z))
      }
    }
    return g
  },
}

// ---------- Precast beams ----------

const BEAM_TYPE: OptionDef = {
  key: 'type', label: 'Section', default: 'i',
  choices: [{ value: 'i', label: 'I-Girder' }, { value: 'invt', label: 'Inverted T' }, { value: 'rect', label: 'Rectangular' }],
}

function beamProfile(type: string) {
  if (type === 'rect') return { shape: rectShape(0.3, 0.5, 0, 0.25), bottom: { w: 0.22, y0: 0.05, rows: 2 } }
  if (type === 'invt') {
    return {
      shape: polyShape([[-0.3, 0], [0.3, 0], [0.3, 0.2], [0.15, 0.25], [0.15, 0.8], [-0.15, 0.8], [-0.15, 0.25], [-0.3, 0.2]]),
      bottom: { w: 0.5, y0: 0.05, rows: 2 },
    }
  }
  return {
    shape: polyShape([
      [-0.2, 0], [0.2, 0], [0.2, 0.15], [0.075, 0.25], [0.075, 0.68], [0.25, 0.78], [0.25, 0.9],
      [-0.25, 0.9], [-0.25, 0.78], [-0.075, 0.68], [-0.075, 0.25], [-0.2, 0.15],
    ]),
    bottom: { w: 0.32, y0: 0.05, rows: 2 },
  }
}

const precastBeams: ModelDef = {
  options: [BEAM_TYPE],
  toggles: [{ key: 'strands', label: 'Prestressing Strands', default: true }],
  readout: (p) => ({ title: `${choiceLabel(BEAM_TYPE, p)} beam`, subtitle: 'Pre-stressed / reinforced concrete' }),
  build: (p, m) => {
    const len = 6
    const { shape, bottom } = beamProfile(str(p, 'type'))
    const g = group(mesh(extrudeZ(shape, len, 0.006), m.concrete()))
    if (on(p, 'strands')) {
      // Strand tails protruding from both ends
      const items: { x: number; y: number; z: number; rx: number }[] = []
      const perRow = 5
      for (let r = 0; r < bottom.rows; r++) {
        for (let i = 0; i < perRow; i++) {
          const x = -bottom.w / 2 + (i * bottom.w) / (perRow - 1)
          const y = bottom.y0 + r * 0.05
          for (const side of [-1, 1]) items.push({ x, y, z: side * (len / 2 + 0.1), rx: Math.PI / 2 })
        }
      }
      g.add(instances(new THREE.CylinderGeometry(0.0075, 0.0075, 0.2, 8), m.steel, items))
    }
    return g
  },
}

// ---------- Cable trench ----------

const cableTrench: ModelDef = {
  toggles: [
    { key: 'covers', label: 'Covers', default: true },
    { key: 'cables', label: 'Cables', default: true },
  ],
  readout: () => ({ title: 'Cable trench', subtitle: 'Precast trough with removable covers' }),
  build: (p, m) => {
    const w = 0.36
    const h = 0.36
    const t = 0.07
    const len = 1
    const units = 3
    const mat = m.concrete()
    const g = group()
    for (let i = 0; i < units; i++) {
      const z = (i - (units - 1) / 2) * (len + 0.005)
      g.add(mesh(extrudeZ(uShape(w, h, t), len, 0.004), mat, 0, 0, z))
      // Leave the last unit open so the cables stay visible
      if (on(p, 'covers') && i < units - 1) g.add(block(w + 2 * t, 0.05, len - 0.01, mat, 0, h + t + 0.002, z, 0.004))
    }
    if (on(p, 'cables')) {
      const total = units * len + 0.2
      const cables: [number, number, string][] = [
        [-0.11, 0, '#1d1d1d'], [-0.04, 0, '#1d1d1d'], [0.03, 0, '#7a1f1f'], [0.1, 0, '#1d1d1d'], [-0.075, 1, '#2d4f7a'], [0.065, 1, '#1d1d1d'],
      ]
      for (const [x, layer, color] of cables) {
        const r = 0.03
        const c = mesh(new THREE.CylinderGeometry(r, r, total, 20), m.plastic(color), x, t + r + layer * 2 * r * 0.9, 0)
        c.rotation.x = Math.PI / 2
        g.add(c)
      }
    }
    return g
  },
}

// ---------- Electric poles ----------

function insulator(m: Materials) {
  return mesh(lathe([[0, 0], [0.025, 0], [0.025, 0.03], [0.06, 0.04], [0.025, 0.06], [0.05, 0.08], [0.02, 0.1], [0.02, 0.13], [0, 0.13]], 24), m.porcelain)
}

const electricPoles: ModelDef = {
  options: [{ key: 'height', label: 'Height', default: '9', choices: ['8', '9'].map((v) => ({ value: v, label: `${v} m` })) }],
  toggles: [{ key: 'fittings', label: 'Cross-arm & Insulators', default: true }],
  readout: (p) => ({ title: `${str(p, 'height')} m pole`, subtitle: 'Precast concrete distribution pole' }),
  build: (p, m) => {
    const H = num(p, 'height')
    const g = group(mesh(taperedBox(0.28, 0.16, 0.14, 0.1, H), m.concrete()))
    if (on(p, 'fittings')) {
      const armY = H - 0.35
      g.add(block(1.3, 0.08, 0.08, m.steel, 0, armY, 0.09))
      for (const x of [-0.55, 0, 0.55]) {
        const ins = insulator(m)
        ins.position.set(x, armY + 0.08, 0.09)
        g.add(ins)
      }
      const top = insulator(m)
      top.position.set(0, H, 0)
      g.add(top)
    }
    return g
  },
}

// ---------- Light poles ----------

const LIGHT_STYLE: OptionDef = {
  key: 'style', label: 'Style', default: 'single',
  choices: [{ value: 'single', label: 'Single arm' }, { value: 'double', label: 'Double arm' }, { value: 'post', label: 'Post-top lantern' }],
}

const lightPoles: ModelDef = {
  options: [LIGHT_STYLE],
  toggles: [{ key: 'lit', label: 'Lamp On', default: true }],
  readout: (p) => ({ title: choiceLabel(LIGHT_STYLE, p), subtitle: 'Decorative concrete light pole' }),
  build: (p, m) => {
    const H = 6
    const mat = m.concrete()
    const g = group(block(0.45, 0.5, 0.45, mat, 0, 0, 0, 0.02))
    g.add(mesh(new THREE.CylinderGeometry(0.065, 0.11, H, 8).translate(0, H / 2 + 0.5, 0), mat))
    // Decorative collars
    for (const y of [1.1, H - 0.2]) {
      g.add(mesh(lathe([[0, 0], [0.13, 0], [0.15, 0.03], [0.13, 0.07], [0, 0.07]], 8), mat, 0, y, 0))
    }
    const top = H + 0.5
    const lamp = m.lamp(on(p, 'lit'))
    const style = str(p, 'style')
    if (style === 'post') {
      g.add(mesh(lathe([[0, 0], [0.12, 0.02], [0.17, 0.25], [0.15, 0.42], [0, 0.42]], 8), lamp, 0, top, 0))
      g.add(mesh(new THREE.ConeGeometry(0.22, 0.18, 8).translate(0, 0.09, 0), m.dark, 0, top + 0.42, 0))
    } else {
      const sides = style === 'double' ? [-1, 1] : [1]
      for (const s of sides) {
        g.add(tube([[0, top - 0.4, 0], [s * 0.15, top + 0.05, 0], [s * 0.6, top + 0.25, 0], [s * 1.1, top + 0.22, 0]], 0.03, m.steel))
        g.add(block(0.5, 0.08, 0.2, m.dark, s * 1.25, top + 0.14, 0, 0.01))
        g.add(block(0.4, 0.012, 0.14, lamp, s * 1.25, top + 0.13, 0))
      }
      g.add(mesh(new THREE.SphereGeometry(0.08, 16, 8), m.dark, 0, top, 0))
    }
    return g
  },
}

export const hiperstructureModels = {
  'u-drains': uDrains,
  'box-culverts': boxCulverts,
  'retaining-walls': retainingWalls,
  'catch-basins': catchBasins,
  'manhole-1200x1200': manhole,
  'compound-wall-panels': compoundWallPanels,
  'compound-wall-posts': compoundWallPosts,
  'precast-slabs': precastSlabs,
  'precast-beams': precastBeams,
  'cable-trays': cableTrench,
  'electric-poles': electricPoles,
  'light-poles': lightPoles,
} satisfies Record<string, ModelDef>
