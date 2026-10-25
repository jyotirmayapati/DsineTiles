import * as THREE from 'three'
import type { Materials } from '../materials'
import type { ModelDef } from '../types'
import { num, on, str } from '../types'
import { extrudeZ, group, instances, mesh, mm, tube } from '../helpers'

// Ribbed reinforcement bar of radius r running along z
function rebar(m: Materials, r: number, len: number, y: number, x = 0) {
  const bar = mesh(new THREE.CylinderGeometry(r, r, len, 20), m.steel, x, y, 0)
  bar.rotation.x = Math.PI / 2
  const ribs = Array.from({ length: Math.floor(len / (r * 1.6)) }, (_, i) => ({
    x, y, z: -len / 2 + r + i * r * 1.6, // torus axis is already along z
  }))
  return group(bar, instances(new THREE.TorusGeometry(r, r * 0.12, 6, 20), m.steel, ribs))
}

// ---------- Cover blocks ----------

const COVER_SIZES = ['20', '25', '40', '50', '75']

// Footprint grows with the cover height so tall blocks stay stable
const coverBlockWidth = (h: number) => (h <= 0.025 ? 0.05 : h <= 0.05 ? 0.06 : 0.08)

const coverBlocks: ModelDef = {
  options: [{ key: 'size', label: 'Cover (mm)', default: '25', choices: COVER_SIZES.map((v) => ({ value: v, label: v })) }],
  toggles: [{ key: 'rebar', label: 'Rebar', default: true }],
  readout: (p) => ({ title: `${str(p, 'size')} mm cover`, subtitle: 'Cover block with binding wire' }),
  dims: (p) => {
    const h = mm(num(p, 'size'))
    const w = coverBlockWidth(h)
    return [{ view: 'front', a: [-w / 2, 0], b: [-w / 2, h], offset: [-0.025, 0], label: str(p, 'size') }]
  },
  build: (p, m) => {
    const h = mm(num(p, 'size'))
    const w = coverBlockWidth(h)
    const r = 0.008 // seat for a 16 mm bar
    // Block with a semicircular seat across the top
    const s = new THREE.Shape()
    s.moveTo(-w / 2, 0)
    s.lineTo(w / 2, 0)
    s.lineTo(w / 2, h)
    s.lineTo(r, h)
    s.absarc(0, h, r, 0, Math.PI, true)
    s.lineTo(-w / 2, h)
    s.closePath()
    const g = group(mesh(extrudeZ(s, w, 0.0015), m.concrete()))

    // Binding wire loop cast into the block
    const wireTop = h + (on(p, 'rebar') ? r * 2 + 0.01 : 0.03)
    g.add(tube([[-r - 0.003, h - 0.004, 0], [-r - 0.004, wireTop - 0.008, 0], [0, wireTop, 0], [r + 0.004, wireTop - 0.008, 0], [r + 0.003, h - 0.004, 0]], 0.0009, m.dark, 32))

    if (on(p, 'rebar')) g.add(rebar(m, r, 0.14, h))
    return g
  },
}

// ---------- Wheel spacers ----------

const wheelSpacers: ModelDef = {
  toggles: [{ key: 'rebar', label: 'Rebar', default: true }],
  readout: () => ({ title: 'Wheel spacer', subtitle: 'Clips onto the bar to hold cover on all sides' }),
  build: (p, m) => {
    const R = 0.04
    const rim = 0.007
    const hubOut = 0.014
    const hubIn = 0.0065
    const t = 0.008
    const gap = 0.35 // half-angle of the clip-on slot at the top (radians)
    const top = Math.PI / 2

    // Rim and hub are both C-shapes, open at the top so the wheel snaps over the bar
    const cShape = (ro: number, ri: number) => {
      const s = new THREE.Shape()
      s.absarc(0, 0, ro, top + gap, top - gap + Math.PI * 2, false)
      s.absarc(0, 0, ri, top - gap + Math.PI * 2, top + gap, true)
      s.closePath()
      return s
    }
    const mat = m.concrete('#b3aea6')
    const wheel = group(
      mesh(extrudeZ(cShape(R, R - rim), t, 0.001), mat),
      mesh(extrudeZ(cShape(hubOut, hubIn), t * 1.6, 0.001), mat),
    )
    // Spokes, skipping the slot
    const spokeLen = R - rim - hubOut + 0.002
    const spokes = [210, 270, 330, 30, 150].map((deg) => {
      const a = THREE.MathUtils.degToRad(deg)
      const rMid = hubOut + spokeLen / 2 - 0.001
      return { x: Math.cos(a) * rMid, y: Math.sin(a) * rMid, z: 0, rz: a }
    })
    wheel.add(instances(new THREE.BoxGeometry(spokeLen, 0.004, t * 0.8), mat, spokes))
    // Slot guides from the hub up to the rim
    for (const side of [-1, 1]) {
      const a = top + side * gap * 0.55
      const rMid = (hubOut + R - rim) / 2
      const guide = mesh(new THREE.BoxGeometry(R - rim - hubOut + 0.002, 0.0035, t), mat, Math.cos(a) * rMid, Math.sin(a) * rMid, 0)
      guide.rotation.z = a
      wheel.add(guide)
    }
    // Contact nubs around the rim keep the formwork contact to points
    const nubs = Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2)
      .filter((a) => Math.abs(((a - top + Math.PI * 3) % (Math.PI * 2)) - Math.PI) > gap)
      .map((a) => ({ x: Math.cos(a) * R, y: Math.sin(a) * R, z: 0, rz: a - Math.PI / 2 }))
    wheel.add(instances(new THREE.ConeGeometry(0.003, 0.004, 8).translate(0, 0.002, 0), mat, nubs))

    // Wheel stands upright, turning about the bar along z
    wheel.position.y = R + 0.002
    const g = group(wheel)
    if (on(p, 'rebar')) g.add(rebar(m, 0.006, 0.15, R + 0.002))
    return g
  },
}

export const hiperspacersModels = {
  'cover-blocks': coverBlocks,
  'wheel-spacers': wheelSpacers,
} satisfies Record<string, ModelDef>
