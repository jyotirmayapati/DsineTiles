import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Materials } from './materials'
import type { Dim, DrawingView, ModelDef, Params } from './types'
import { useTheme } from '../../theme'

// Engineering drawing of a model: front, side (from the left) and plan, in first-angle projection
// as used in Indian practice. Hidden edges are dashed. Only data-backed sizes are dimensioned.

interface Range { u0: number; u1: number; v0: number; v1: number }
interface ViewRect { x: number; y: number; w: number; h: number; r: Range }
interface Layout { views: Record<DrawingView, ViewRect>; width: number; height: number; scale: number }

const MAX_HEIGHT = 760
const LABEL_BAND = 30
const VIEW_NAMES: Record<DrawingView, string> = { front: 'Front view', side: 'Side view', plan: 'Plan' }

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

function viewRange(box: THREE.Box3, view: DrawingView): Range {
  if (view === 'front') return { u0: box.min.x, u1: box.max.x, v0: box.min.y, v1: box.max.y }
  if (view === 'side') return { u0: box.min.z, u1: box.max.z, v0: box.min.y, v1: box.max.y }
  return { u0: box.min.x, u1: box.max.x, v0: box.min.z, v1: box.max.z }
}

// Faces in the paper colour hide what is behind them; visible edges on top, hidden edges dashed behind.
// Curved surfaces have no sharp edges, so a silhouette comes from back faces pushed out by `outline`
// metres (about 1 px) and drawn in ink behind the paper faces.
function lineScene(model: THREE.Object3D, ink: string, paper: string, dash: number, outline: number) {
  const scene = new THREE.Scene()
  const hull = new THREE.MeshBasicMaterial({ color: ink, side: THREE.BackSide })
  hull.onBeforeCompile = (shader) => {
    shader.uniforms.outline = { value: outline }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float outline;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(normal) * outline;')
  }
  const fill = new THREE.MeshBasicMaterial({ color: paper, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
  const visible = new THREE.LineBasicMaterial({ color: ink })
  const hidden = new THREE.LineDashedMaterial({
    color: ink, dashSize: dash, gapSize: dash * 0.8, transparent: true, opacity: 0.4, depthFunc: THREE.GreaterDepth, depthWrite: false,
  })
  const edges = new Map<THREE.BufferGeometry, THREE.EdgesGeometry>()
  const edgesOf = (g: THREE.BufferGeometry) => {
    let e = edges.get(g)
    if (!e) edges.set(g, (e = new THREE.EdgesGeometry(g, 25)))
    return e
  }
  const place = <T extends THREE.Object3D>(o: T, matrix: THREE.Matrix4, order: number) => {
    o.matrixAutoUpdate = false
    o.matrix.copy(matrix)
    o.renderOrder = order
    scene.add(o)
    return o
  }
  const addAt = (geo: THREE.BufferGeometry, matrix: THREE.Matrix4) => {
    if (!geo.attributes.normal) geo.computeVertexNormals()
    place(new THREE.Mesh(geo, hull), matrix, 0)
    place(new THREE.Mesh(geo, fill), matrix, 0)
    place(new THREE.LineSegments(edgesOf(geo), visible), matrix, 1)
    place(new THREE.LineSegments(edgesOf(geo), hidden), matrix, 2).computeLineDistances()
  }

  const instance = new THREE.Matrix4()
  model.traverse((o) => {
    if (o instanceof THREE.InstancedMesh) {
      if (o.count > 800) return // grass blades and similar texture details
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, instance)
        addAt(o.geometry, o.matrixWorld.clone().multiply(instance))
      }
    } else if (o instanceof THREE.Mesh) {
      addAt(o.geometry, o.matrixWorld)
    }
  })
  scene.updateMatrixWorld(true)

  const dispose = () => {
    edges.forEach((e) => e.dispose())
    fill.dispose()
    hull.dispose()
    visible.dispose()
    hidden.dispose()
  }
  return { scene, dispose }
}

function cameraFor(view: DrawingView, r: Range, box: THREE.Box3) {
  const depth = box.getSize(new THREE.Vector3()).length() + 40
  if (view === 'front') {
    const cam = new THREE.OrthographicCamera(r.u0, r.u1, r.v1, r.v0, 0.01, depth)
    cam.position.set(0, 0, box.max.z + 10)
    return cam
  }
  if (view === 'side') {
    // Looking from -x toward +x: screen right is +z
    const cam = new THREE.OrthographicCamera(r.u0, r.u1, r.v1, r.v0, 0.01, depth)
    cam.position.set(box.min.x - 10, 0, 0)
    cam.lookAt(box.max.x + 10, 0, 0)
    return cam
  }
  // Looking down with -z as screen up, so +z runs down the page
  const cam = new THREE.OrthographicCamera(r.u0, r.u1, -r.v0, -r.v1, 0.01, depth)
  cam.position.set(0, box.max.y + 10, 0)
  cam.up.set(0, 0, -1)
  cam.lookAt(0, 0, 0)
  return cam
}

export default function DrawingSheet({ def, params, materials }: { def: ModelDef; params: Params; materials: Materials }) {
  const { theme } = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [width, setWidth] = useState(0)
  const [sheet, setSheet] = useState<{ layout: Layout; dims: Dim[]; ink: string; paper: string } | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => setWidth(wrap.clientWidth))
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  useEffect(() => () => rendererRef.current?.dispose(), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !canvas) return
    const ink = cssVar('--graphite')
    const paper = cssVar('--slab')

    const model = def.build(params, materials)
    model.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(model)
    const dims = def.dims?.(params, box) ?? []
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    // View ranges grow to fit their dimension lines, plus a margin for labels
    const ranges = { front: viewRange(box, 'front'), side: viewRange(box, 'side'), plan: viewRange(box, 'plan') }
    for (const d of dims) {
      const r = ranges[d.view]
      for (const [u, v] of [d.a, d.b]) {
        r.u0 = Math.min(r.u0, u + d.offset[0]); r.u1 = Math.max(r.u1, u + d.offset[0])
        r.v0 = Math.min(r.v0, v + d.offset[1]); r.v1 = Math.max(r.v1, v + d.offset[1])
      }
    }
    const pad = maxDim * 0.05
    Object.values(ranges).forEach((r) => { r.u0 -= pad; r.u1 += pad; r.v0 -= pad; r.v1 += pad })
    // Align views along shared projection lines: front and side share heights, front and plan share widths
    const rowV = { v0: Math.min(ranges.front.v0, ranges.side.v0), v1: Math.max(ranges.front.v1, ranges.side.v1) }
    const colU = { u0: Math.min(ranges.front.u0, ranges.plan.u0), u1: Math.max(ranges.front.u1, ranges.plan.u1) }
    const front = { ...colU, ...rowV }
    const side = { u0: ranges.side.u0, u1: ranges.side.u1, ...rowV }
    const plan = { ...colU, v0: ranges.plan.v0, v1: ranges.plan.v1 }

    const gap = maxDim * 0.14
    const sheetW = front.u1 - front.u0 + gap + side.u1 - side.u0
    const rowH = rowV.v1 - rowV.v0
    const planH = plan.v1 - plan.v0
    const s = Math.min(width / sheetW, (MAX_HEIGHT - 2 * LABEL_BAND) / (rowH + gap + planH))
    const x0 = (width - sheetW * s) / 2
    const fw = (front.u1 - front.u0) * s
    const layout: Layout = {
      scale: s,
      width,
      height: Math.ceil((rowH + gap + planH) * s + 2 * LABEL_BAND),
      views: {
        front: { x: x0, y: 0, w: fw, h: rowH * s, r: front },
        side: { x: x0 + fw + gap * s, y: 0, w: (side.u1 - side.u0) * s, h: rowH * s, r: side },
        plan: { x: x0, y: rowH * s + LABEL_BAND + gap * s, w: fw, h: planH * s, r: plan },
      },
    }

    let renderer = rendererRef.current
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      rendererRef.current = renderer
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, layout.height)
    renderer.setScissorTest(true)
    renderer.setClearColor(0x000000, 0)
    renderer.setScissor(0, 0, width, layout.height)
    renderer.clear()

    const { scene, dispose } = lineScene(model, ink, paper, maxDim * 0.012, 1.1 / s)
    for (const view of ['front', 'side', 'plan'] as DrawingView[]) {
      const v = layout.views[view]
      const glY = layout.height - v.y - v.h
      renderer.setViewport(v.x, glY, v.w, v.h)
      renderer.setScissor(v.x, glY, v.w, v.h)
      renderer.render(scene, cameraFor(view, v.r, box))
    }
    dispose()
    model.traverse((o) => { if (o instanceof THREE.Mesh) o.geometry.dispose() })
    setSheet({ layout, dims, ink, paper })
  }, [def, params, materials, width, theme])

  // Model coordinates in a view to sheet pixels
  const toPx = (layout: Layout, view: DrawingView, u: number, v: number): [number, number] => {
    const r = layout.views[view]
    const x = r.x + (u - r.r.u0) * layout.scale
    const y = view === 'plan' ? r.y + (v - r.r.v0) * layout.scale : r.y + (r.r.v1 - v) * layout.scale
    return [x, y]
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <canvas ref={canvasRef} className="block" />
      {sheet && (
        <svg className="absolute inset-0 pointer-events-none" width={sheet.layout.width} height={sheet.layout.height} aria-hidden="true">
          {(['front', 'side', 'plan'] as DrawingView[]).map((view) => {
            const r = sheet.layout.views[view]
            return (
              <text key={view} x={r.x + r.w / 2} y={r.y + r.h + 20} textAnchor="middle" fontSize="12" fill={sheet.ink} opacity="0.7">
                {VIEW_NAMES[view]}
              </text>
            )
          })}
          {sheet.dims.map((d, i) => {
            const A = toPx(sheet.layout, d.view, ...d.a)
            const B = toPx(sheet.layout, d.view, ...d.b)
            const A2 = toPx(sheet.layout, d.view, d.a[0] + d.offset[0], d.a[1] + d.offset[1])
            const B2 = toPx(sheet.layout, d.view, d.b[0] + d.offset[0], d.b[1] + d.offset[1])
            const len = Math.hypot(B2[0] - A2[0], B2[1] - A2[1]) || 1
            const dir = [(B2[0] - A2[0]) / len, (B2[1] - A2[1]) / len]
            const ext = [A2[0] - A[0], A2[1] - A[1]]
            const extLen = Math.hypot(ext[0], ext[1])
            const extDir = extLen ? [ext[0] / extLen, ext[1] / extLen] : null
            // Label sits on the far side of the dimension line from the object
            let n = [-dir[1], dir[0]]
            if (extDir ? n[0] * extDir[0] + n[1] * extDir[1] < 0 : n[1] > 0) n = [-n[0], -n[1]]
            const mid = [(A2[0] + B2[0]) / 2 + n[0] * 10, (A2[1] + B2[1]) / 2 + n[1] * 10]
            let angle = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI
            if (angle > 90) angle -= 180
            if (angle <= -90) angle += 180
            const tick = [(dir[0] - dir[1]) * 4, (dir[0] + dir[1]) * 4]
            return (
              <g key={i} stroke={sheet.ink} strokeWidth="1" fill="none">
                {extDir && [[A, A2], [B, B2]].map(([P, Q], k) => (
                  <line key={k} x1={P[0] + extDir[0] * 3} y1={P[1] + extDir[1] * 3} x2={Q[0] + extDir[0] * 5} y2={Q[1] + extDir[1] * 5} opacity="0.6" />
                ))}
                <line x1={A2[0]} y1={A2[1]} x2={B2[0]} y2={B2[1]} />
                {[A2, B2].map((P, k) => (
                  <line key={k} x1={P[0] - tick[0]} y1={P[1] - tick[1]} x2={P[0] + tick[0]} y2={P[1] + tick[1]} strokeWidth="1.5" />
                ))}
                <text
                  x={mid[0]} y={mid[1]} transform={`rotate(${angle} ${mid[0]} ${mid[1]})`}
                  textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="600"
                  fill={sheet.ink} stroke={sheet.paper} strokeWidth="4" paintOrder="stroke" style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
