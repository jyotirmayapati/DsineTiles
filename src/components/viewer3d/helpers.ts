import * as THREE from 'three'

// All builders work in metres; product data is in millimetres
export const mm = (v: number) => v / 1000

// Box-projected UVs in world units so the concrete grain has the same scale on every part
const UV_SCALE = 1.5
export function worldUV(geo: THREE.BufferGeometry) {
  if (!geo.attributes.normal) geo.computeVertexNormals()
  const pos = geo.attributes.position
  const nor = geo.attributes.normal
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nor.getX(i))
    const ny = Math.abs(nor.getY(i))
    const nz = Math.abs(nor.getZ(i))
    let u: number, v: number
    if (nx >= ny && nx >= nz) [u, v] = [pos.getZ(i), pos.getY(i)]
    else if (ny >= nz) [u, v] = [pos.getX(i), pos.getZ(i)]
    else [u, v] = [pos.getX(i), pos.getY(i)]
    uv[i * 2] = u * UV_SCALE
    uv[i * 2 + 1] = v * UV_SCALE
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(worldUV(geo), mat)
  m.position.set(x, y, z)
  m.castShadow = m.receiveShadow = true
  return m
}

// Extrude a shape to exactly `depth` along +z, with the bevel kept inside the outline
export function extrudeGeo(shape: THREE.Shape, depth: number, bevel = 0, curveSegments = 16) {
  const b = Math.min(bevel, depth / 4)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth - 2 * b,
    bevelEnabled: b > 0,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments: 2,
    curveSegments,
  })
  geo.translate(0, 0, b)
  return geo
}

// Cross-section drawn in XY (y up), extruded along z and centred on z = 0
export function extrudeZ(shape: THREE.Shape, length: number, bevel = 0) {
  const geo = extrudeGeo(shape, length, bevel)
  geo.translate(0, 0, -length / 2)
  return geo
}

// Plan shape drawn in XY, extruded upward from y = 0 (shape y maps to world -z)
export function extrudeUp(shape: THREE.Shape, height: number, bevel = 0) {
  const geo = extrudeGeo(shape, height, bevel)
  geo.rotateX(-Math.PI / 2)
  return geo
}

// Centre a geometry on x/z, leaving its height untouched
export function centerXZ(geo: THREE.BufferGeometry) {
  geo.computeBoundingBox()
  const c = geo.boundingBox!.getCenter(new THREE.Vector3())
  geo.translate(-c.x, 0, -c.z)
  return geo
}

export function rectShape(w: number, h: number, cx = 0, cy = 0) {
  const s = new THREE.Shape()
  s.moveTo(cx - w / 2, cy - h / 2)
  s.lineTo(cx + w / 2, cy - h / 2)
  s.lineTo(cx + w / 2, cy + h / 2)
  s.lineTo(cx - w / 2, cy + h / 2)
  s.closePath()
  return s
}

// Drops consecutive duplicate points, which break triangulation
function dedupe(points: [number, number][]) {
  return points.filter(([x, y], i) => {
    const [px, py] = points[(i - 1 + points.length) % points.length]
    return points.length < 2 || Math.abs(x - px) > 1e-9 || Math.abs(y - py) > 1e-9
  })
}

export function polyShape(points: [number, number][]) {
  const s = new THREE.Shape()
  dedupe(points).forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)))
  s.closePath()
  return s
}

export function rectHole(w: number, h: number, cx = 0, cy = 0) {
  const p = new THREE.Path()
  p.moveTo(cx - w / 2, cy - h / 2)
  p.lineTo(cx - w / 2, cy + h / 2)
  p.lineTo(cx + w / 2, cy + h / 2)
  p.lineTo(cx + w / 2, cy - h / 2)
  p.closePath()
  return p
}

export function polyHole(points: [number, number][]) {
  const p = new THREE.Path()
  points.forEach(([x, y], i) => (i === 0 ? p.moveTo(x, y) : p.lineTo(x, y)))
  p.closePath()
  return p
}

export function circleHole(r: number, cx = 0, cy = 0) {
  const p = new THREE.Path()
  p.absarc(cx, cy, r, 0, Math.PI * 2, true)
  return p
}

// Box sitting on y (bottom face), centred on x/z, with optional chamfered edges
export function block(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, bevel = 0) {
  const geo = bevel > 0 ? extrudeUp(rectShape(w, d), h, bevel) : new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0)
  return mesh(geo, mat, x, y, z)
}

// Rectangular frustum: base wb × db, top wt × dt, height h, sitting on y = 0
export function taperedBox(wb: number, db: number, wt: number, dt: number, h: number) {
  const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i)
    pos.setXYZ(i, pos.getX(i) * (wb + (wt - wb) * t), t * h, pos.getZ(i) * (db + (dt - db) * t))
  }
  geo.computeVertexNormals()
  return geo
}

// Surface of revolution around y from [radius, y] points
export function lathe(points: [number, number][], segments = 48) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments)
}

// Hollow pipe of length `len` along the y axis, starting at y = 0
export function pipeGeo(rIn: number, rOut: number, len: number) {
  return lathe([[rIn, 0], [rOut, 0], [rOut, len], [rIn, len], [rIn, 0]])
}

export function tube(points: [number, number, number][], radius: number, mat: THREE.Material, segments = 48) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))
  return mesh(new THREE.TubeGeometry(curve, segments, radius, 10, false), mat)
}

// Many copies of one geometry in a single draw call
export function instances(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  items: { x: number; y: number; z: number; ry?: number; rx?: number; rz?: number; s?: number }[],
) {
  const inst = new THREE.InstancedMesh(worldUV(geo), mat, items.length)
  const dummy = new THREE.Object3D()
  items.forEach((it, i) => {
    dummy.position.set(it.x, it.y, it.z)
    dummy.rotation.set(it.rx ?? 0, it.ry ?? 0, it.rz ?? 0)
    dummy.scale.setScalar(it.s ?? 1)
    dummy.updateMatrix()
    inst.setMatrixAt(i, dummy.matrix)
  })
  inst.castShadow = inst.receiveShadow = true
  return inst
}

// Deterministic random numbers so generated layouts look the same on every render
export function seededRandom(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function group(...children: THREE.Object3D[]) {
  const g = new THREE.Group()
  children.forEach((c) => g.add(c))
  return g
}

// Mesh that keeps its geometry's own UVs, for painted faces (mesh() swaps in world-projected UVs)
export function painted(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.castShadow = m.receiveShadow = true
  return m
}

// Painted text for boards and markers, drawn once to a canvas
export function textTexture(lines: { text: string; size: number }[], bg: string, fg: string, w = 512, h = 160) {
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

// Precast stair flight descending toward +x from (0, rise) to (run, 0), extruded across `width`
export function flightGeo(risers: number, rise: number, run: number, width: number) {
  const r = rise / risers
  const g = run / risers
  const pts: [number, number][] = [[0, rise]]
  for (let i = 0; i < risers; i++) pts.push([(i + 1) * g, rise - i * r], [(i + 1) * g, rise - (i + 1) * r])
  pts.push([0, rise - 0.28])
  return extrudeZ(polyShape(pts), width)
}
