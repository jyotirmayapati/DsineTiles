import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Materials } from '../viewer3d/materials'
import { MODELS } from '../viewer3d/models'
import { block, circleHole, extrudeZ, instances, mesh, polyShape, rectHole, rectShape } from '../viewer3d/helpers'

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
  { target: [0, 2.5, -5], az: 40, el: 24, dist: 30 },
  { target: [0, 3.5, -5], az: 25, el: 28, dist: 29 },
  { target: [0, 4.5, -5], az: 8, el: 42, dist: 30 },
  { target: [0, 4, -4], az: -20, el: 22, dist: 30 },
  { target: [3, 0.5, 3], az: -32, el: 38, dist: 62 },
  { target: [0, 1, 1], az: 30, el: 36, dist: 68 },
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

  // Site base plate and road — always visible
  root.add(block(46, 0.4, 32, m.plastic('#e7e4de'), 0, -0.4, 1))
  root.add(block(46, 0.02, 6, m.plastic('#55575a'), 0, 0, 13))
  root.add(instances(new THREE.BoxGeometry(1.6, 0.01, 0.12), m.plastic('#f2f0ea'),
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
  const slabSection = rectShape(1.18, 0.2, 0, 0.1)
  for (let k = 0; k < 5; k++) slabSection.holes.push(circleHole(0.065, -0.47 + k * 0.235, 0.1))
  const slabGeo = extrudeZ(slabSection, BAY_Z - 0.32, 0.004)
  for (let L = 0; L < LEVELS; L++) {
    const top = PLINTH + (L + 1) * STOREY
    for (let i = 0; i < NX; i++) {
      for (let j = 0; j < NZ; j++) {
        const bay = instances(slabGeo, concrete, Array.from({ length: 5 }, (_, k) => ({ x: 0.6 + k * 1.2, y: 0, z: 0 })))
        bay.position.set(X0 + i * BAY_X, top, Z0 + (j + 0.5) * BAY_Z)
        add(bay, 2, L * 0.25 + ((i * NZ + j) / 6) * 0.25, [0, 6, 0])
      }
    }
  }

  // Stage 3: wall panels — windows on the front, solid elsewhere
  const panelH = STOREY - 0.02
  const panel = (w: number, windows: boolean) => {
    const s = rectShape(w, panelH, 0, panelH / 2)
    if (windows) s.holes.push(rectHole(Math.min(2.6, w * 0.45), 1.5, 0, panelH * 0.55))
    return extrudeZ(s, 0.15, 0.006)
  }
  const frontGeo = panel(BAY_X - 0.02, true)
  const backGeo = panel(BAY_X - 0.02, false)
  const sideGeo = panel(BAY_Z + 0.33, false)
  for (let L = 0; L < LEVELS; L++) {
    const y = PLINTH + L * STOREY
    for (let i = 0; i < NX; i++) {
      const x = X0 + (i + 0.5) * BAY_X
      add(mesh(frontGeo, concrete, x, y, 0.275), 3, L * 0.22 + i * 0.06, [0, 0, 8])
      add(mesh(backGeo, concrete, x, y, Z0 - 0.275), 3, L * 0.22 + 0.15 + i * 0.05, [0, 0, -8])
    }
    for (let j = 0; j < NZ; j++) {
      const z = Z0 + (j + 0.5) * BAY_Z + (j === 0 ? -0.165 : 0.165)
      for (const side of [-1, 1]) {
        const p = mesh(sideGeo, concrete, side * (-X0 + 0.275), y, z)
        p.rotation.y = Math.PI / 2
        add(p, 3, L * 0.22 + 0.1 + j * 0.06, [side * 8, 0, 0])
      }
    }
  }

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

  // Stage 5: kerbs, forecourt paving, compound wall, light poles
  const kerbGeo = extrudeZ(polyShape([[-0.075, 0], [0.075, 0], [0.075, 0.3], [-0.025, 0.3], [-0.075, 0.2]]), 0.6, 0.004)
  for (const [z, ry] of [[10.1, Math.PI / 2], [15.9, -Math.PI / 2]] as const) {
    const kerbs = 76 // fills the 46 m plate edge to edge
    for (let start = 0; start < kerbs; start += 8) {
      const items = Array.from({ length: Math.min(8, kerbs - start) }, (_, k) => ({ x: -22.7 + (start + k) * 0.605, y: 0.02, z: 0, ry }))
      const run = instances(kerbGeo, concrete, items)
      run.position.z = z
      add(run, 5, (start / kerbs) * 0.25, [0, 4, 0])
    }
  }
  const tileGeo = new THREE.BoxGeometry(0.396, 0.05, 0.396).translate(0, 0.025, 0)
  for (let r = 0; r < 20; r++) {
    const items = Array.from({ length: 45 }, (_, c) => ({ x: -8.8 + c * 0.4, y: 0, z: 0 }))
    const row = instances(tileGeo, m.concrete(r % 5 === 0 ? '#6f6b66' : '#b5b0a8'), items)
    row.position.z = 0.8 + r * 0.4
    add(row, 5, 0.05 + (r / 20) * 0.3, [0, 3, 0])
  }
  const wall = MODELS['compound-wall-panels']
  for (let k = 0; k < 10; k++) {
    const section = flatten(wall.build({ courses: '6', finish: 'plain' }, m))
    section.position.set(-18 + k * 4, 0, -13.6)
    add(section, 5, 0.15 + k * 0.03, [0, 8, 0])
  }
  ;[-18, -12, 12, 18].forEach((x, i) => {
    const pole = flatten(MODELS['light-poles'].build({ style: 'single', lit: true }, m))
    pole.position.set(x, 0, 8.4)
    pole.rotation.y = -Math.PI / 2 // arm reaches over the road
    add(pole, 5, 0.3 + i * 0.05, [0, 10, 0])
  })

  return { root, parts }
}

export default function AssemblyScene({ progressRef }: { progressRef: RefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    // Lighter settings on small screens, where this sits in a half-height panel
    const small = window.innerWidth < 768
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2))
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

    scene.add(new THREE.HemisphereLight('#ffffff', '#5f5a54', 0.4))
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
    const { root, parts } = buildScene(materials)
    scene.add(root)

    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.5, 400)
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
      renderer.render(scene, camera)
    }
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
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [progressRef])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      role="img"
      aria-label="3D model of a precast site assembling as you scroll: frame, beams, slabs, wall panels, drainage and site works"
    />
  )
}
