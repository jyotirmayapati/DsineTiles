import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Internal channel sizes (mm). Every unit is 2000mm long.
const SIZES = [300, 450, 600, 750, 900, 1200]
const LENGTH = 2000

type LoadClass = '6T' | '25T'

// Wall/base thickness for the visual model only (mm) — heavier load class gets thicker sections
function wallThickness(size: number, load: LoadClass) {
  const base = 60 + size * 0.07
  return Math.round(load === '25T' ? base * 1.35 : base)
}

// Procedural concrete texture so the model doesn't need any image assets
function makeConcreteTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#9c978f'
  ctx.fillRect(0, 0, size, size)
  const img = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 28
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
  // Small air voids typical of precast surfaces
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(70,66,60,${Math.random() * 0.35})`
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// U cross-section in metres, centred on x, sitting on y = 0, with haunches in the inner corners
function uShape(w: number, h: number, t: number) {
  const ow = w + 2 * t
  const oh = h + t
  const haunch = Math.min(w, h) * 0.08
  const s = new THREE.Shape()
  s.moveTo(-ow / 2, 0)
  s.lineTo(ow / 2, 0)
  s.lineTo(ow / 2, oh)
  s.lineTo(w / 2, oh)
  s.lineTo(w / 2, t + haunch)
  s.lineTo(w / 2 - haunch, t)
  s.lineTo(-w / 2 + haunch, t)
  s.lineTo(-w / 2, t + haunch)
  s.lineTo(-w / 2, oh)
  s.lineTo(-ow / 2, oh)
  s.closePath()
  return s
}

function buildDrain(sizeMm: number, load: LoadClass, showCover: boolean, material: THREE.Material) {
  const group = new THREE.Group()
  const w = sizeMm / 1000
  const h = sizeMm / 1000
  const t = wallThickness(sizeMm, load) / 1000
  const len = LENGTH / 1000
  const oh = h + t
  const ow = w + 2 * t

  // Main body, extruded along z and centred
  const bodyGeo = new THREE.ExtrudeGeometry(uShape(w, h, t), {
    depth: len,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
  })
  bodyGeo.translate(0, 0, -len / 2)
  const body = new THREE.Mesh(bodyGeo, material)
  body.castShadow = body.receiveShadow = true
  group.add(body)

  // Groove joint: a thinner spigot protruding from one end that seats into the next unit
  const spigotT = t * 0.45
  const spigotLen = Math.max(0.04, t * 0.5)
  const spigotGeo = new THREE.ExtrudeGeometry(uShape(w, h - t * 0.15, spigotT), { depth: spigotLen, bevelEnabled: false })
  spigotGeo.translate(0, 0, len / 2)
  const spigot = new THREE.Mesh(spigotGeo, material)
  spigot.castShadow = true
  group.add(spigot)

  // Lifting barrels: recessed sockets on top of each wall
  const socketMat = new THREE.MeshStandardMaterial({ color: '#3d3a36', roughness: 0.6, metalness: 0.4 })
  const socketGeo = new THREE.CylinderGeometry(t * 0.22, t * 0.22, 0.012, 24)
  for (const x of [-(w / 2 + t / 2), w / 2 + t / 2]) {
    for (const z of [-len / 4, len / 4]) {
      const socket = new THREE.Mesh(socketGeo, socketMat)
      socket.position.set(x, oh + 0.001, z)
      group.add(socket)
    }
  }

  // Optional RCC cover slab
  if (showCover) {
    const coverT = Math.max(0.075, t * 0.9)
    const coverGeo = new THREE.BoxGeometry(ow, coverT, len, 1, 1, 1)
    const cover = new THREE.Mesh(coverGeo, material)
    cover.position.set(0, oh + coverT / 2 + 0.004, 0)
    cover.castShadow = cover.receiveShadow = true
    group.add(cover)
  }

  return group
}

function disposeGroup(group: THREE.Group) {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) obj.geometry.dispose()
  })
}

export default function UDrainViewer() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    material: THREE.MeshStandardMaterial
    controls: OrbitControls
    camera: THREE.PerspectiveCamera
    drain?: THREE.Group
    // Pending camera move to frame the current model; cleared once reached or when the user takes over
    fit?: { target: THREE.Vector3; distance: number } | null
  } | null>(null)

  const [size, setSize] = useState(600)
  const [load, setLoad] = useState<LoadClass>('25T')
  const [showCover, setShowCover] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

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
    renderer.toneMappingExposure = 0.9
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.05, 100)
    camera.position.set(3.2, 2.2, 3.6)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1.5
    controls.maxDistance = 12
    controls.maxPolarAngle = Math.PI * 0.49
    controls.autoRotateSpeed = 1.2
    controls.target.set(0, 0.5, 0)

    scene.add(new THREE.HemisphereLight('#ffffff', '#6f6a64', 0.45))
    const sun = new THREE.DirectionalLight('#ffffff', 2.6)
    sun.position.set(4, 6, 3)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = sun.shadow.camera.bottom = -3
    sun.shadow.camera.right = sun.shadow.camera.top = 3
    sun.shadow.bias = -0.0005
    scene.add(sun)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.18 }))
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const concrete = makeConcreteTexture()
    concrete.repeat.set(2, 2)
    const material = new THREE.MeshStandardMaterial({ map: concrete, roughness: 0.92, metalness: 0, envMapIntensity: 0.6 })

    const ctx: NonNullable<typeof sceneRef.current> = { scene, material, controls, camera }
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
        if (Math.abs(next - ctx.fit.distance) < 0.005 && controls.target.distanceTo(ctx.fit.target) < 0.005) ctx.fit = null
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
      if (sceneRef.current?.drain) disposeGroup(sceneRef.current.drain)
      ground.geometry.dispose()
      concrete.dispose()
      material.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      sceneRef.current = null
    }
  }, [])

  // Rebuild the drain whenever the configuration changes
  useEffect(() => {
    const ctx = sceneRef.current
    if (!ctx) return
    if (ctx.drain) {
      ctx.scene.remove(ctx.drain)
      disposeGroup(ctx.drain)
    }
    const drain = buildDrain(size, load, showCover, ctx.material)
    ctx.scene.add(drain)
    ctx.drain = drain

    // Frame the whole unit so every size fits the viewport
    const sphere = new THREE.Box3().setFromObject(drain).getBoundingSphere(new THREE.Sphere())
    const halfFov = THREE.MathUtils.degToRad(ctx.camera.fov / 2)
    ctx.fit = { target: sphere.center, distance: (sphere.radius / Math.sin(halfFov)) * 1.3 }
  }, [size, load, showCover])

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.controls.autoRotate = autoRotate
  }, [autoRotate])

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
        <div className="absolute top-4 left-4 bg-white/90 border border-neutral-200 rounded-lg px-4 py-3 pointer-events-none">
          <p className="text-xs font-technical text-neutral-500 uppercase tracking-wider">Internal size</p>
          <p className="text-xl font-display font-bold text-neutral-900">
            {size} × {size} × {LENGTH} mm
          </p>
          <p className="text-xs font-technical text-neutral-500 mt-1">{load === '25T' ? '25 Ton heavy duty' : '6 Ton standard'}</p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-technical text-neutral-500 bg-white/80 px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
          Drag to rotate · Scroll / pinch to zoom
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-t border-neutral-200 flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs font-technical font-semibold text-neutral-500 uppercase tracking-wider mb-2">Size (mm)</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={pill(size === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-technical font-semibold text-neutral-500 uppercase tracking-wider mb-2">Load class</p>
          <div className="flex gap-2">
            {(['6T', '25T'] as LoadClass[]).map((l) => (
              <button key={l} onClick={() => setLoad(l)} className={pill(load === l)}>
                {l === '6T' ? '6 Ton' : '25 Ton'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-technical font-semibold text-neutral-500 uppercase tracking-wider mb-2">View</p>
          <div className="flex gap-2">
            <button onClick={() => setShowCover((v) => !v)} className={pill(showCover)}>
              RCC Cover
            </button>
            <button onClick={() => setAutoRotate((v) => !v)} className={pill(autoRotate)}>
              Auto-rotate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
