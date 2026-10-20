import * as THREE from 'three'

export const CONCRETE = '#948f87'

// Near-white noise so the material colour controls the final concrete tint
function makeConcreteTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ececec'
  ctx.fillRect(0, 0, size, size)
  const img = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 30
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
  // Small air voids typical of precast surfaces
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(60,60,60,${Math.random() * 0.35})`
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Shared, cached materials for every model; disposed together with the viewer
export class Materials {
  private cache = new Map<string, THREE.Material>()
  private texture = makeConcreteTexture()

  private get<T extends THREE.Material>(key: string, create: () => T): T {
    let mat = this.cache.get(key)
    if (!mat) {
      mat = create()
      this.cache.set(key, mat)
    }
    return mat as T
  }

  concrete(color = CONCRETE) {
    return this.get(`concrete:${color}`, () =>
      new THREE.MeshStandardMaterial({ map: this.texture, color, roughness: 0.92, metalness: 0, envMapIntensity: 0.45 }),
    )
  }

  plastic(color: string) {
    return this.get(`plastic:${color}`, () => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0 }))
  }

  get steel() {
    return this.get('steel', () => new THREE.MeshStandardMaterial({ color: '#8a8d91', roughness: 0.35, metalness: 0.85 }))
  }

  // Cast iron, lifting sockets, binding wire
  get dark() {
    return this.get('dark', () => new THREE.MeshStandardMaterial({ color: '#3d3a36', roughness: 0.6, metalness: 0.4 }))
  }

  get grass() {
    return this.get('grass', () => new THREE.MeshStandardMaterial({ color: '#5f8f3a', roughness: 1 }))
  }

  get soil() {
    return this.get('soil', () => new THREE.MeshStandardMaterial({ map: this.texture, color: '#6a5443', roughness: 1 }))
  }

  get timber() {
    return this.get('timber', () => new THREE.MeshStandardMaterial({ map: this.texture, color: '#9b7650', roughness: 0.85 }))
  }

  get porcelain() {
    return this.get('porcelain', () => new THREE.MeshStandardMaterial({ color: '#f4f2ec', roughness: 0.2, metalness: 0 }))
  }

  lamp(lit: boolean) {
    return this.get(`lamp:${lit}`, () =>
      new THREE.MeshStandardMaterial({
        color: '#fffbe8',
        emissive: '#ffe9a8',
        emissiveIntensity: lit ? 2.2 : 0,
        roughness: 0.3,
      }),
    )
  }

  dispose() {
    this.cache.forEach((mat) => mat.dispose())
    this.cache.clear()
    this.texture.dispose()
  }
}
