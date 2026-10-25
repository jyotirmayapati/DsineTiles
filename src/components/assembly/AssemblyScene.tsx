import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Materials } from '../viewer3d/materials'
import { LookTransition } from '../viewer3d/sceneTheme'
import type { Theme } from '../../theme'
import { MODELS } from '../viewer3d/models'
import { block, circleHole, extrudeUp, extrudeZ, instances, mesh, polyShape, rectHole, rectShape, worldUV } from '../viewer3d/helpers'

// A piece that flies into its final position during its stage
interface Part {
  obj: THREE.Object3D
  final: THREE.Vector3
  offset: THREE.Vector3
  stage: number
  delay: number // 0…0.5 of the stage
}

// Camera stops per stage: target, azimuth°, elevation°, distance
const KEYS: { target: [number, number, number]; az: number; el: number; dist: number }[] = [
  { target: [0, 3, -5], az: 40, el: 26, dist: 40 },
  { target: [0, 3.5, -5], az: 25, el: 28, dist: 38 },
  { target: [0, 4.5, -5], az: 8, el: 40, dist: 38 },
  { target: [-5, 3, -2], az: -28, el: 24, dist: 46 },
  { target: [3, 0.5, 4], az: -32, el: 40, dist: 64 },
  { target: [2.5, 0, 1.5], az: 16, el: 54, dist: 62 },
  { target: [-2, 1.5, 1], az: 34, el: 30, dist: 70 },
]

// Product labels that appear in the scene as each stage completes (desktop only)
export const LABELS: { stage: number; pos: [number, number, number]; text: string; productId?: string }[] = [
  { stage: 1, pos: [3, 3.75, 0.2], text: 'Precast beam', productId: 'precast-beams' },
  { stage: 2, pos: [-3, 7.75, -2.5], text: 'Hollow-core slab', productId: 'precast-slabs' },
  { stage: 3, pos: [-6, 1.4, 0.4], text: 'Wall panel' },
  { stage: 3, pos: [-16, 2.6, 5.5], text: 'Hollow blocks', productId: 'hollow-blocks' },
  { stage: 4, pos: [-14, 0.75, 9.4], text: 'U drain 600 × 600', productId: 'u-drains' },
  { stage: 4, pos: [21.4, 1.7, -2], text: 'Box culvert 1200 × 1200', productId: 'box-culverts' },
  { stage: 4, pos: [9.6, 0.05, 8.3], text: 'Catch basin', productId: 'catch-basins' },
  { stage: 4, pos: [4, 0.06, 13], text: 'Manhole', productId: 'manhole-1200x1200' },
  { stage: 4, pos: [10.4, 0.06, -5.5], text: 'Cable trench', productId: 'cable-trays' },
  { stage: 4, pos: [-3, 0.03, 0.47], text: 'Water channel', productId: 'water-channels' },
  { stage: 5, pos: [-3, 0.32, 10.1], text: 'Kerb stones', productId: 'kerb-stones' },
  { stage: 5, pos: [-4, 0.06, 4.8], text: 'Paving tiles', productId: 'paving-tiles' },
  { stage: 5, pos: [13.5, 0.06, 4], text: 'Pavers', productId: 'pavers' },
  { stage: 5, pos: [17.8, 0.1, -1.8], text: 'Grass pavers', productId: 'grass-pavers' },
  { stage: 5, pos: [-14, 0.05, 6.6], text: 'Chequered tiles', productId: 'chequered-tiles' },
  { stage: 5, pos: [-11.5, 0.05, 7.35], text: 'Saucer drains', productId: 'saucer-drains' },
  { stage: 6, pos: [-15.6, 1.0, -0.45], text: 'Retaining wall', productId: 'retaining-walls' },
  { stage: 6, pos: [2, 1.95, -13.6], text: 'Compound wall', productId: 'compound-wall-panels' },
  { stage: 6, pos: [-22.2, 1.5, -2], text: 'Fencing', productId: 'walls-and-fencing' },
  { stage: 6, pos: [10.8, 6.9, 8.4], text: 'Light pole', productId: 'light-poles' },
  { stage: 6, pos: [-7, 9.1, 17.9], text: 'Electric pole', productId: 'electric-poles' },
  { stage: 6, pos: [6, 0.5, 7.6], text: 'Bench', productId: 'furniture-and-decor' },
  { stage: 6, pos: [-15.6, 0.9, -6.6], text: 'Flagstones', productId: 'flagstones' },
]

// Merge a model's meshes into one mesh per material to cut draw calls; large instanced meshes are kept
function flatten(obj: THREE.Object3D) {
  obj.updateMatrixWorld(true)
  const inverse = obj.matrixWorld.clone().invert()
  const byMaterial = new Map<THREE.Material, THREE.BufferGeometry[]>()
  const keep: THREE.Object3D[] = []
  const push = (source: THREE.BufferGeometry, matrix: THREE.Matrix4, mat: THREE.Material) => {
    const geo = (source.index ? source.toNonIndexed() : source.clone()).applyMatrix4(matrix)
    geo.clearGroups()
    for (const name of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(name)) geo.deleteAttribute(name)
    const list = byMaterial.get(mat) ?? []
    list.push(geo)
    byMaterial.set(mat, list)
  }
  const instanceMatrix = new THREE.Matrix4()
  obj.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const local = new THREE.Matrix4().multiplyMatrices(inverse, child.matrixWorld)
    if (child instanceof THREE.InstancedMesh) {
      if (child.count > 64) return keep.push(child)
      for (let i = 0; i < child.count; i++) {
        child.getMatrixAt(i, instanceMatrix)
        push(child.geometry, local.clone().multiply(instanceMatrix), child.material as THREE.Material)
      }
    } else {
      push(child.geometry, local, child.material as THREE.Material)
    }
  })
  const out = new THREE.Group()
  out.position.copy(obj.position)
  out.quaternion.copy(obj.quaternion)
  byMaterial.forEach((geos, mat) => {
    const merged = new THREE.Mesh(mergeGeometries(geos), mat)
    merged.castShadow = merged.receiveShadow = true
    out.add(merged)
    geos.forEach((g) => g.dispose())
  })
  for (const k of keep) {
    k.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, k.parent!.matrixWorld))
    out.add(k)
  }
  obj.traverse((child) => { if (child instanceof THREE.Mesh && !keep.includes(child)) child.geometry.dispose() })
  return out
}

// At site distance a pixel covers ~4 cm, so hairline joints and tiny details shimmer as the camera moves.
// Pieces in this scene therefore touch edge to edge, and a slight shade per piece shows the pattern instead.
function shade(inst: THREE.InstancedMesh, seed: number, min = 0.88, pick?: (i: number) => number) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const c = new THREE.Color()
  for (let i = 0; i < inst.count; i++) inst.setColorAt(i, c.setScalar(pick ? pick(i) : min + rand() * (1 - min)))
  inst.instanceColor!.needsUpdate = true
  return inst
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1)

// ---------- building ----------
const BAY_X = 6
const BAY_Z = 5
const NX = 3
const NZ = 2
const STOREY = 3.5
const LEVELS = 2
const X0 = -(NX * BAY_X) / 2
const Z0 = -NZ * BAY_Z
const PLINTH = 0.5

function buildScene(m: Materials) {
  const root = new THREE.Group()
  const parts: Part[] = []
  const add = (obj: THREE.Object3D, stage: number, delay: number, offset: [number, number, number]) => {
    root.add(obj)
    parts.push({ obj, final: obj.position.clone(), offset: new THREE.Vector3(...offset), stage, delay: Math.min(delay, 0.5) })
  }
  const concrete = m.concrete()

  // Site base plate and road — always visible; colours follow the theme
  const ground: Record<string, THREE.MeshStandardMaterial> & {
    plate: THREE.MeshStandardMaterial
    road: THREE.MeshStandardMaterial
    marking: THREE.MeshStandardMaterial
    glass: THREE.MeshStandardMaterial
  } = {
    plate: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    road: new THREE.MeshStandardMaterial({ roughness: 0.8 }),
    marking: new THREE.MeshStandardMaterial({ roughness: 0.6 }),
    // Window glass: dark by day, warm interior light at night
    glass: new THREE.MeshStandardMaterial({ color: '#56616b', roughness: 0.15, metalness: 0.4, emissive: '#ffd9a0', emissiveIntensity: 0 }),
  }
  root.add(block(46, 0.12, 34, ground.plate, 0, -0.12, 2))
  root.add(block(46, 0.02, 6, ground.road, 0, 0, 13))
  root.add(instances(new THREE.BoxGeometry(1.6, 0.01, 0.12), ground.marking,
    Array.from({ length: 12 }, (_, i) => ({ x: -20.5 + i * 3.7, y: 0.025, z: 13 }))))

  const colX = Array.from({ length: NX + 1 }, (_, i) => X0 + i * BAY_X)
  const colZ = Array.from({ length: NZ + 1 }, (_, j) => Z0 + j * BAY_Z)

  // Footings — always visible so the site never starts empty
  const footings = new THREE.Group()
  for (const x of colX) for (const z of colZ) footings.add(block(1.4, PLINTH, 1.4, concrete, x, 0, z, 0.02))
  root.add(flatten(footings))

  // Stage 0: columns lowered onto footings
  colX.forEach((x, i) => colZ.forEach((z, j) => {
    add(block(0.4, LEVELS * STOREY + 0.2, 0.4, concrete, x, PLINTH, z, 0.01), 0, (i + j * 0.5) / 5, [0, 12, 0])
  }))

  // Stage 1: beams along x (slab bearing) and z, level by level
  for (let L = 0; L < LEVELS; L++) {
    const top = PLINTH + (L + 1) * STOREY
    colZ.forEach((z) => {
      for (let i = 0; i < NX; i++) add(block(BAY_X - 0.4, 0.5, 0.3, concrete, X0 + (i + 0.5) * BAY_X, top - 0.5, z, 0.01), 1, L * 0.25 + i * 0.07, [0, 7, 0])
    })
    colX.forEach((x, i) => {
      for (let j = 0; j < NZ; j++) add(block(0.3, 0.5, BAY_Z - 0.4, concrete, x, top - 0.5, Z0 + (j + 0.5) * BAY_Z, 0.01), 1, L * 0.25 + 0.1 + i * 0.05, [0, 7, 0])
    })
  }

  // Stage 2: hollow-core slabs spanning between the x-beams
  const slabSection = rectShape(1.2, 0.2, 0, 0.1)
  for (let k = 0; k < 5; k++) slabSection.holes.push(circleHole(0.065, -0.47 + k * 0.235, 0.1))
  const slabGeo = extrudeZ(slabSection, BAY_Z - 0.32)
  for (let L = 0; L < LEVELS; L++) {
    const top = PLINTH + (L + 1) * STOREY
    for (let i = 0; i < NX; i++) {
      for (let j = 0; j < NZ; j++) {
        const bay = shade(instances(slabGeo, concrete, Array.from({ length: 5 }, (_, k) => ({ x: 0.6 + k * 1.2, y: 0, z: 0 }))), 0, 0, (k) => (k % 2 ? 0.94 : 1))
        bay.position.set(X0 + i * BAY_X, top, Z0 + (j + 0.5) * BAY_Z)
        add(bay, 2, L * 0.25 + ((i * NZ + j) / 6) * 0.25, [0, 6, 0])
      }
    }
  }

  // Stage 3: wall panels — glazed windows on the front, solid elsewhere
  const panelH = STOREY - 0.02
  const panel = (w: number, windows: boolean) => {
    const s = rectShape(w, panelH, 0, panelH / 2)
    if (windows) s.holes.push(rectHole(Math.min(2.6, w * 0.45), 1.5, 0, panelH * 0.55))
    return extrudeZ(s, 0.15, 0.006)
  }
  const frontGeo = panel(BAY_X - 0.02, true)
  const backGeo = panel(BAY_X - 0.02, false)
  const sideGeo = panel(BAY_Z + 0.33, false)
  const paneGeo = new THREE.PlaneGeometry(2.6, 1.5)
  for (let L = 0; L < LEVELS; L++) {
    const y = PLINTH + L * STOREY
    for (let i = 0; i < NX; i++) {
      const x = X0 + (i + 0.5) * BAY_X
      const front = mesh(frontGeo, concrete, x, y, 0.275)
      const pane = new THREE.Mesh(paneGeo, ground.glass)
      pane.position.y = panelH * 0.55
      front.add(pane)
      add(front, 3, L * 0.2 + i * 0.05, [0, 0, 8])
      add(mesh(backGeo, concrete, x, y, Z0 - 0.275), 3, L * 0.2 + 0.12 + i * 0.05, [0, 0, -8])
    }
    for (let j = 0; j < NZ; j++) {
      const z = Z0 + (j + 0.5) * BAY_Z + (j === 0 ? -0.165 : 0.165)
      for (const side of [-1, 1]) {
        const p = mesh(sideGeo, concrete, side * (-X0 + 0.275), y, z)
        p.rotation.y = Math.PI / 2
        add(p, 3, L * 0.2 + 0.08 + j * 0.05, [side * 8, 0, 0])
      }
    }
  }

  // Stage 3: guard house laid course by course in 8-inch hollow blocks, with a precast slab roof
  const blockPlan = rectShape(0.4, 0.2)
  for (const sx of [-1, 1]) blockPlan.holes.push(rectHole(0.15, 0.15, sx * 0.095, 0))
  const blockGeo = extrudeUp(blockPlan, 0.2)
  const GH = { x0: -18, x1: -14, z0: 2.5, z1: 5.5, courses: 12 }
  const doorX = [-16.6, -15.4]
  for (let g = 0; g < 4; g++) {
    const items: { x: number; y: number; z: number; ry?: number }[] = []
    for (let c = g * 3; c < g * 3 + 3; c++) {
      const y = c * 0.2
      const shift = c % 2 ? 0.2 : 0 // running bond
      for (let k = 0; k < 10; k++) {
        const x = GH.x0 + 0.2 + k * 0.4 + shift
        if (x > GH.x1 - 0.15) continue
        items.push({ x, y, z: GH.z0 + 0.1 })
        // Course 10 over the door is the precast lintel
        if (c >= 11 || x < doorX[0] - 0.15 || x > doorX[1] + 0.15) items.push({ x, y, z: GH.z1 - 0.1 })
      }
      // Side walls fill exactly between the front and back walls
      const sideStep = (GH.z1 - GH.z0 - 0.4) / 6
      for (let k = 0; k < 6; k++) {
        const z = GH.z0 + 0.2 + sideStep * (k + 0.5)
        for (const x of [GH.x0 + 0.1, GH.x1 - 0.1]) items.push({ x, y, z, ry: Math.PI / 2 })
      }
    }
    add(shade(instances(blockGeo, concrete, items), 11 + g, 0.84), 3, 0.25 + g * 0.06, [0, 3, 0])
  }
  add(block(1.6, 0.2, 0.2, concrete, -16, 2.0, GH.z1 - 0.1, 0.004), 3, 0.43, [0, 3, 0])
  add(block(4.6, 0.15, 3.6, concrete, -16, 2.4, 4, 0.006), 3, 0.48, [0, 5, 0])

  // Stage 4: U drains along both road edges, box culvert line on the east side
  const uDrain = MODELS['u-drains']
  for (const [side, z] of [[0, 9.4], [1, 16.55]] as const) {
    // Laid in pairs of units to keep draw calls down
    for (let k = 0; k < 11; k++) {
      const pair = new THREE.Group()
      for (const n of [0, 1]) {
        const unit = uDrain.build({ size: '600', load: '25T', cover: false }, m)
        unit.position.x = (n - 0.5) * 2.05
        unit.rotation.y = Math.PI / 2
        pair.add(unit)
      }
      const run = flatten(pair)
      run.position.set((k - 5) * 4.1, 0, z)
      add(run, 4, side * 0.08 + (k / 11) * 0.4, [0, 6, 0])
    }
  }
  for (let k = 0; k < 8; k++) {
    const unit = flatten(MODELS['box-culverts'].build({ size: '1200x1200', run: false }, m))
    unit.position.set(21.4, 0, -11 + k * 2.05)
    add(unit, 4, 0.2 + k * 0.04, [0, 7, 0])
  }
  // Chambers and channels are set flush with the ground, as on a real site
  for (const x of [-9.6, 9.6]) {
    const basin = flatten(MODELS['catch-basins'].build({ grating: false, cutaway: false }, m))
    basin.position.set(x, -1.016, 8.3)
    add(basin, 4, 0.3, [0, 5, 0])
    add(block(1.04, 0.025, 1.04, m.dark, x, 0.006, 8.3), 4, 0.3, [0, 5, 0])
  }
  for (const x of [-14, 4]) {
    const hole = flatten(MODELS['manhole-1200x1200'].build({ lid: true, cutaway: false }, m))
    hole.position.set(x, -1.804, 13) // slab top 6 mm above the road surface
    add(hole, 4, 0.34, [0, 5, 0])
  }
  for (let k = 0; k < 6; k++) {
    const channel = flatten(MODELS['water-channels'].build({ grating: false }, m))
    channel.rotation.y = Math.PI / 2
    channel.position.set(-7.5 + k * 3, -0.195, 0.47)
    add(channel, 4, 0.38 + k * 0.02, [0, 3, 0])
  }
  for (const z of [-8.5, -5.5, -2.5]) {
    const trench = flatten(MODELS['cable-trays'].build({ covers: true, cables: true }, m))
    trench.position.set(10.4, -0.425, z)
    add(trench, 4, 0.42, [0, 3, 0])
  }

  // Stage 5: kerbs, forecourt tiles, driveway pavers, grass-paver parking, walkway
  const kerbGeo = extrudeZ(polyShape([[-0.075, 0], [0.075, 0], [0.075, 0.3], [-0.025, 0.3], [-0.075, 0.2]]), 0.6)
  for (const [z, ry] of [[10.1, Math.PI / 2], [15.9, -Math.PI / 2]] as const) {
    const kerbs = 76 // fills the 46 m plate edge to edge
    for (let start = 0; start < kerbs; start += 8) {
      const items = Array.from({ length: Math.min(8, kerbs - start) }, (_, k) => ({ x: -22.5 + (start + k) * 0.6, y: 0.02, z: 0, ry }))
      const run = shade(instances(kerbGeo, concrete, items), start + 1, 0.9)
      run.position.z = z
      add(run, 5, (start / kerbs) * 0.2, [0, 4, 0])
    }
  }
  const tileGeo = new THREE.BoxGeometry(0.4, 0.05, 0.4).translate(0, 0.025, 0)
  for (let r = 0; r < 20; r++) {
    const items = Array.from({ length: 45 }, (_, c) => ({ x: -8.8 + c * 0.4, y: 0, z: 0 }))
    const row = shade(instances(tileGeo, m.concrete(r % 5 === 0 ? '#6f6b66' : '#b5b0a8'), items), 100 + r, 0.9)
    row.position.z = 0.8 + r * 0.4
    add(row, 5, 0.05 + (r / 20) * 0.25, [0, 3, 0])
  }
  // Driveway in stretcher bond, with a dark soldier course along each edge
  const brickGeo = new THREE.BoxGeometry(0.2, 0.06, 0.1).translate(0, 0.03, 0)
  const halfBrickGeo = new THREE.BoxGeometry(0.1, 0.06, 0.1).translate(0, 0.03, 0)
  const DRIVE = { x0: 11.5, z0: -1, rows: 98 }
  for (let chunk = 0; chunk < 7; chunk++) {
    const body: { x: number; y: number; z: number }[] = []
    const edge: { x: number; y: number; z: number }[] = []
    const halves: { x: number; y: number; z: number }[] = []
    for (let r = chunk * 14; r < chunk * 14 + 14; r++) {
      const z = DRIVE.z0 + 0.05 + r * 0.1
      // Straight soldier course on both edges; the bond offset stays inside them so the edge never zigzags
      edge.push({ x: DRIVE.x0 + 0.1, y: 0, z }, { x: DRIVE.x0 + 3.9, y: 0, z })
      // Offset rows start and end with half bricks, as on a real driveway
      if (r % 2) halves.push({ x: DRIVE.x0 + 0.25, y: 0, z }, { x: DRIVE.x0 + 3.75, y: 0, z })
      for (let k = 1; k < 19; k++) {
        const x = DRIVE.x0 + 0.1 + k * 0.2 + (r % 2 ? 0.1 : 0)
        if (x > DRIVE.x0 + 3.75) continue
        body.push({ x, y: 0, z })
      }
    }
    add(shade(instances(brickGeo, m.concrete('#a29d95'), body), 200 + chunk, 0.84), 5, 0.12 + chunk * 0.03, [0, 3, 0])
    add(instances(brickGeo, m.concrete('#6f6b66'), edge), 5, 0.12 + chunk * 0.03, [0, 3, 0])
    add(shade(instances(halfBrickGeo, m.concrete('#a29d95'), halves), 300 + chunk, 0.84), 5, 0.12 + chunk * 0.03, [0, 3, 0])
  }
  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 4; r++) {
      const patch = flatten(MODELS['grass-pavers'].build({ grass: false }, m))
      patch.position.set(16.4 + c * 1.212, 0, -4 + r * 1.212)
      add(patch, 5, 0.25 + (c * 4 + r) * 0.012, [0, 3, 0])
    }
  }
  ;(ground.cells = new THREE.MeshStandardMaterial({ color: '#7f9468', roughness: 1 }))
  add(block(3.83, 0.055, 4.84, ground.cells, 17.7, 0, -2.18), 5, 0.25, [0, 3, 0])
  // Chequered walkway: alternating tile shades carry the pattern (the raised studs are too small to see here)
  const chequer: { x: number; y: number; z: number }[] = []
  for (let c = 0; c < 27; c++) for (let r = 0; r < 3; r++) chequer.push({ x: -17.8 + c * 0.3, y: 0, z: 6.3 + r * 0.3 })
  const walkTile = new THREE.BoxGeometry(0.3, 0.035, 0.3).translate(0, 0.0175, 0)
  add(shade(instances(walkTile, m.concrete('#a8a39b'), chequer), 0, 0, (i) => ((Math.floor(i / 3) + (i % 3)) % 2 ? 0.82 : 1)), 5, 0.3, [0, 3, 0])
  for (let k = 0; k < 7; k++) {
    const run = flatten(MODELS['saucer-drains'].build({ run: true }, m))
    run.rotation.y = Math.PI / 2
    run.position.set(-17.4 + k * 1.216, -0.08, 7.35)
    add(run, 5, 0.36 + k * 0.015, [0, 3, 0])
  }

  // Stage 6: raised garden terrace held by L-shaped retaining walls
  for (let k = 0; k < 4; k++) {
    const wallUnit = flatten(MODELS['retaining-walls'].build({ type: 'L', height: '1', backfill: false }, m))
    wallUnit.rotation.y = -Math.PI / 2
    wallUnit.position.set(-19.2 + k * 2.4, 0, -0.8)
    add(wallUnit, 6, k * 0.03, [0, 5, 0])
  }
  const lawn = (ground.lawn = new THREE.MeshStandardMaterial({ color: '#8b9a78', roughness: 1 }))
  const soilSides = m.soil
  const terrace = new THREE.Mesh(worldUV(new THREE.BoxGeometry(9.6, 0.85, 11.8).translate(0, 0.425, 0)), [soilSides, soilSides, lawn, soilSides, soilSides, soilSides])
  terrace.position.set(-15.6, 0, -6.5)
  terrace.receiveShadow = true
  add(terrace, 6, 0.1, [0, -0.9, 0])
  for (const z of [-3.2, -6.6, -10]) {
    const path = flatten(MODELS['flagstones'].build({ layout: 'path', color: 'grey' }, m))
    path.position.set(-15.6, 0.85, z)
    add(path, 6, 0.2, [0, 2, 0])
  }
  // A few trees for life; not products, so kept simple and muted
  const leaf = (ground.leaf = new THREE.MeshStandardMaterial({ color: '#76896a', roughness: 0.95, flatShading: true }))
  const leafDark = (ground.leafDark = new THREE.MeshStandardMaterial({ color: '#66795b', roughness: 0.95, flatShading: true }))
  const tree = (x: number, y: number, z: number, size: number) => {
    const t = new THREE.Group()
    t.add(mesh(new THREE.CylinderGeometry(0.08 * size, 0.11 * size, 1.6 * size, 8).translate(0, 0.8 * size, 0), m.timber))
    t.add(mesh(new THREE.IcosahedronGeometry(0.9 * size, 0), leaf, 0, 2.1 * size, 0))
    t.add(mesh(new THREE.IcosahedronGeometry(0.65 * size, 0), leafDark, 0.45 * size, 1.75 * size, 0.3 * size))
    const merged = flatten(t)
    merged.position.set(x, y, z)
    return merged
  }
  ;[[-19, 0.85, -3, 1.1], [-12.4, 0.85, -4.5, 0.9], [-18.6, 0.85, -10.5, 1.2], [-12.8, 0.85, -11.2, 1], [-21, 0, 1.5, 1], [-11.6, 0, 3.4, 0.85]]
    .forEach(([x, y, z, sz], i) => add(tree(x, y, z, sz), 6, 0.22 + i * 0.03, [0, -3, 0]))
  const furniture = MODELS['furniture-and-decor']
  const place = (item: string, x: number, y: number, z: number, ry: number, delay: number) => {
    const f = flatten(furniture.build({ item }, m))
    f.rotation.y = ry
    f.position.set(x, y, z)
    add(f, 6, delay, [0, 2, 0])
  }
  place('bench', -6, 0.05, 7.6, 0, 0.3)
  place('bench', 6, 0.05, 7.6, 0, 0.32)
  place('planter', -1.6, 0.05, 1.5, 0, 0.34)
  place('planter', 1.6, 0.05, 1.5, 0, 0.35)
  place('table', -17.4, 0.85, -6.4, 0, 0.36)
  place('bench', -13, 0.85, -8.6, Math.PI / 2, 0.37)

  // Boundaries: compound wall at the back, panel fence on the west edge
  const wall = MODELS['compound-wall-panels']
  for (let k = 0; k < 10; k++) {
    const section = flatten(wall.build({ courses: '6', finish: 'plain' }, m))
    section.position.set(-18 + k * 4, 0, -13.6)
    add(section, 6, 0.12 + k * 0.025, [0, 8, 0])
  }
  for (const z of [-10.3, -4.9, 0.5, 5.9]) {
    const fence = flatten(MODELS['walls-and-fencing'].build({ style: 'panel' }, m))
    fence.rotation.y = Math.PI / 2
    fence.position.set(-22.2, 0, z)
    add(fence, 6, 0.16, [0, 6, 0])
  }

  // Lighting: street lights along the forecourt, distribution poles with overhead lines across the road
  const pools: THREE.PointLight[] = []
  ;[-20, -10.6, 10.8, 20.2].forEach((x, i) => {
    const pole = flatten(MODELS['light-poles'].build({ style: 'single', lit: true }, m))
    pole.position.set(x, 0, 8.4)
    pole.rotation.y = -Math.PI / 2 // arm reaches over the road
    // Warm pool of light under the lamp head; only lit at night, and only once the pole is placed
    const pool = new THREE.PointLight('#ffd49a', 0, 22, 2)
    pool.position.set(1.25, 6.4, 0)
    pole.add(pool)
    pools.push(pool)
    add(pole, 6, 0.3 + i * 0.04, [0, 10, 0])
  })
  const POLE_X = [-20, -7, 6, 19]
  const POLE_Z = 17.9
  POLE_X.forEach((x, i) => {
    const pole = flatten(MODELS['electric-poles'].build({ height: '9', fittings: true }, m))
    pole.rotation.y = Math.PI / 2 // cross-arm across the line
    pole.position.set(x, 0, POLE_Z)
    add(pole, 6, 0.32 + i * 0.04, [0, 10, 0])
  })
  // Conductors sag between insulator tops (cross-arm insulators sit at local x = -0.55, 0, 0.55)
  const lines = new THREE.Group()
  const wireMat = m.dark
  for (let i = 0; i < POLE_X.length - 1; i++) {
    for (const lx of [-0.55, 0, 0.55]) {
      const a = new THREE.Vector3(POLE_X[i] + 0.09, 8.86, POLE_Z - lx)
      const b = new THREE.Vector3(POLE_X[i + 1] + 0.09, 8.86, POLE_Z - lx)
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -0.45, 0))
      const curve = new THREE.QuadraticBezierCurve3(a, mid.clone().add(new THREE.Vector3(0, -0.45, 0)), b)
      lines.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.03, 6, false), wireMat))
    }
  }
  add(flatten(lines), 6, 0.48, [0, 2, 0])

  return { root, parts, ground, pools }
}

export default function AssemblyScene({ progressRef, theme, onSelect }: {
  progressRef: RefObject<number>
  theme: Theme
  onSelect?: (productId: string) => void
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([])
  const themeRef = useRef(theme)
  const setThemeRef = useRef<(t: Theme) => void>(() => {})

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    // Lighter settings on small screens, where this sits in a half-height panel
    const small = window.innerWidth < 768
    // Standard-density desktop screens render at 1.5x, which smooths shimmer on thin edges
    renderer.setPixelRatio(small ? Math.min(window.devicePixelRatio, 1.5) : Math.min(Math.max(window.devicePixelRatio, 1.5), 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const hemi = new THREE.HemisphereLight('#ffffff', '#5f5a54', 0.4)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#ffffff', 2.4)
    sun.position.set(22, 40, 18)
    sun.castShadow = true
    sun.shadow.mapSize.setScalar(small ? 1024 : 2048)
    Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 1, far: 120 })
    sun.shadow.camera.updateProjectionMatrix()
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.03
    scene.add(sun)

    const materials = new Materials()
    const { root, parts, ground, pools } = buildScene(materials)
    scene.add(root)
    const lamp = materials.lamp(true)

    // Day and night: theme switches blend the look, so the sun sets and the lamps come on
    const lookTransition = new LookTransition(themeRef.current)
    const applyLook = () => {
      const l = lookTransition.look
      renderer.toneMappingExposure = l.exposure
      hemi.intensity = l.hemi
      sun.intensity = l.sun
      sun.color.copy(l.sunColor)
      sun.position.copy(l.sunDir).multiplyScalar(55)
      ground.plate.color.copy(l.plate)
      ground.road.color.copy(l.road)
      ground.marking.color.copy(l.marking)
      lamp.emissiveIntensity = l.lamp
      ground.glass.emissiveIntensity = l.lamp * 0.45 // windows glow at night
      pools.forEach((p) => (p.intensity = l.pool))
    }
    applyLook()
    setThemeRef.current = (t: Theme) => lookTransition.go(t, reduced)

    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.5, 400)
    const labelPos = LABELS.map((l) => new THREE.Vector3(...l.pos))
    const pointer = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    mount.addEventListener('pointermove', onPointer)

    let visible = true
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(mount)

    let current = progressRef.current ?? 0
    let parallaxX = 0
    let parallaxY = 0
    const target = new THREE.Vector3()
    const ta = new THREE.Vector3()
    const tb = new THREE.Vector3()
    let frame = 0
    const clock = new THREE.Clock()

    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (!visible) return
      const goal = progressRef.current ?? 0
      current = reduced ? goal : current + (goal - current) * 0.1

      // Parts: each flies in over the first part of its stage
      for (const part of parts) {
        const raw = clamp01((current - part.stage - part.delay) / 0.45)
        const u = reduced ? (raw > 0 ? 1 : 0) : easeOut(raw)
        part.obj.visible = raw > 0
        part.obj.position.copy(part.final).addScaledVector(part.offset, 1 - u)
      }

      // Camera eases between stage stops, resting mid-stage
      const c = Math.min(Math.max(current - 0.5, 0), KEYS.length - 1)
      const a = Math.min(Math.floor(c), KEYS.length - 2)
      const t = smooth(c - a)
      const A = KEYS[a]
      const B = KEYS[a + 1]
      target.lerpVectors(ta.set(...A.target), tb.set(...B.target), t)
      parallaxX += (pointer.x - parallaxX) * 0.05
      parallaxY += (pointer.y - parallaxY) * 0.05
      const drift = reduced ? 0 : Math.sin(clock.getElapsedTime() * 0.15) * 2
      const az = THREE.MathUtils.degToRad(A.az + (B.az - A.az) * t + parallaxX * 6 + drift)
      const el = THREE.MathUtils.degToRad(A.el + (B.el - A.el) * t - parallaxY * 3)
      const dist = (A.dist + (B.dist - A.dist) * t) * Math.max(1, 1.25 / camera.aspect)
      camera.position.set(
        target.x + dist * Math.cos(el) * Math.sin(az),
        target.y + dist * Math.sin(el),
        target.z + dist * Math.cos(el) * Math.cos(az),
      )
      camera.lookAt(target)
      // Labels for the current stage appear once its parts have landed
      const stageNow = Math.floor(current)
      const into = current - stageNow
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.updateMatrixWorld()
      LABELS.forEach((l, i) => {
        const el = labelRefs.current[i]
        if (!el) return
        const p = labelPos[i].clone().project(camera)
        const show = l.stage === stageNow && into > 0.55 && p.z < 1 && Math.abs(p.x) < 0.95 && Math.abs(p.y) < 0.95
        const x = ((p.x + 1) / 2) * w
        const y = ((1 - p.y) / 2) * h - 12
        // Near the right edge (and the stage buttons) the label sits to the left of its dot
        const flip = x > w - el.offsetWidth - 80
        el.style.flexDirection = flip ? 'row-reverse' : 'row'
        el.style.transform = `translate(${flip ? x - el.offsetWidth + 6 : x - 6}px, ${y}px)`
        el.style.opacity = show ? '1' : '0'
        el.style.pointerEvents = show && l.productId ? 'auto' : 'none'
      })
      lookTransition.step()
      applyLook()
      renderer.render(scene, camera)
      // Fade the canvas in on its first frame instead of popping in
      if (renderer.domElement.style.opacity !== '1') renderer.domElement.style.opacity = '1'
    }
    renderer.domElement.style.opacity = '0'
    renderer.domElement.style.transition = 'opacity 0.8s ease'
    animate()

    const resize = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    })
    resize.observe(mount)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      io.disconnect()
      mount.removeEventListener('pointermove', onPointer)
      const geometries = new Set<THREE.BufferGeometry>()
      root.traverse((o) => { if (o instanceof THREE.Mesh) geometries.add(o.geometry) })
      geometries.forEach((g) => g.dispose())
      materials.dispose()
      Object.values(ground).forEach((mat) => mat.dispose())
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [progressRef])

  useEffect(() => {
    themeRef.current = theme
    setThemeRef.current(theme)
  }, [theme])

  return (
    <>
      <div
        ref={mountRef}
        className="absolute inset-0"
        role="img"
        aria-label="3D model of a precast site assembling as you scroll: frame, beams, slabs, walls, drainage, paving and site works"
      />
      {/* Product labels, positioned every frame from their 3D anchors. Desktop only; the stage copy carries the same links. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" aria-hidden="true">
        {LABELS.map((l, i) => (
          <button
            key={l.text + i}
            ref={(el) => { labelRefs.current[i] = el }}
            tabIndex={-1}
            onClick={() => l.productId && onSelect?.(l.productId)}
            className={`absolute left-0 top-0 flex items-center gap-2 opacity-0 transition-opacity duration-500 will-change-transform ${l.productId ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <span className="w-3 h-3 rounded-full bg-marking ring-[3px] ring-concrete/80 shadow-[0_1px_4px_rgba(0,0,0,0.3)]" />
            <span className="px-2 py-1 rounded-[3px] bg-concrete/90 backdrop-blur-sm border border-formline text-xs font-semibold whitespace-nowrap hover:border-graphite transition-colors">
              {l.text}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
