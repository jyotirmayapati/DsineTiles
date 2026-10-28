import * as THREE from 'three'
import type { RailModelId } from '../modelIds'
import type { ModelDef } from '../types'
import { choiceLabel, on, str } from '../types'
import type { Materials } from '../materials'
import { block, circleHole, extrudeZ, flightGeo, group, mesh, painted, polyShape, rectHole, rectShape, textTexture } from '../helpers'

// Railway elements cast to order. Shapes and sizes match the railway station story,
// so a piece opened from the station looks the same on its own. No dimensions are labelled:
// these are cast to the client's drawings.

const WHITE = '#eceae4'
const INK = '#1d1f21'
const YELLOW = '#e3b42a'

const whitePaint = (m: Materials) => m.plastic(WHITE)
const yellowPaint = (m: Materials) => m.plastic(YELLOW)

// Lettered plate on both faces of a thin board, centred at (0, y) with faces at ±z
function plates(mat: THREE.Material, w: number, h: number, y: number, z: number) {
  const front = painted(new THREE.PlaneGeometry(w, h), mat, 0, y, z)
  const back = painted(new THREE.PlaneGeometry(w, h), mat, 0, y, -z)
  back.rotation.y = Math.PI
  return [front, back]
}

// Flat-bottom rail section, running along z
const RAIL_SECTION = polyShape([
  [-0.068, 0], [0.068, 0], [0.068, 0.012], [0.01, 0.03], [0.009, 0.13], [0.036, 0.138], [0.036, 0.172],
  [-0.036, 0.172], [-0.036, 0.138], [-0.009, 0.13], [-0.01, 0.03], [-0.068, 0.012],
])
const HALF_GAUGE = 0.838 // broad gauge 1676 mm

function sleeperGeo() {
  // Deeper under the rail seats, shallower at the centre
  return extrudeZ(
    polyShape([[-1.375, 0], [1.375, 0], [1.375, 0.18], [1.15, 0.21], [0.55, 0.21], [0.35, 0.18], [-0.35, 0.18], [-0.55, 0.21], [-1.15, 0.21], [-1.375, 0.18]]),
    0.25,
    0.008,
  )
}

const sleepers: ModelDef = {
  toggles: [{ key: 'rails', label: 'On track', default: true }],
  readout: (p) => ({ title: on(p, 'rails') ? 'Sleepers on track' : 'Concrete sleeper', subtitle: 'Broad gauge, 1676 mm' }),
  build: (p, m) => {
    const g = new THREE.Group()
    const geo = sleeperGeo()
    if (!on(p, 'rails')) return group(mesh(geo, m.concrete()))
    for (const z of [-0.65, 0, 0.65]) {
      g.add(mesh(geo, m.concrete(), 0, 0, z))
      for (const s of [-1, 1]) {
        g.add(block(0.16, 0.01, 0.2, m.dark, s * HALF_GAUGE, 0.21, z)) // rail pad
        for (const c of [-1, 1]) g.add(block(0.04, 0.05, 0.1, m.steel, s * HALF_GAUGE + c * 0.09, 0.2, z)) // clips
      }
    }
    const rail = extrudeZ(RAIL_SECTION, 2.2)
    for (const s of [-1, 1]) g.add(mesh(rail, m.steel, s * HALF_GAUGE, 0.22, 0))
    return g
  },
}

function kmStone(m: Materials) {
  const shape = new THREE.Shape()
  shape.moveTo(-0.18, 0)
  shape.lineTo(0.18, 0)
  shape.lineTo(0.18, 0.45)
  shape.absarc(0, 0.45, 0.18, 0, Math.PI, false)
  shape.closePath()
  const face = m.painted('km-247', () => textTexture([{ text: '247', size: 120 }], WHITE, INK, 256, 200), 0.8)
  return group(mesh(extrudeZ(shape, 0.15), whitePaint(m)), ...plates(face, 0.32, 0.25, 0.42, 0.076))
}

const kmStones: ModelDef = {
  readout: () => ({ title: 'Km stone', subtitle: 'Painted white, km number on both faces' }),
  build: (_p, m) => kmStone(m),
}

const gradientPosts: ModelDef = {
  readout: () => ({ title: 'Gradient post', subtitle: 'Shows the gradient where it changes' }),
  build: (_p, m) => {
    const face = m.painted('grad-200', () => textTexture([{ text: '1 IN 200', size: 64 }], WHITE, INK, 320, 120), 0.8)
    return group(
      block(0.12, 1.0, 0.12, whitePaint(m)),
      block(0.62, 0.24, 0.06, whitePaint(m), 0, 0.82, 0),
      ...plates(face, 0.58, 0.2, 0.94, 0.031),
    )
  },
}

const foulingMarks: ModelDef = {
  readout: () => ({ title: 'Fouling mark', subtitle: 'Black and white bands at the clearance point' }),
  build: (_p, m) => {
    const bands = m.painted('fouling-bands', () => {
      const tex = textTexture([], WHITE, INK, 64, 64)
      const ctx = (tex.image as HTMLCanvasElement).getContext('2d')!
      ctx.fillStyle = INK
      for (let i = 0; i < 4; i += 2) ctx.fillRect(0, i * 16, 64, 16)
      tex.needsUpdate = true
      return tex
    }, 0.8)
    return group(painted(new THREE.BoxGeometry(0.16, 0.42, 0.16).translate(0, 0.21, 0), bands))
  },
}

const coping: ModelDef = {
  toggles: [{ key: 'band', label: 'Yellow edge band', default: true }],
  readout: (p) => ({ title: 'Platform coping', subtitle: on(p, 'band') ? 'Three units with the yellow warning band' : 'Three units' }),
  build: (p, m) => {
    // Profile across the platform edge: nose overhanging the track face by 100 mm
    const geo = extrudeZ(polyShape([[-0.1, 0.02], [-0.1, 0.08], [0.5, 0.08], [0.5, 0], [0, 0], [0, 0.02]]), 0.598, 0.004)
    const g = new THREE.Group()
    for (const z of [-0.6, 0, 0.6]) g.add(mesh(geo, m.concrete(), 0, 0, z))
    if (on(p, 'band')) g.add(block(0.25, 0.004, 1.79, yellowPaint(m), 0.125, 0.08, 0))
    return g
  },
}

const shedFootings: ModelDef = {
  toggles: [{ key: 'column', label: 'Column socket', default: true }],
  readout: () => ({ title: 'Shed footing', subtitle: 'Pad footing for a platform shed column' }),
  build: (p, m) => {
    const g = group(block(0.9, 0.3, 0.9, m.concrete(), 0, 0, 0, 0.01))
    if (on(p, 'column')) g.add(block(0.3, 0.9, 0.3, m.concrete(), 0, 0.3, 0, 0.005))
    return g
  },
}

const columns: ModelDef = {
  toggles: [{ key: 'beam', label: 'Roof beam', default: true }],
  readout: (p) => ({ title: 'Precast column', subtitle: on(p, 'beam') ? 'On its footing, carrying a cantilever beam' : 'On its footing' }),
  build: (p, m) => {
    const g = group(block(0.9, 0.3, 0.9, m.concrete(), 0, 0, 0, 0.01), block(0.3, 4.1, 0.3, m.concrete(), 0, 0.3, 0, 0.005))
    if (on(p, 'beam')) g.add(block(0.3, 0.45, 6.4, m.concrete(), 0, 4.33, 0, 0.005))
    return g
  },
}

const PANEL_TYPE = {
  key: 'type', label: 'Panel', default: 'window',
  choices: [{ value: 'window', label: 'Window' }, { value: 'door', label: 'Door' }, { value: 'plain', label: 'Plain' }],
}
const PANEL_H = 4.48

const wallPanels: ModelDef = {
  options: [PANEL_TYPE],
  readout: (p) => ({ title: `${choiceLabel(PANEL_TYPE, p)} panel`, subtitle: 'Station building wall panel' }),
  build: (p, m) => {
    const type = str(p, 'type')
    const s = rectShape(5.98, PANEL_H, 0, PANEL_H / 2)
    if (type === 'window') s.holes.push(rectHole(2.4, 1.4, 0, PANEL_H * 0.55))
    if (type === 'door') s.holes.push(rectHole(2.2, 2.7, 0, 1.35))
    const g = group(mesh(extrudeZ(s, 0.15, 0.005), m.concrete()))
    if (type === 'window') g.add(mesh(new THREE.BoxGeometry(2.4, 1.4, 0.02), m.plastic('#56616b'), 0, PANEL_H * 0.55, 0))
    if (type === 'door') g.add(mesh(new THREE.BoxGeometry(2.2, 2.7, 0.04), m.dark, 0, 1.35, 0))
    return g
  },
}

const nameBoards: ModelDef = {
  readout: () => ({ title: 'Station name board', subtitle: 'Precast board on precast posts' }),
  build: (_p, m) => {
    const w = 3.2
    const hgt = 0.9
    const postH = 2.6
    const face = m.painted('board-baripada', () => textTexture([{ text: 'BARIPADA', size: 108 }], '#f0c22e', INK, 640, 180), 0.7)
    const g = group(block(w, hgt, 0.12, yellowPaint(m), 0, postH - hgt, 0), ...plates(face, w - 0.06, hgt - 0.06, postH - hgt / 2, 0.061))
    for (const s of [-1, 1]) g.add(block(0.18, postH, 0.18, m.concrete(), s * (w / 2 - 0.25), 0, 0))
    return g
  },
}

// Foot over bridge, in the station's layout with the platform level at y = 0
const FOB = { half: 1.5, z0: -8.4, z1: 8.4, soffit: 6.28, deck: 7.08 }
const RISE = FOB.deck / 2
const RUN = 6.7

// One dog-leg stair: flight from the deck down to a mid landing, then a flight to the platform
function dogLeg(m: Materials, zA: number, zB: number, zMid: number) {
  const flight = flightGeo(24, RISE, RUN, 1.6)
  const x0 = -FOB.half
  const a = mesh(flight, m.concrete(), x0, RISE, zA)
  a.rotation.y = Math.PI
  const g = group(a, block(1.6, 0.2, 3.6, m.concrete(), x0 - RUN - 0.8, RISE - 0.2, zMid, 0.004), mesh(flight, m.concrete(), x0 - RUN, 0, zB))
  for (const z of [zMid - 1.4, zMid + 1.4]) g.add(block(0.3, RISE - 0.2, 0.3, m.concrete(), x0 - RUN - 0.8, 0, z))
  return g
}

const footOverBridge: ModelDef = {
  toggles: [{ key: 'stairs', label: 'Staircases', default: true }],
  readout: (p) => ({ title: 'Foot over bridge', subtitle: on(p, 'stairs') ? 'Piers, girders, deck, parapets and stairs' : 'Piers, girders, deck and parapets' }),
  build: (p, m) => {
    const c = m.concrete()
    const len = FOB.z1 - FOB.z0
    const g = new THREE.Group()
    for (const z of [FOB.z0 + 0.4, FOB.z1 - 0.4]) for (const x of [-1.2, 1.2]) g.add(block(0.5, FOB.soffit, 0.5, c, x, 0, z, 0.006))
    const girder = extrudeZ(polyShape([[-0.2, 0], [0.2, 0], [0.2, 0.12], [0.075, 0.2], [0.075, 0.42], [0.2, 0.5], [0.2, 0.6], [-0.2, 0.6], [-0.2, 0.5], [-0.075, 0.42], [-0.075, 0.2], [-0.2, 0.12]]), len, 0.004)
    for (const x of [-1.2, 1.2]) g.add(mesh(girder, c, x, FOB.soffit, 0))
    const section = rectShape(1.2, 0.2, 0, 0.1)
    for (let k = 0; k < 5; k++) section.holes.push(circleHole(0.065, -0.47 + k * 0.235, 0.1))
    const deck = extrudeZ(section, FOB.half * 2)
    deck.rotateY(Math.PI / 2)
    for (let k = 0; k < Math.round(len / 1.2); k++) g.add(mesh(deck, c, 0, FOB.soffit + 0.6, FOB.z0 + 0.6 + k * 1.2))
    const parapet = new THREE.BoxGeometry(0.12, 1.1, 2.38).translate(0, 0.55, 0)
    const stairs = on(p, 'stairs')
    for (const x of [-FOB.half + 0.06, FOB.half - 0.06]) {
      for (let k = 0; k < 7; k++) {
        // Openings for the stairs at each end
        if (stairs && x < 0 && (k === 0 || k === 6)) continue
        g.add(mesh(parapet, c, x, FOB.deck, FOB.z0 + 1.2 + k * 2.4))
      }
    }
    if (stairs) g.add(dogLeg(m, FOB.z0 + 1.0, FOB.z0 - 1.0, FOB.z0), dogLeg(m, FOB.z1 - 1.0, FOB.z1 + 1.0, FOB.z1))
    return g
  },
}

const staircases: ModelDef = {
  readout: () => ({ title: 'Dog-leg staircase', subtitle: 'Two precast flights and a landing' }),
  build: (_p, m) => {
    // Top landing where the stair meets the bridge deck
    const g = dogLeg(m, 1.0, -1.0, 0)
    g.add(block(1.6, 0.2, 1.8, m.concrete(), -FOB.half + 0.8, FOB.deck - 0.2, 1.0, 0.004))
    for (const z of [0.3, 1.7]) g.add(block(0.3, FOB.deck - 0.2, 0.3, m.concrete(), -FOB.half + 1.3, 0, z))
    return g
  },
}

const pickets: ModelDef = {
  readout: () => ({ title: 'Picket boundary wall', subtitle: 'Precast posts and pickets on a plinth' }),
  build: (_p, m) => {
    const c = m.concrete()
    const g = group(block(5.2, 0.4, 0.18, c))
    for (const x of [-2.5, 0, 2.5]) g.add(block(0.15, 1.7, 0.15, c, x, 0, 0))
    for (let x = -2.4; x <= 2.41; x += 0.2) if (Math.abs(x) > 0.1 && Math.abs(Math.abs(x) - 2.5) > 0.1) g.add(block(0.07, 1.15, 0.05, c, x, 0.4, 0))
    return g
  },
}

export const railwayModels: Record<RailModelId, ModelDef> = {
  'rail-sleepers': sleepers,
  'rail-km-stone': kmStones,
  'rail-gradient-post': gradientPosts,
  'rail-fouling-mark': foulingMarks,
  'rail-coping': coping,
  'rail-shed-footing': shedFootings,
  'rail-column': columns,
  'rail-wall-panel': wallPanels,
  'rail-name-board': nameBoards,
  'rail-fob': footOverBridge,
  'rail-staircase': staircases,
  'rail-picket-fence': pickets,
}
