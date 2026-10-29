import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Materials } from '../viewer3d/materials'
import { LookTransition } from '../viewer3d/sceneTheme'
import type { Theme } from '../../theme'
import { clamp01, easeOut, smooth, type StoryDef } from './kit'

export interface SceneProps {
  progressRef: RefObject<number>
  theme: Theme
  onSelect?: (productId: string) => void
  // Elements tagged in the story can be hovered and clicked; the page opens them in place
  onPick?: (id: string) => void
  rain?: boolean
}

// Renders a scroll-built story: parts fly in by stage, the camera eases between stage stops,
// labels track their 3D anchors, and the lighting blends between day and night.
export default function StoryScene({ def, progressRef, theme, onSelect, onPick, rain = false }: SceneProps & { def: StoryDef }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const rainRef = useRef(rain)
  const onPickRef = useRef(onPick)
  useEffect(() => {
    rainRef.current = rain
    onPickRef.current = onPick
  })
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([])
  const themeRef = useRef(theme)
  const setThemeRef = useRef<(t: Theme) => void>(() => {})
  const { keys: KEYS, labels: LABELS } = def

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
    renderer.localClippingEnabled = true // lets a story clip parts at the model's edge (the arriving train)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const extent = def.shadowExtent
    const hemi = new THREE.HemisphereLight('#ffffff', '#5f5a54', 0.4)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#ffffff', 2.4)
    sun.castShadow = true
    sun.shadow.mapSize.setScalar(small ? 1024 : extent > 40 ? 4096 : 2048)
    Object.assign(sun.shadow.camera, { left: -extent, right: extent, top: extent, bottom: -extent, near: 1, far: extent * 4 })
    sun.shadow.camera.updateProjectionMatrix()
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.03
    scene.add(sun)

    const materials = new Materials()
    const world = def.build(materials)
    const { root, parts } = world
    scene.add(root)

    // Day and night: theme switches blend the look, so the sun sets and the lamps come on
    const lookTransition = new LookTransition(themeRef.current)
    // Rain 0…1, eased: overcast light, then the world's own rain and water
    let wet = rainRef.current ? 1 : 0
    const applyLook = (dt = 0) => {
      const l = lookTransition.look
      renderer.toneMappingExposure = l.exposure * (1 - 0.1 * wet)
      hemi.intensity = l.hemi * (1 - 0.15 * wet)
      sun.intensity = l.sun * (1 - 0.55 * wet)
      sun.color.copy(l.sunColor)
      sun.position.copy(l.sunDir).multiplyScalar(extent * 1.7)
      world.applyLook(l)
      world.weather?.(wet, dt, l)
    }
    applyLook()
    setThemeRef.current = (t: Theme) => lookTransition.go(t, reduced)

    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.5, 600)
    const labelPos = LABELS.map((l) => new THREE.Vector3(...l.pos))
    const pointer = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    mount.addEventListener('pointermove', onPointer)

    // Picking: tagged objects light up yellow under the mouse, and open on click or tap
    const pickables: THREE.Object3D[] = []
    root.traverse((o) => { if (o.userData.pick) pickables.push(o) })
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const highlight = new THREE.MeshBasicMaterial({ color: '#f2b705', transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 })
    const overlays = new Map<string, THREE.Object3D[]>()
    const overlaysFor = (id: string) => {
      let list = overlays.get(id)
      if (list) return list
      list = []
      for (const obj of pickables) {
        if (obj.userData.pick !== id) continue
        obj.traverse((m) => {
          if (!(m instanceof THREE.Mesh) || m.userData.overlay) return
          let o: THREE.Mesh
          if (m instanceof THREE.InstancedMesh) {
            const inst = new THREE.InstancedMesh(m.geometry, highlight, m.count)
            inst.instanceMatrix = m.instanceMatrix // follows instances as they land
            inst.frustumCulled = false
            o = inst
          } else {
            o = new THREE.Mesh(m.geometry, highlight)
          }
          o.userData.overlay = true
          o.raycast = () => {}
          o.visible = false
          m.add(o)
          list!.push(o)
        })
      }
      overlays.set(id, list)
      return list
    }
    // Topmost visible tagged object under a point in normalised device coordinates
    const pickAt = (x: number, y: number) => {
      if (!pickables.length) return null
      ndc.set(x, y)
      raycaster.setFromCamera(ndc, camera)
      for (const hit of raycaster.intersectObjects(pickables, true)) {
        let o: THREE.Object3D | null = hit.object
        let shown = true
        let tagged: THREE.Object3D | null = null
        while (o && o !== root) {
          if (!o.visible) shown = false
          if (!tagged && o.userData.pick) tagged = o
          o = o.parent
        }
        if (shown && tagged) return tagged
      }
      return null
    }
    let hovered: string | null = null
    let mouseInside = false
    let lastClient = { x: 0, y: 0 }
    const setHover = (obj: THREE.Object3D | null) => {
      const id = obj ? (obj.userData.pick as string) : null
      const tip = tipRef.current
      if (tip && obj) {
        const r = mount.getBoundingClientRect()
        tip.textContent = obj.userData.pickLabel
        tip.style.transform = `translate(${lastClient.x - r.left + 16}px, ${lastClient.y - r.top + 14}px)`
      }
      if (id === hovered) return
      if (hovered) overlaysFor(hovered).forEach((o) => (o.visible = false))
      if (id) overlaysFor(id).forEach((o) => (o.visible = true))
      hovered = id
      mount.style.cursor = id ? 'pointer' : ''
      if (tip) tip.style.opacity = id ? '1' : '0'
    }
    const onMove = (e: PointerEvent) => {
      mouseInside = e.pointerType === 'mouse'
      lastClient = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      mouseInside = false
      setHover(null)
    }
    const onClick = (e: MouseEvent) => {
      if (!onPickRef.current) return
      const r = mount.getBoundingClientRect()
      const hit = pickAt(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
      if (hit) onPickRef.current(hit.userData.pick)
    }
    mount.addEventListener('pointermove', onMove)
    mount.addEventListener('pointerleave', onLeave)
    mount.addEventListener('click', onClick)

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

    let last = performance.now()
    let driftT = 0
    let tick = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!visible) return
      wet += ((rainRef.current ? 1 : 0) - wet) * (reduced ? 1 : Math.min(1, dt * 1.5))
      const goal = progressRef.current ?? 0
      current = reduced ? goal : current + (goal - current) * 0.1

      // Parts: each flies in over the first part of its stage
      for (const part of parts) {
        if (part.animate) {
          part.animate(current, reduced)
          continue
        }
        const raw = clamp01((current - part.stage - part.delay) / part.duration)
        const u = reduced ? (raw > 0 ? 1 : 0) : easeOut(raw)
        part.obj.visible = raw > 0
        part.obj.position.copy(part.final).addScaledVector(part.offset, 1 - u)
      }
      world.update?.(current)

      // Camera eases between stage stops, resting mid-stage
      const c = Math.min(Math.max(current - 0.5, 0), KEYS.length - 1)
      const a = Math.min(Math.floor(c), KEYS.length - 2)
      const t = smooth(c - a)
      const A = KEYS[a]
      const B = KEYS[a + 1]
      target.lerpVectors(ta.set(...A.target), tb.set(...B.target), t)
      parallaxX += (pointer.x - parallaxX) * 0.05
      parallaxY += (pointer.y - parallaxY) * 0.05
      // Slow drift, paused while an element is under the mouse so it holds still to be clicked
      if (!hovered) driftT += dt
      const drift = reduced ? 0 : Math.sin(driftT * 0.15) * 2
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
        el.style.pointerEvents = show && (l.productId || (onPickRef.current && l.pick)) ? 'auto' : 'none'
      })
      // Hover: every other frame, since the camera drifts even when the mouse is still
      if (mouseInside && onPickRef.current && ++tick % 2 === 0) {
        const r = mount.getBoundingClientRect()
        setHover(pickAt(((lastClient.x - r.left) / r.width) * 2 - 1, -(((lastClient.y - r.top) / r.height) * 2 - 1)))
      }
      if (hovered) highlight.opacity = 0.38 + Math.sin(now / 260) * 0.12
      lookTransition.step()
      applyLook(reduced ? 0 : dt)
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
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerleave', onLeave)
      mount.removeEventListener('click', onClick)
      highlight.dispose()
      const geometries = new Set<THREE.BufferGeometry>()
      root.traverse((o) => { if (o instanceof THREE.Mesh) geometries.add(o.geometry) })
      geometries.forEach((g) => g.dispose())
      materials.dispose()
      world.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [def, progressRef, KEYS, LABELS])

  useEffect(() => {
    themeRef.current = theme
    setThemeRef.current(theme)
  }, [theme])

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" role="img" aria-label={def.ariaLabel} />
      {/* Name of the element under the mouse */}
      <div
        ref={tipRef}
        className="absolute left-0 top-0 pointer-events-none opacity-0 transition-opacity duration-150 px-2 py-1 rounded-[3px] bg-graphite text-concrete text-xs font-semibold whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
        aria-hidden="true"
      />
      {/* Product labels, positioned every frame from their 3D anchors. Desktop only; the stage copy carries the same links. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" aria-hidden="true">
        {LABELS.map((l, i) => (
          <button
            key={l.text + i}
            ref={(el) => { labelRefs.current[i] = el }}
            tabIndex={-1}
            onClick={() => (onPick && l.pick ? onPick(l.pick) : l.productId && onSelect?.(l.productId))}
            className={`absolute left-0 top-0 flex items-center gap-2 opacity-0 transition-opacity duration-500 will-change-transform ${l.productId || (onPick && l.pick) ? 'cursor-pointer' : 'cursor-default'}`}
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
