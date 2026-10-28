import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Materials } from './materials'
import { VIEWER_MODELS } from './models'
import type { ViewerModelId } from './modelIds'
import type { Params } from './types'
import { LookTransition } from './sceneTheme'
import { useTheme } from '../../theme'
import DrawingSheet from './DrawingSheet'

function disposeObject(obj: THREE.Object3D) {
  // Materials are shared via the Materials cache, so only geometries are freed here
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) child.geometry.dispose()
  })
}

function defaultParams(id: ViewerModelId): Params {
  const def = VIEWER_MODELS[id]
  const params: Params = {}
  def.options?.forEach((o) => (params[o.key] = o.default))
  def.toggles?.forEach((t) => (params[t.key] = t.default))
  return params
}

// Camera distance that keeps every corner of `box` in view from any angle around the vertical axis
export function fitDistance(box: THREE.Box3, center: THREE.Vector3, camera: THREE.PerspectiveCamera) {
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
  hemi: THREE.HemisphereLight
  renderer: THREE.WebGLRenderer
  materials: Materials
  look: LookTransition
  model?: THREE.Object3D
  // Pending camera move to frame the current model; cleared once reached or when the user takes over
  fit?: { target: THREE.Vector3; distance: number } | null
}

interface ViewerProps {
  productId: ViewerModelId
  // Starting configuration, over the model's defaults
  initial?: Params
  // Shorter canvas and tighter controls, for side panels
  compact?: boolean
}

export default function ProductViewer({ productId, initial, compact = false }: ViewerProps) {
  const def = VIEWER_MODELS[productId]
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SceneContext | null>(null)

  const [params, setParams] = useState<Params>(() => ({ ...defaultParams(productId), ...initial }))
  const [autoRotate, setAutoRotate] = useState(true)
  const [mode, setMode] = useState<'model' | 'drawing'>('model')
  const { theme } = useTheme()
  const themeRef = useRef(theme)
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

    const hemi = new THREE.HemisphereLight('#ffffff', '#5f5a54', 0.35)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#ffffff', 2.6)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    scene.add(sun, sun.target)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.18 }))
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const ctx: SceneContext = { scene, camera, controls, sun, hemi, renderer, materials: new Materials(), look: new LookTransition(themeRef.current) }
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
      // Day / night lighting blends with the page theme; the sun stays bright enough to inspect the product
      ctx.look.step()
      const l = ctx.look.look
      renderer.toneMappingExposure = l.exposure
      hemi.intensity = l.hemi * 0.9
      sun.intensity = Math.max(l.sun * 1.08, 1.8)
      sun.color.copy(l.sunColor)
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

  useEffect(() => {
    themeRef.current = theme
    sceneRef.current?.look.go(theme, window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [theme])

  const set = (key: string, value: string | boolean) => setParams((p) => ({ ...p, [key]: value }))

  const pill = (active: boolean) =>
    `px-3.5 py-2 rounded-[3px] text-[0.95rem] border transition-colors ${
      active ? 'bg-graphite text-concrete border-graphite' : 'border-formline hover:border-graphite'
    }`

  return (
    <div className="relative rounded-[4px] border border-formline overflow-hidden bg-slab">
      {/* Current configuration readout and the 3D / drawing switch. Over the canvas normally;
          in its own row when compact, so it never covers the model on a narrow panel. */}
      <div className={compact ? 'flex items-start justify-between gap-3 px-4 pt-3' : 'contents'}>
        <div className={compact ? 'min-w-0' : 'absolute top-4 left-4 z-10 pointer-events-none max-w-[60%]'}>
          <p className={`type-wide ${compact ? 'text-base' : 'text-xl'}`}>{readout.title}</p>
          {readout.subtitle && <p className="text-sm text-aggregate mt-0.5">{readout.subtitle}</p>}
        </div>

        {/* 3D model / drawing switch, for products with data-backed dimensions */}
        {def.dims && (
          <div className={`${compact ? 'shrink-0' : 'absolute top-4 right-4 z-10'} flex rounded-[3px] border border-formline bg-concrete p-0.5`} role="tablist" aria-label="View">
            {(['model', 'drawing'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-[2px] text-sm transition-colors ${mode === m ? 'bg-graphite text-concrete' : 'text-aggregate hover:text-graphite'}`}
              >
                {m === 'model' ? '3D model' : 'Drawing'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The 3D canvas stays mounted while the drawing shows, so switching back is instant */}
      <div className={mode === 'model' ? `relative ${compact ? 'h-64 sm:h-72' : 'h-105 sm:h-130'}` : 'hidden'}>
        <div
          ref={mountRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onPointerDown={() => setAutoRotate(false)}
        />
      </div>

      {mode === 'drawing' && sceneRef.current && (
        <div className={compact ? 'px-4 pt-4 pb-4' : 'px-4 sm:px-8 pt-20 pb-6'}>
          <DrawingSheet def={def} params={params} materials={sceneRef.current.materials} />
          <p className="mt-4 text-sm text-aggregate">
            Indicative drawing in first-angle projection, not for construction. Dimensions in mm; only standard product sizes are dimensioned.
          </p>
        </div>
      )}

      {/* Controls */}
      <div className={`border-t border-formline bg-concrete flex flex-wrap items-start ${compact ? 'p-4 gap-x-6 gap-y-4' : 'p-5 sm:p-6 gap-x-8 gap-y-5'}`}>
        {def.options?.map((option) => (
          <div key={option.key} role="group" aria-label={option.label}>
            <p className="text-sm text-aggregate mb-2">{option.label}</p>
            <div className="flex flex-wrap gap-2">
              {option.choices.map((c) => (
                <button key={c.value} onClick={() => set(option.key, c.value)} aria-pressed={params[option.key] === c.value} className={pill(params[option.key] === c.value)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div role="group" aria-label="View">
          <p className="text-sm text-aggregate mb-2">View</p>
          <div className="flex flex-wrap gap-2">
            {def.toggles?.map((t) => (
              <button key={t.key} onClick={() => set(t.key, !params[t.key])} aria-pressed={params[t.key] === true} className={pill(params[t.key] === true)}>
                {t.label}
              </button>
            ))}
            <button onClick={() => setAutoRotate((v) => !v)} aria-pressed={autoRotate} className={pill(autoRotate)}>
              Auto-rotate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
