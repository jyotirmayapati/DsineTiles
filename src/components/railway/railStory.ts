import * as THREE from 'three'
import type { Materials } from '../viewer3d/materials'
import { MODELS } from '../viewer3d/models'
import { block, circleHole, extrudeZ, instances, mesh, polyShape, rectHole, rectShape } from '../viewer3d/helpers'
import { clamp01, createParts, flatten, ownedMaterials, shade, type CameraKey, type StoryDef, type StoryLabel, type StoryWorld } from '../story/kit'

// The railways page story: a station built from bare formation to an arriving train.
// x runs along the track, z across it, y up. Ground top is y = 0; the model is a cut-away block.

const PLATE = { x: 46, z0: -22, z1: 22, depth: 1.6 }
const T1 = -1.6 // track 1 centre (platform 1 side)
const T2 = 3.7 // track 2 centre
const HALF_GAUGE = 0.838 // broad gauge 1676 mm
const RAIL_TOP = 0.66
const P1 = { face: -3.38, back: -11.28 } // platform 1: wall face (coping nose 0.1 m further out) to back edge
const P2 = { face: 5.48, back: 11.38 }
const PLAT_X = 30 // platforms run from -30 to 30
const PLAT_TOP = 0.82 // paving level
const CULVERT_X = 36
const DRAIN_Z = (T1 + T2) / 2
const TRENCH_Z = 12.3

const KEYS: CameraKey[] = [
  { target: [6, -0.6, 2], az: 28, el: 30, dist: 122 },
  { target: [-18, 0.4, 1], az: 62, el: 20, dist: 30 },
  { target: [-5, 0.8, 0], az: 30, el: 34, dist: 48 },
  { target: [-12, 2.6, 1], az: 82, el: 4, dist: 30 },
  { target: [0, 3.2, -15], az: 200, el: 24, dist: 46 },
  { target: [16, 4.5, 1], az: 70, el: 16, dist: 36 },
  { target: [0, 1.5, 0], az: 28, el: 30, dist: 80 },
  { target: [6, 2.2, -4], az: 78, el: 9, dist: 34 },
]

const LABELS: StoryLabel[] = [
  { stage: 0, pos: [CULVERT_X, 0.05, 17], text: 'Box culvert', productId: 'box-culverts' },
  { stage: 0, pos: [-6, 0.05, DRAIN_Z], text: 'U drain between tracks', productId: 'u-drains' },
  { stage: 0, pos: [-12, 0.05, TRENCH_Z], text: 'Cable trench', productId: 'cable-trays' },
  { stage: 1, pos: [-22, 0.5, T1], text: 'PSC sleepers' },
  { stage: 1, pos: [-38, 0.65, 6.1], text: 'Km stone' },
  { stage: 1, pos: [-34, 1.05, 6.1], text: 'Gradient post' },
  { stage: 1, pos: [42, 0.35, DRAIN_Z], text: 'Fouling mark' },
  { stage: 2, pos: [-12, 0.4, P1.face], text: 'Platform wall', productId: 'retaining-walls' },
  { stage: 2, pos: [-4, 0.86, P1.face - 0.1], text: 'Coping' },
  { stage: 2, pos: [4, 0.84, P1.face - 0.8], text: 'Tactile tiles', productId: 'chequered-tiles' },
  { stage: 2, pos: [-2, 0.84, -9], text: 'Pavers', productId: 'pavers' },
  { stage: 3, pos: [-12, 1.1, -7.4], text: 'Shed footing' },
  { stage: 3, pos: [-18, 3, -7.4], text: 'Precast column' },
  { stage: 3, pos: [-6, 5.4, -4.6], text: 'Cantilever beam', productId: 'precast-beams' },
  { stage: 4, pos: [0, 5.6, -15], text: 'Hollow-core roof', productId: 'precast-slabs' },
  { stage: 4, pos: [-9, 2.4, -18.5], text: 'Wall panels' },
  { stage: 4, pos: [2.5, 6.0, -18.6], text: 'Station name board' },
  { stage: 5, pos: [21, 8.2, 1], text: 'Foot over bridge' },
  { stage: 5, pos: [21, 7.4, 4], text: 'Precast girders', productId: 'precast-beams' },
  { stage: 5, pos: [15, 2.6, -8.4], text: 'Precast staircase' },
  { stage: 6, pos: [-10, 1.3, -21.4], text: 'Picket fence', productId: 'walls-and-fencing' },
  { stage: 6, pos: [-15, 1.3, -10.3], text: 'Bench', productId: 'furniture-and-decor' },
]

// Painted text for boards and markers, drawn once to a canvas
function textTexture(lines: { text: string; size: number }[], bg: string, fg: string, w = 512, h = 160) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const total = lines.reduce((a, l) => a + l.size * 1.15, 0)
  let y = h / 2 - total / 2
  for (const l of lines) {
    ctx.font = `800 ${l.size}px Archivo, Arial, sans-serif`
    y += (l.size * 1.15) / 2
    ctx.fillText(l.text, w / 2, y)
    y += (l.size * 1.15) / 2
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

// Cut-away ground block with open channels: boxes fill every cell of a grid around the voids
function groundBlock(voids: { x0: number; x1: number; z0: number; z1: number; depth: number }[], mat: THREE.Material) {
  const xs = new Set([-PLATE.x, PLATE.x])
  const zs = new Set([PLATE.z0, PLATE.z1])
  voids.forEach((v) => { xs.add(v.x0); xs.add(v.x1); zs.add(v.z0); zs.add(v.z1) })
  const X = [...xs].sort((a, b) => a - b)
  const Z = [...zs].sort((a, b) => a - b)
  const g = new THREE.Group()
  for (let i = 0; i < X.length - 1; i++) {
    for (let j = 0; j < Z.length - 1; j++) {
      const cx = (X[i] + X[i + 1]) / 2
      const cz = (Z[j] + Z[j + 1]) / 2
      const cut = Math.max(0, ...voids.filter((v) => cx > v.x0 && cx < v.x1 && cz > v.z0 && cz < v.z1).map((v) => v.depth))
      const h = PLATE.depth - cut
      if (h <= 0.001) continue
      g.add(block(X[i + 1] - X[i], h, Z[j + 1] - Z[j], mat, cx, -PLATE.depth, cz))
    }
  }
  return flatten(g)
}

// Precast stair flight descending toward +x from (0, rise) to (run, 0), extruded across `width`
function flightGeo(risers: number, rise: number, run: number, width: number) {
  const r = rise / risers
  const g = run / risers
  const pts: [number, number][] = [[0, rise]]
  for (let i = 0; i < risers; i++) pts.push([(i + 1) * g, rise - i * r], [(i + 1) * g, rise - (i + 1) * r])
  pts.push([0, rise - 0.28])
  return extrudeZ(polyShape(pts), width)
}

// Simple figure: legs, torso, head. Muted clothing so people read as people without stealing the scene.
function person(m: Materials, own: <T extends THREE.Material>(mat: T) => T, shirt: string, legs: string, skin: string, h = 1) {
  const p = new THREE.Group()
  const legMat = m.plastic(legs)
  p.add(mesh(new THREE.BoxGeometry(0.13 * h, 0.85 * h, 0.16 * h).translate(-0.085 * h, 0.425 * h, 0), legMat))
  p.add(mesh(new THREE.BoxGeometry(0.13 * h, 0.85 * h, 0.16 * h).translate(0.085 * h, 0.425 * h, 0), legMat))
  p.add(mesh(new THREE.CapsuleGeometry(0.19 * h, 0.42 * h, 4, 10).translate(0, 1.18 * h, 0), m.plastic(shirt)))
  p.add(mesh(new THREE.SphereGeometry(0.115 * h, 12, 8).translate(0, 1.63 * h, 0), own(new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 }))))
  return flatten(p)
}

function buildStation(m: Materials): StoryWorld {
  const root = new THREE.Group()
  const { parts, add } = createParts(root)
  const { own, dispose } = ownedMaterials()
  const concrete = m.concrete()
  const plate = own(new THREE.MeshStandardMaterial({ roughness: 0.92 }))
  const glass = own(new THREE.MeshStandardMaterial({ color: '#56616b', roughness: 0.15, metalness: 0.4, emissive: '#ffd9a0', emissiveIntensity: 0 }))
  const lamp = m.lamp(true)

  // Ground block with channels for the culvert, the drain between the tracks and the cable trench
  const culvertW = 1.2 + 2 * (0.1 + 0.065 * 1.2)
  root.add(groundBlock([
    { x0: CULVERT_X - culvertW / 2, x1: CULVERT_X + culvertW / 2, z0: PLATE.z0, z1: PLATE.z1, depth: culvertW },
    { x0: -40, x1: 40, z0: DRAIN_Z - 0.44, z1: DRAIN_Z + 0.44, depth: 0.74 },
    { x0: -PLAT_X, x1: PLAT_X, z0: TRENCH_Z - 0.25, z1: TRENCH_Z + 0.25, depth: 0.43 },
  ], plate))

  // ---------- Stage 0: formation and drainage ----------
  for (let g = 0; g < 7; g++) {
    const grp = new THREE.Group()
    for (let k = 0; k < 3; k++) {
      const unit = MODELS['box-culverts'].build({ size: '1200x1200', run: false }, m)
      unit.position.z = PLATE.z0 + 1.03 + (g * 3 + k) * 2.05
      grp.add(unit)
    }
    const run = flatten(grp)
    run.position.set(CULVERT_X, -culvertW, 0)
    add(run, 0, 0.05 + g * 0.03, [0, 6, 0])
  }
  const drainUnits: number[] = []
  for (let x = -38.975; x < 40; x += 2.05) if (Math.abs(x - CULVERT_X) > culvertW / 2 + 1.05) drainUnits.push(x)
  for (let k = 0; k < drainUnits.length; k += 3) {
    const grp = new THREE.Group()
    for (const x of drainUnits.slice(k, k + 3)) {
      const unit = MODELS['u-drains'].build({ size: '600', load: '25T', cover: false }, m)
      unit.rotation.y = Math.PI / 2
      unit.position.x = x
      grp.add(unit)
    }
    const run = flatten(grp)
    run.position.set(0, -0.735, DRAIN_Z)
    add(run, 0, 0.2 + (k / drainUnits.length) * 0.25, [0, 4, 0])
  }
  for (let k = 0; k < 10; k++) {
    const grp = new THREE.Group()
    for (const n of [0, 1]) {
      const t = MODELS['cable-trays'].build({ covers: true, cables: false }, m)
      t.rotation.y = Math.PI / 2
      t.position.x = -28.5 + (k * 2 + n) * 3
      grp.add(t)
    }
    const run = flatten(grp)
    run.position.set(0, -0.425, TRENCH_Z)
    add(run, 0, 0.3 + k * 0.015, [0, 3, 0])
  }

  // ---------- Stage 1: track ----------
  const ballast = m.concrete('#7f7a74')
  const bedGeo = extrudeZ(polyShape([[-1.9, 0], [1.9, 0], [1.6, 0.35], [-1.6, 0.35]]), PLATE.x * 2 / 3)
  bedGeo.rotateY(Math.PI / 2)
  for (const z of [T1, T2]) {
    for (let s = 0; s < 3; s++) add(mesh(bedGeo, ballast, -PLATE.x + (s + 0.5) * (PLATE.x * 2 / 3), 0, z), 1, s * 0.05 + (z === T2 ? 0.04 : 0), [0, 2, 0])
  }
  const sleeperGeo = new THREE.BoxGeometry(0.26, 0.2, 2.75).translate(0, 0.1, 0)
  const sleeperX = Array.from({ length: 141 }, (_, i) => -45.5 + i * 0.65)
  for (const z of [T1, T2]) {
    for (let c = 0; c < 7; c++) {
      const items = sleeperX.slice(c * 21, c * 21 + 21).map((x) => ({ x, y: 0.3, z: 0 }))
      const run = shade(instances(sleeperGeo, concrete, items), 400 + c + z, 0.9)
      run.position.z = z
      add(run, 1, 0.12 + c * 0.03 + (z === T2 ? 0.02 : 0), [0, 3, 0])
    }
  }
  const railGeo = new THREE.BoxGeometry(PLATE.x * 2 / 3, 0.16, 0.07).translate(0, 0.08, 0)
  for (const z of [T1, T2]) {
    for (const side of [-1, 1]) {
      for (let s = 0; s < 3; s++) {
        add(mesh(railGeo, m.steel, -PLATE.x + (s + 0.5) * (PLATE.x * 2 / 3), RAIL_TOP - 0.16, z + side * HALF_GAUGE), 1, 0.36 + s * 0.03, [0, 2.5, 0])
      }
    }
  }
  // Track markers: km stone, gradient post and fouling mark, painted as on Indian Railways
  const white = own(new THREE.MeshStandardMaterial({ color: '#eceae4', roughness: 0.8 }))
  const kmFace = own(new THREE.MeshStandardMaterial({ map: textTexture([{ text: '247', size: 120 }], '#eceae4', '#1d1f21', 256, 200), roughness: 0.8 }))
  const kmShape = new THREE.Shape()
  kmShape.moveTo(-0.18, 0)
  kmShape.lineTo(0.18, 0)
  kmShape.lineTo(0.18, 0.45)
  kmShape.absarc(0, 0.45, 0.18, 0, Math.PI, false)
  kmShape.closePath()
  const km = new THREE.Group()
  km.add(mesh(extrudeZ(kmShape, 0.15), white))
  const kmPlate = mesh(new THREE.PlaneGeometry(0.32, 0.25), kmFace, 0, 0.42, -0.076)
  kmPlate.rotation.y = Math.PI // faces the track (-z)
  km.add(kmPlate)
  km.position.set(-38, 0, 6.1)
  add(km, 1, 0.45, [0, 1.5, 0])
  const gradFace = own(new THREE.MeshStandardMaterial({ map: textTexture([{ text: '1 IN 200', size: 64 }], '#eceae4', '#1d1f21', 320, 120), roughness: 0.8 }))
  const grad = new THREE.Group()
  grad.add(block(0.12, 1.0, 0.12, white, 0, 0, 0))
  grad.add(block(0.62, 0.24, 0.06, white, 0, 0.82, 0))
  const gradPlate = mesh(new THREE.PlaneGeometry(0.58, 0.2), gradFace, 0, 0.94, -0.031)
  gradPlate.rotation.y = Math.PI
  grad.add(gradPlate)
  grad.position.set(-34, 0, 6.1)
  add(grad, 1, 0.47, [0, 1.5, 0])
  const bandTex = textTexture([], '#eceae4', '#1d1f21', 64, 64)
  const bandCtx = (bandTex.image as HTMLCanvasElement).getContext('2d')!
  bandCtx.fillStyle = '#1d1f21'
  for (let i = 0; i < 4; i += 2) bandCtx.fillRect(0, i * 16, 64, 16)
  bandTex.needsUpdate = true
  const fouling = mesh(new THREE.BoxGeometry(0.16, 0.42, 0.16).translate(0, 0.21, 0), own(new THREE.MeshStandardMaterial({ map: bandTex, roughness: 0.8 })), 42, 0, DRAIN_Z)
  add(fouling, 1, 0.48, [0, 1.5, 0])

  // ---------- Stage 2: platforms ----------
  // Precast cantilever wall: stem on the track face, heel under the fill. Profile u (into the platform) × y
  const wallGeo = extrudeZ(polyShape([[0, 0], [0.7, 0], [0.7, 0.12], [0.15, 0.12], [0.15, 0.76], [0, 0.76]]), 2.4)
  const copingGeo = extrudeZ(polyShape([[-0.1, 0.78], [-0.1, 0.84], [0.5, 0.84], [0.5, 0.76], [0, 0.76], [0, 0.78]]), 0.6)
  const tactileGeo = new THREE.BoxGeometry(0.3, 0.06, 0.3).translate(0, 0.03, 0)
  const paverGeo = new THREE.BoxGeometry(0.4, 0.06, 0.2).translate(0, 0.03, 0)
  const yellow = own(new THREE.MeshStandardMaterial({ color: '#e3b42a', roughness: 0.6 }))
  const fill = m.concrete('#a29d95')
  for (const [P, dir, seed] of [[P1, -1, 1], [P2, 1, 2]] as const) {
    const ry = dir < 0 ? Math.PI / 2 : -Math.PI / 2 // profile u axis points into the platform
    const at = (u: number) => P.face + dir * u
    const delay = seed === 2 ? 0.06 : 0
    add(shade(instances(wallGeo, concrete, Array.from({ length: 25 }, (_, k) => ({ x: -28.8 + k * 2.4, y: 0, z: 0, ry }))), 50 + seed, 0.9).translateZ(P.face), 2, delay, [0, 3, 0])
    const depth = Math.abs(P.back - P.face) - 0.15
    add(block(PLAT_X * 2, 0.76, depth, fill, 0, 0, at(0.15 + depth / 2)), 2, 0.08 + delay, [0, -0.8, 0])
    add(shade(instances(copingGeo, concrete, Array.from({ length: 100 }, (_, k) => ({ x: -29.7 + k * 0.6, y: 0, z: 0, ry }))), 60 + seed, 0.9).translateZ(P.face), 2, 0.18 + delay, [0, 2, 0])
    add(block(PLAT_X * 2, 0.004, 0.25, yellow, 0, 0.84, at(0.125)), 2, 0.24 + delay, [0, 1, 0])
    const tiles: { x: number; y: number; z: number }[] = []
    for (let r = 0; r < 2; r++) for (let c = 0; c < 200; c++) tiles.push({ x: -29.85 + c * 0.3, y: 0.76, z: at(0.65 + r * 0.3) })
    add(shade(instances(tactileGeo, m.concrete('#b8b3aa'), tiles), 0, 0, (i) => ((Math.floor(i / 200) + i) % 2 ? 0.84 : 1)), 2, 0.26 + delay, [0, 1.5, 0])
    const rows = Math.floor((depth - 0.95) / 0.2)
    for (let chunk = 0; chunk < 4; chunk++) {
      const items: { x: number; y: number; z: number }[] = []
      for (let r = Math.floor((chunk * rows) / 4); r < Math.floor(((chunk + 1) * rows) / 4); r++) {
        for (let c = 0; c < 150; c++) {
          const x = -29.8 + c * 0.4 + (r % 2 ? 0.2 : 0)
          if (x > PLAT_X - 0.2) continue
          items.push({ x, y: 0.76, z: at(1.2 + r * 0.2) })
        }
      }
      add(shade(instances(paverGeo, m.concrete('#aaa59d'), items), 70 + chunk + seed * 10, 0.86), 2, 0.3 + chunk * 0.04 + delay, [0, 1.5, 0])
    }
  }

  // ---------- Stage 3: platform sheds ----------
  const shedX = [-24, -18, -12, -6, 0, 6]
  const metal = own(new THREE.MeshStandardMaterial({ color: '#676c72', roughness: 0.45, metalness: 0.5 }))
  for (const [zc, seed] of [[-7.4, 0], [8.43, 1]] as const) {
    const d = seed * 0.05
    shedX.forEach((x, i) => add(block(0.9, 0.3, 0.9, concrete, x, PLAT_TOP, zc, 0.01), 3, d + i * 0.02, [0, 4, 0]))
    shedX.forEach((x, i) => add(block(0.3, 4.1, 0.3, concrete, x, PLAT_TOP + 0.3, zc, 0.005), 3, 0.12 + d + i * 0.02, [0, 8, 0]))
    shedX.forEach((x, i) => add(block(0.3, 0.45, 6.4, concrete, x, 5.15, zc, 0.005), 3, 0.24 + d + i * 0.02, [0, 4, 0]))
    add(block(31, 0.3, 0.3, concrete, -9, 5.3, zc, 0.005), 3, 0.3 + d, [0, 4, 0])
    add(block(33, 0.06, 6.8, metal, -9, 5.6, zc), 3, 0.38 + d, [0, 3, 0])
    // Lamp strips under the roof: lit at night
    add(instances(new THREE.BoxGeometry(1.2, 0.03, 0.12).translate(0, 0.015, 0), lamp,
      shedX.flatMap((x) => [{ x: x + 3, y: 5.08, z: zc - 1.8 }, { x: x + 3, y: 5.08, z: zc + 1.8 }])), 3, 0.42 + d, [0, 3, 0])
  }

  // ---------- Stage 4: station building on platform 1 ----------
  const SB = { x0: -15, x1: 15, zf: -11.6, zb: -18.2, h: 4.5 }
  add(block(30.6, PLAT_TOP, 7.2, fill, 0, 0, (SB.zf + SB.zb) / 2), 4, 0, [0, -0.9, 0])
  const sbX = [-15, -9, -3, 3, 9, 15]
  sbX.forEach((x, i) => [SB.zf, SB.zb].forEach((z) => add(block(0.35, SB.h, 0.35, concrete, x, PLAT_TOP, z, 0.005), 4, 0.04 + i * 0.015, [0, 7, 0])))
  for (const z of [SB.zf, SB.zb]) for (let i = 0; i < 5; i++) add(block(5.65, 0.5, 0.3, concrete, -12 + i * 6, PLAT_TOP + SB.h - 0.5, z, 0.005), 4, 0.14 + i * 0.015, [0, 5, 0])
  const sbSlab = rectShape(1.2, 0.2, 0, 0.1)
  for (let k = 0; k < 5; k++) sbSlab.holes.push(circleHole(0.065, -0.47 + k * 0.235, 0.1))
  const sbSlabGeo = extrudeZ(sbSlab, Math.abs(SB.zb - SB.zf) + 0.2)
  for (let b = 0; b < 5; b++) {
    const bay = shade(instances(sbSlabGeo, concrete, Array.from({ length: 5 }, (_, k) => ({ x: -14.4 + b * 6 + k * 1.2, y: 0, z: 0 }))), 0, 0, (k) => (k % 2 ? 0.94 : 1))
    bay.position.set(0, PLAT_TOP + SB.h, (SB.zf + SB.zb) / 2)
    add(bay, 4, 0.22 + b * 0.03, [0, 5, 0])
  }
  const panelH = SB.h - 0.02
  const winPanel = (() => { const s = rectShape(5.98, panelH, 0, panelH / 2); s.holes.push(rectHole(2.4, 1.4, 0, panelH * 0.55)); return extrudeZ(s, 0.15, 0.005) })()
  const doorPanel = (() => { const s = rectShape(5.98, panelH, 0, panelH / 2); s.holes.push(rectHole(2.2, 2.7, 0, 1.35)); return extrudeZ(s, 0.15, 0.005) })()
  const paneGeo = new THREE.PlaneGeometry(2.4, 1.4)
  const doorGeo = new THREE.PlaneGeometry(2.2, 2.7)
  for (let i = 0; i < 5; i++) {
    const x = -12 + i * 6
    const door = i === 2
    const front = mesh(door ? doorPanel : winPanel, concrete, x, PLAT_TOP, SB.zf + 0.25)
    const fill2 = new THREE.Mesh(door ? doorGeo : paneGeo, door ? m.dark : glass)
    fill2.position.y = door ? 1.35 : panelH * 0.55
    front.add(fill2)
    add(front, 4, 0.32 + i * 0.03, [0, 0, 7])
    // Road side: the entrance faces the approach, as at most stations
    const back = mesh(door ? doorPanel : winPanel, concrete, x, PLAT_TOP, SB.zb - 0.25)
    const fill3 = new THREE.Mesh(door ? doorGeo : paneGeo, door ? m.dark : glass)
    fill3.position.y = door ? 1.35 : panelH * 0.55
    fill3.rotation.y = Math.PI
    back.add(fill3)
    add(back, 4, 0.36 + i * 0.02, [0, 0, -7])
  }
  for (const side of [-1, 1]) {
    const p = mesh(extrudeZ(rectShape(6.95, panelH, 0, panelH / 2), 0.15, 0.005), concrete, side * (SB.x1 + 0.25), PLAT_TOP, (SB.zf + SB.zb) / 2)
    p.rotation.y = Math.PI / 2
    add(p, 4, 0.38, [side * 7, 0, 0])
  }
  // Station name boards: precast boards on precast posts, painted yellow with black lettering
  const boardTex = textTexture([{ text: 'BARIPADA', size: 108 }], '#f0c22e', '#1d1f21', 640, 180)
  const boardMat = own(new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.7 }))
  const nameBoard = (x: number, z: number, facing: 1 | -1, w = 3.2, hgt = 0.9, postH = 2.6) => {
    const g = new THREE.Group()
    for (const s of [-1, 1]) g.add(block(0.18, postH, 0.18, concrete, s * (w / 2 - 0.25), 0, 0))
    g.add(block(w, hgt, 0.12, yellow, 0, postH - hgt, 0))
    const face = mesh(new THREE.PlaneGeometry(w - 0.06, hgt - 0.06), boardMat, 0, postH - hgt / 2, facing * 0.061)
    if (facing < 0) face.rotation.y = Math.PI
    g.add(face)
    g.position.set(x, PLAT_TOP, z)
    return g
  }
  add(nameBoard(26, -4.9, 1), 4, 0.44, [0, 3, 0])
  add(nameBoard(26, 7.0, -1), 4, 0.46, [0, 3, 0])
  // Big name board over the entrance, facing the approach road
  const facade = new THREE.Group()
  facade.add(block(8, 1.0, 0.14, yellow, 0, 0, 0))
  const facadeFace = mesh(new THREE.PlaneGeometry(7.94, 0.94), boardMat, 0, 0.5, -0.071)
  facadeFace.rotation.y = Math.PI
  facade.add(facadeFace)
  facade.position.set(0, PLAT_TOP + SB.h + 0.2, SB.zb - 0.1)
  add(facade, 4, 0.48, [0, 3, 0])

  // ---------- Stage 5: foot over bridge with precast stairs ----------
  const FOB = { x0: 19.5, x1: 22.5, z0: -7.4, z1: 9.4, soffit: 7.1, deck: 7.9 }
  for (const z of [-7.0, 9.0]) for (const x of [19.8, 22.2]) add(block(0.5, FOB.soffit - PLAT_TOP, 0.5, concrete, x, PLAT_TOP, z, 0.006), 5, (z > 0 ? 0.05 : 0), [0, 9, 0])
  const girderGeo = extrudeZ(polyShape([[-0.2, 0], [0.2, 0], [0.2, 0.12], [0.075, 0.2], [0.075, 0.42], [0.2, 0.5], [0.2, 0.6], [-0.2, 0.6], [-0.2, 0.5], [-0.075, 0.42], [-0.075, 0.2], [-0.2, 0.12]]), FOB.z1 - FOB.z0, 0.004)
  for (const x of [19.8, 22.2]) add(mesh(girderGeo, concrete, x, FOB.soffit, (FOB.z0 + FOB.z1) / 2), 5, 0.12, [0, 5, 0])
  const deckSection = rectShape(1.2, 0.2, 0, 0.1)
  for (let k = 0; k < 5; k++) deckSection.holes.push(circleHole(0.065, -0.47 + k * 0.235, 0.1))
  const deckGeo = extrudeZ(deckSection, FOB.x1 - FOB.x0)
  deckGeo.rotateY(Math.PI / 2)
  const deckCount = Math.round((FOB.z1 - FOB.z0) / 1.2)
  add(shade(instances(deckGeo, concrete, Array.from({ length: deckCount }, (_, k) => ({ x: (FOB.x0 + FOB.x1) / 2, y: FOB.soffit + 0.6, z: FOB.z0 + 0.6 + k * 1.2 }))), 0, 0, (k) => (k % 2 ? 0.94 : 1)), 5, 0.2, [0, 4, 0])
  const parapets: { x: number; y: number; z: number; ry: number }[] = []
  for (const x of [FOB.x0 + 0.06, FOB.x1 - 0.06]) {
    for (let k = 0; k < 7; k++) {
      // Leave the stair openings at each end of the deck clear
      if (x < FOB.x0 + 1 && (k === 0 || k === 6)) continue
      parapets.push({ x, y: FOB.deck, z: FOB.z0 + 1.2 + k * 2.4, ry: Math.PI / 2 })
    }
  }
  add(shade(instances(new THREE.BoxGeometry(2.38, 1.1, 0.12).translate(0, 0.55, 0), concrete, parapets), 90, 0.9), 5, 0.28, [0, 3, 0])
  // Dog-leg stairs: flight A from the deck to a mid landing, flight B down to the platform
  const RISERS = 24
  const rise = (FOB.deck - PLAT_TOP) / 2
  const run = 6.7
  const flight = flightGeo(RISERS, rise, run, 1.6)
  const mid = PLAT_TOP + rise
  for (const [zA, zB, zMid, dz] of [[-6.4, -8.4, -7.4, -1], [8.4, 10.4, 9.4, 1]] as const) {
    const d = dz > 0 ? 0.04 : 0
    const a = mesh(flight, concrete, FOB.x0, mid, zA)
    a.rotation.y = Math.PI // descends toward -x
    add(a, 5, 0.32 + d, [0, 4, 0])
    add(block(1.6, 0.2, 3.6, concrete, FOB.x0 - run - 0.8, mid - 0.2, zMid, 0.004), 5, 0.36 + d, [0, 4, 0])
    for (const z of [zMid - 1.4, zMid + 1.4]) add(block(0.3, mid - 0.2 - PLAT_TOP, 0.3, concrete, FOB.x0 - run - 0.8, PLAT_TOP, z), 5, 0.3 + d, [0, 5, 0])
    add(mesh(flight, concrete, FOB.x0 - run, PLAT_TOP, zB), 5, 0.4 + d, [0, 4, 0])
  }

  // ---------- Stage 6: boundary, furniture, lighting and people ----------
  const pickets: { x: number; y: number; z: number }[] = []
  const posts: { x: number; y: number; z: number }[] = []
  for (const z of [-21.4, 21.4]) {
    add(block(PLATE.x * 2 - 0.4, 0.4, 0.18, concrete, 0, 0, z), 6, z > 0 ? 0.05 : 0, [0, 2, 0])
    for (let x = -45.6; x <= 45.6; x += 0.2) pickets.push({ x, y: 0.4, z })
    for (let x = -45; x <= 45; x += 2.5) posts.push({ x, y: 0, z })
  }
  add(shade(instances(new THREE.BoxGeometry(0.15, 1.7, 0.15).translate(0, 0.85, 0), concrete, posts), 120, 0.9), 6, 0.06, [0, 3, 0])
  add(shade(instances(new THREE.BoxGeometry(0.07, 1.15, 0.05).translate(0, 0.575, 0), concrete, pickets), 121, 0.9), 6, 0.12, [0, 2, 0])
  const bench = MODELS['furniture-and-decor']
  ;[[-27, -10.3], [-15, -10.3], [-3, -10.3], [-21, 10.6], [-9, 10.6]].forEach(([x, z], i) => {
    const b = flatten(bench.build({ item: 'bench' }, m))
    b.position.set(x, PLAT_TOP, z)
    add(b, 6, 0.16 + i * 0.02, [0, 2, 0])
  })
  ;[[26, -9.6], [26, 10.4]].forEach(([x, z], i) => {
    const l = flatten(MODELS['light-poles'].build({ style: 'post', lit: true }, m))
    l.position.set(x, PLAT_TOP, z)
    add(l, 6, 0.2 + i * 0.03, [0, 6, 0])
  })
  const shirts = ['#3e5872', '#8a4b3c', '#c9a24a', '#e9e6df', '#5d6b4f', '#6a5a7a', '#b5654a', '#2f3a4a']
  const legsC = ['#34363a', '#4a4f57', '#5b4a3a', '#2a2c30']
  const skins = ['#a57a5a', '#8d6247', '#c49a74', '#7a5238']
  const crowd: [number, number, number][] = [
    [-26, -5.2, 0], [-25.2, -5.6, 1], [-19, -4.9, 0.4], [-14.5, -6.1, 2.8], [-14, -5.3, 3.4], [-8, -4.8, 0.2], [-2.5, -5.9, 1.6],
    [3, -5.1, 0], [3.7, -5.5, 2.2], [9, -4.9, 0.6], [-22, 6.6, 3.1], [-12, 7.0, 3.6], [-11.4, 6.5, 0.4], [-2, 6.8, 3.2], [7, 6.4, 1.2],
    [21, 3.0, 1.6], [20.8, -2.2, 0.2],
  ]
  crowd.forEach(([x, z, ry], i) => {
    const onBridge = Math.abs(x - 21) < 1.5
    const p = person(m, own, shirts[i % shirts.length], legsC[i % legsC.length], skins[i % skins.length], 0.94 + ((i * 37) % 10) / 100)
    p.rotation.y = ry
    p.position.set(x, onBridge ? FOB.deck : PLAT_TOP, z)
    // Walk in along the platform
    add(p, 6, 0.24 + (i % 8) * 0.025, [onBridge ? 0 : (i % 2 ? 6 : -6), 0, onBridge ? (i % 2 ? 3 : -3) : 0], 0.6)
  })
  // A few trees beyond platform 2
  const leaf = own(new THREE.MeshStandardMaterial({ color: '#76896a', roughness: 0.95, flatShading: true }))
  ;[[-36, 16, 1.2], [-22, 18, 1], [-6, 17, 1.3], [12, 18.5, 1.1], [28, 16.5, 1]].forEach(([x, z, s], i) => {
    const t = new THREE.Group()
    t.add(mesh(new THREE.CylinderGeometry(0.09 * s, 0.12 * s, 1.8 * s, 8).translate(0, 0.9 * s, 0), m.timber))
    t.add(mesh(new THREE.IcosahedronGeometry(1.0 * s, 0), leaf, 0, 2.3 * s, 0))
    const tree = flatten(t)
    tree.position.set(x, 0, z)
    add(tree, 6, 0.3 + i * 0.03, [0, -3, 0])
  })

  // ---------- Stage 7: the train arrives on track 1 ----------
  // Clipped at the block's edge, so the train appears out of the end of the model rather than in mid-air
  const clip = [new THREE.Plane(new THREE.Vector3(1, 0, 0), PLATE.x)]
  const tmat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    own(new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, clippingPlanes: clip, ...extra }))
  const body = tmat('#2f4d6e')
  const roofMat = tmat('#7c8187')
  const cream = tmat('#e8e1cf')
  const under = tmat('#2e2f33', { roughness: 0.7, metalness: 0.4 })
  const windows = tmat('#3a4652', { roughness: 0.15, metalness: 0.4, emissive: '#ffe2b0', emissiveIntensity: 0 })
  const nose = tmat('#f2b705')
  const headlight = tmat('#fffbe8', { emissive: '#fff4d0', emissiveIntensity: 0 })
  const bodyShape = new THREE.Shape()
  bodyShape.moveTo(-1.5, 0)
  bodyShape.lineTo(1.5, 0)
  bodyShape.lineTo(1.5, 2.7)
  bodyShape.quadraticCurveTo(0, 3.35, -1.5, 2.7)
  bodyShape.closePath()
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 18).rotateX(Math.PI / 2)
  const vehicle = (len: number, loco: boolean) => {
    const v = new THREE.Group()
    const shell = extrudeZ(bodyShape, len)
    shell.rotateY(Math.PI / 2)
    v.add(mesh(shell, body, 0, 1.5, 0))
    v.add(mesh(new THREE.BoxGeometry(len - 0.4, 0.1, 2.4).translate(0, 0.05, 0), roofMat, 0, 4.5, 0))
    v.add(block(len - 0.2, 0.16, 3.02, cream, 0, 2.6, 0))
    if (loco) {
      v.add(block(len - 6, 0.6, 3.02, windows, -1.5, 3.0, 0))
      v.add(block(0.06, 0.9, 2.6, windows, len / 2 + 0.01, 3.1, 0)) // windscreen
      v.add(block(0.08, 0.5, 3.02, nose, len / 2, 1.7, 0))
      v.add(block(0.06, 0.18, 0.5, headlight, len / 2 + 0.03, 3.9, 0))
    } else {
      v.add(block(len - 2.6, 0.75, 3.02, windows, 0, 3.0, 0))
      for (const s of [-1, 1]) v.add(block(0.9, 2.1, 3.03, under, s * (len / 2 - 0.9), 1.65, 0))
    }
    v.add(block(len - 2, 0.4, 2.5, under, 0, 1.1, 0))
    for (const s of [-1, 1]) {
      const bx = s * (len / 2 - 2.4)
      v.add(block(2.8, 0.35, 2.3, under, bx, 0.9, 0))
      for (const ax of [-0.9, 0.9]) for (const wz of [-0.76, 0.76]) v.add(mesh(wheelGeo, under, bx + ax, RAIL_TOP + 0.42, wz))
    }
    return v
  }
  const train = new THREE.Group()
  const consist = [{ len: 15, loco: true }, ...Array.from({ length: 4 }, () => ({ len: 13.5, loco: false }))]
  let cursor = 0
  for (const c of consist) {
    const v = vehicle(c.len, c.loco)
    v.position.x = cursor - c.len / 2
    train.add(v)
    cursor -= c.len + 0.8
  }
  const trainMerged = flatten(train)
  trainMerged.position.set(-200, 0, T1)
  root.add(trainMerged)
  const STOP_X = 27 // front of the locomotive when stopped at the platform

  return {
    root,
    parts,
    applyLook: (l) => {
      plate.color.copy(l.plate)
      lamp.emissiveIntensity = l.lamp
      glass.emissiveIntensity = l.lamp * 0.45
      windows.emissiveIntensity = l.lamp * 0.55
      headlight.emissiveIntensity = 0.6 + l.lamp
    },
    update: (progress) => {
      // The train eases in over stage 7 and stops with its nose at the far end of platform 1
      const t = clamp01((progress - 7.05) / 0.85)
      const eased = 1 - Math.pow(1 - t, 3)
      trainMerged.position.x = -130 + (STOP_X + 130) * eased
      trainMerged.visible = t > 0
    },
    dispose,
  }
}

const railStory: StoryDef = {
  keys: KEYS,
  labels: LABELS,
  shadowExtent: 48,
  ariaLabel: '3D model of a railway station assembling as you scroll: culvert, drains, track, platforms, sheds, station building, foot over bridge and an arriving train',
  build: buildStation,
}

export default railStory
