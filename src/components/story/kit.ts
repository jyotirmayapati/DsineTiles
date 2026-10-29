import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Materials } from '../viewer3d/materials'
import type { SceneLook } from '../viewer3d/sceneTheme'

// Shared toolkit for scroll-built scenes (home site, railway station)

// A piece that flies into its final position during its stage
export interface Part {
  obj: THREE.Object3D
  final: THREE.Vector3
  offset: THREE.Vector3
  stage: number
  delay: number // 0…0.5 of the stage
  duration: number // share of a stage it takes to land
  // Custom landing, used instead of the default fly-in (e.g. instances laid one at a time)
  animate?: (progress: number, reduced: boolean) => void
}

// Camera stop per stage: target, azimuth°, elevation°, distance
export interface CameraKey {
  target: [number, number, number]
  az: number
  el: number
  dist: number
}

// Product label shown in the scene once its stage has landed (desktop only)
export interface StoryLabel {
  stage: number
  pos: [number, number, number]
  text: string
  productId?: string
  pick?: string // element the label opens, on pages that handle picks
}

// What a story's build function returns
export interface StoryWorld {
  root: THREE.Group
  parts: Part[]
  // Day/night: colour themed materials and lights from the current look
  applyLook: (look: SceneLook) => void
  // Optional custom motion driven by progress (e.g. the arriving train)
  update?: (progress: number) => void
  // Optional weather: rain 0…1 (eased by the scene), seconds since last frame, and the current look
  weather?: (rain: number, dt: number, look: SceneLook) => void
  // Frees materials the world created itself (geometries are freed by the renderer)
  dispose: () => void
}

export interface StoryDef {
  keys: CameraKey[]
  labels: StoryLabel[]
  shadowExtent: number // half-size of the area that receives sun shadows
  ariaLabel: string
  build: (m: Materials) => StoryWorld
}

export const smooth = (t: number) => t * t * (3 - 2 * t)
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1)

// Objects tagged with userData.pick can be hovered and clicked in the scene; pickLabel names them
export function tagPick<T extends THREE.Object3D>(obj: T, id: string, label: string) {
  obj.userData.pick = id
  obj.userData.pickLabel = label
  return obj
}

// Collects parts as they are added to the root
export function createParts(root: THREE.Group) {
  const parts: Part[] = []
  const add = (obj: THREE.Object3D, stage: number, delay: number, offset: [number, number, number], duration = 0.45) => {
    root.add(obj)
    parts.push({ obj, final: obj.position.clone(), offset: new THREE.Vector3(...offset), stage, delay: Math.min(delay, 0.5), duration })
  }
  // Instances land one at a time instead of all together: instance i starts at
  // delay + spread × order[i] (order 0…1, default along x) and takes `duration` to land
  const addEach = (
    inst: THREE.InstancedMesh,
    stage: number,
    delay: number,
    spread: number,
    offset: [number, number, number],
    duration = 0.08,
    order?: number[],
  ) => {
    root.add(inst)
    const finals = Array.from({ length: inst.count }, (_, i) => inst.getMatrixAt(i, new THREE.Matrix4()))
    if (!order) {
      const xs = finals.map((m) => m.elements[12])
      const min = Math.min(...xs)
      const range = Math.max(...xs) - min || 1
      order = xs.map((x) => (x - min) / range)
    }
    const starts = order.map((o) => stage + delay + spread * o)
    const lift = new THREE.Vector3(...offset)
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0)
    const m = new THREE.Matrix4()
    // Bounds from the landed layout: hidden instances would otherwise shrink them (and break picking)
    inst.computeBoundingSphere()
    inst.computeBoundingBox()
    inst.frustumCulled = false
    const first = Math.min(...starts)
    const done = Math.max(...starts) + duration
    let state = '' // 'before' or 'after' once settled there, so idle frames skip the work
    const animate = (progress: number, reduced: boolean) => {
      const now = progress <= first ? 'before' : progress >= done ? 'after' : ''
      if (now && now === state) return
      state = now
      let any = false
      for (let i = 0; i < inst.count; i++) {
        const raw = clamp01((progress - starts[i]) / duration)
        if (raw <= 0) {
          inst.setMatrixAt(i, hidden)
          continue
        }
        any = true
        const u = reduced ? 1 : easeOut(raw)
        m.copy(finals[i])
        m.elements[12] += lift.x * (1 - u)
        m.elements[13] += lift.y * (1 - u)
        m.elements[14] += lift.z * (1 - u)
        inst.setMatrixAt(i, m)
      }
      inst.visible = any
      inst.instanceMatrix.needsUpdate = true
    }
    parts.push({ obj: inst, final: inst.position.clone(), offset: lift, stage, delay, duration, animate })
  }
  return { parts, add, addEach }
}

// Merge a model's meshes into one mesh per material to cut draw calls; large instanced meshes are kept
export function flatten(obj: THREE.Object3D) {
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

// At scene distance a pixel covers several centimetres, so hairline joints and tiny details shimmer as the
// camera moves. Pieces therefore touch edge to edge, and a slight shade per piece shows the pattern instead.
export function shade(inst: THREE.InstancedMesh, seed: number, min = 0.88, pick?: (i: number) => number) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const c = new THREE.Color()
  for (let i = 0; i < inst.count; i++) inst.setColorAt(i, c.setScalar(pick ? pick(i) : min + rand() * (1 - min)))
  inst.instanceColor!.needsUpdate = true
  return inst
}

// Materials owned by a world (not the shared Materials cache), freed together
export function ownedMaterials() {
  const list: THREE.Material[] = []
  const own = <T extends THREE.Material>(mat: T) => (list.push(mat), mat)
  return { own, dispose: () => list.forEach((mat) => mat.dispose()) }
}

export type { Materials }
