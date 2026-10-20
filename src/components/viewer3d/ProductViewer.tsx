import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Materials } from './materials'
import { MODELS } from './models'
import type { ModelId } from './modelIds'
import type { Params } from './types'

function disposeObject(obj: THREE.Object3D) {
  // Materials are shared via the Materials cache, so only geometries are freed here
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) child.geometry.dispose()
  })
}

function defaultParams(id: ModelId): Params {
  const def = MODELS[id]
  const params: Params = {}
  def.options?.forEach((o) => (params[o.key] = o.default))
  def.toggles?.forEach((t) => (params[t.key] = t.default))
  return params
}

// Camera distance that keeps every corner of `box` in view from any angle around the vertical axis
function fitDistance(box: THREE.Box3, center: THREE.Vector3, camera: THREE.PerspectiveCamera) {
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const tanH = tanV * camera.aspect
  const dir = camera.position.clone().sub(center).normalize()
  const elevation = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1))
  const corners = [0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
    new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).sub(center),
  )
  const up = new THREE.Vector3(0, 1, 0)
  let best = 0
  for (let k = 0; k < 16; k++) {
    const az = (k / 16) * Math.PI * 2
    const back = new THREE.Vector3(Math.cos(elevation) * Math.cos(az), Math.sin(elevation), Math.cos(elevation) * Math.sin(az))
    const right = new THREE.Vector3().crossVectors(up, back).normalize()
    const camUp = new THREE.Vector3().crossVectors(back, right)
    for (const c of corners) {
      const z = c.dot(back)
      best = Math.max(best, z + Math.abs(c.dot(camUp)) / tanV, z + Math.abs(c.dot(right)) / tanH)
    }
  }
  return best * 1.12
}

interface SceneContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  sun: THREE.DirectionalLight
  materials: Materials
  model?: THREE.Object3D
  // Pending camera move to frame the current model; cleared once reached or when the user takes over
  fit?: { target: THREE.Vector3; distance: number } | null
}

export default function ProductViewer({ productId }: { productId: ModelId }) {
  const def = MODELS[productId]
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SceneContext | null>(null)

  const [params, setParams] = useState<Params>(() => defaultParams(productId))
  const [autoRotate, setAutoRotate] = useState(true)
  const readout = useMemo(() => def.readout(params), [def, params])

  // One-time scene setup
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.01, 200)
    camera.position.set(3.2, 2.2, 3.6)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.maxPolarAngle = Math.PI * 0.49
    controls.autoRotateSpeed = 1.2

    scene.add(new THREE.HemisphereLight('#ffffff', '#5f5a54', 0.35))
    const sun = new THREE.DirectionalLight('#ffffff', 2.6)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    scene.add(sun, sun.target)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.18 }))
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const ctx: SceneContext = { scene, camera, controls, sun, materials: new Materials() }
    sceneRef.current = ctx
    controls.addEventListener('start', () => { ctx.fit = null })

    let frame = 0
    const offset = new THREE.Vector3()
    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (ctx.fit) {
        // Ease the camera toward the framing distance, keeping the current viewing angle
        controls.target.lerp(ctx.fit.target, 0.12)
        offset.copy(camera.position).sub(controls.target)
        const dist = offset.length()
        const next = dist + (ctx.fit.distance - dist) * 0.12
        camera.position.copy(controls.target).add(offset.setLength(next))
        if (Math.abs(next - ctx.fit.distance) < 0.001 * ctx.fit.distance && controls.target.distanceTo(ctx.fit.target) < 0.001) ctx.fit = null
      }
      controls.update()
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
      controls.dispose()
      if (ctx.model) disposeObject(ctx.model)
      ctx.materials.dispose()
      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      sceneRef.current = null
    }
  }, [])

  // Rebuild the model whenever the configuration changes
  useEffect(() => {
    const ctx = sceneRef.current
    if (!ctx) return
    if (ctx.model) {
      ctx.scene.remove(ctx.model)
      disposeObject(ctx.model)
    }
    const model = def.build(params, ctx.materials)
    ctx.scene.add(model)
    ctx.model = model

    // Frame the whole model and scale lighting/shadows to its size
    const box = new THREE.Box3().setFromObject(model)
    const sphere = box.getBoundingSphere(new THREE.Sphere())
    const r = Math.max(sphere.radius, 0.02)
    const { camera, controls, sun } = ctx
    camera.near = r * 0.02
    camera.far = r * 60
    camera.updateProjectionMatrix()
    controls.minDistance = r * 0.5
    controls.maxDistance = r * 8

    sun.position.copy(sphere.center).add(new THREE.Vector3(4, 6, 3).normalize().multiplyScalar(r * 4))
    sun.target.position.copy(sphere.center)
    const cam = sun.shadow.camera
    cam.left = cam.bottom = -r * 1.6
    cam.right = cam.top = r * 1.6
    cam.near = r * 0.5
    cam.far = r * 8
    cam.updateProjectionMatrix()
    sun.shadow.bias = -0.0005
    sun.shadow.normalBias = r * 0.004

    ctx.fit = { target: sphere.center, distance: fitDistance(box, sphere.center, camera) }
  }, [def, params])

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.controls.autoRotate = autoRotate
  }, [autoRotate])

  const set = (key: string, value: string | boolean) => setParams((p) => ({ ...p, [key]: value }))

  const pill = (active: boolean) =>
    `px-4 py-2 rounded-lg font-technical text-sm border transition-all ${
      active ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
    }`

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="relative h-105 sm:h-130 bg-linear-to-b from-gray-50 to-white">
        <div
          ref={mountRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onPointerDown={() => setAutoRotate(false)}
        />
        <div className="absolute inset-0 blueprint-line opacity-10 pointer-events-none" />

        {/* Current configuration readout */}
        <div className="absolute top-4 left-4 bg-white/90 border border-neutral-200 rounded-lg px-4 py-3 pointer-events-none max-w-[70%]">
          <p className="text-xl font-display font-bold text-neutral-900">{readout.title}</p>
          {readout.subtitle && <p className="text-xs font-technical text-neutral-500 mt-1">{readout.subtitle}</p>}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-technical text-neutral-500 bg-white/80 px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
          Drag to rotate · Scroll / pinch to zoom
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-t border-neutral-200 flex flex-wrap items-start gap-6">
        {def.options?.map((option) => (
          <div key={option.key}>
            <p className="text-xs font-technical font-semibold text-neutral-500 uppercase tracking-wider mb-2">{option.label}</p>
            <div className="flex flex-wrap gap-2">
              {option.choices.map((c) => (
                <button key={c.value} onClick={() => set(option.key, c.value)} className={pill(params[option.key] === c.value)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <p className="text-xs font-technical font-semibold text-neutral-500 uppercase tracking-wider mb-2">View</p>
          <div className="flex flex-wrap gap-2">
            {def.toggles?.map((t) => (
              <button key={t.key} onClick={() => set(t.key, !params[t.key])} className={pill(params[t.key] === true)}>
                {t.label}
              </button>
            ))}
            <button onClick={() => setAutoRotate((v) => !v)} className={pill(autoRotate)}>
              Auto-rotate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
