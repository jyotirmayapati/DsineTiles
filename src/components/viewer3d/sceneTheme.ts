import * as THREE from 'three'
import type { Theme } from '../../theme'

// Lighting and ground colours for 3D scenes: a yard by day, and the same yard at night.
// Switching theme blends between the two looks, so the sun sets and the lamps come on.
const LOOKS: Record<Theme, {
  exposure: number
  hemi: number
  sun: number
  sunColor: string
  sunDir: [number, number, number]
  plate: string
  road: string
  marking: string
  lamp: number // emissive intensity of lamp heads
  pool: number // intensity of the light pools under the lamps
}> = {
  light: {
    exposure: 0.85, hemi: 0.4, sun: 2.4, sunColor: '#ffffff', sunDir: [22, 40, 18],
    plate: '#efeeea', road: '#585b5f', marking: '#f4f2ec', lamp: 0, pool: 0,
  },
  dark: {
    exposure: 1, hemi: 0.26, sun: 1.2, sunColor: '#c8d4ff', sunDir: [-26, 16, 22],
    plate: '#373b41', road: '#1c1f23', marking: '#c9c6bf', lamp: 2.6, pool: 160,
  },
}

export const THEME_TRANSITION_MS = 1400

export interface SceneLook {
  exposure: number
  hemi: number
  sun: number
  sunColor: THREE.Color
  sunDir: THREE.Vector3
  plate: THREE.Color
  road: THREE.Color
  marking: THREE.Color
  lamp: number
  pool: number
}

export function sceneLook(theme: Theme): SceneLook {
  const l = LOOKS[theme]
  return {
    ...l,
    sunColor: new THREE.Color(l.sunColor),
    sunDir: new THREE.Vector3(...l.sunDir).normalize(),
    plate: new THREE.Color(l.plate),
    road: new THREE.Color(l.road),
    marking: new THREE.Color(l.marking),
  }
}

export function copyLook(src: SceneLook): SceneLook {
  return {
    ...src,
    sunColor: src.sunColor.clone(),
    sunDir: src.sunDir.clone(),
    plate: src.plate.clone(),
    road: src.road.clone(),
    marking: src.marking.clone(),
  }
}

// Blend two looks into `out`; t runs 0 → 1
export function mixLook(a: SceneLook, b: SceneLook, t: number, out: SceneLook) {
  const n = (x: number, y: number) => x + (y - x) * t
  out.exposure = n(a.exposure, b.exposure)
  out.hemi = n(a.hemi, b.hemi)
  out.sun = n(a.sun, b.sun)
  out.lamp = n(a.lamp, b.lamp)
  out.pool = n(a.pool, b.pool)
  out.sunColor.lerpColors(a.sunColor, b.sunColor, t)
  out.plate.lerpColors(a.plate, b.plate, t)
  out.road.lerpColors(a.road, b.road, t)
  out.marking.lerpColors(a.marking, b.marking, t)
  out.sunDir.lerpVectors(a.sunDir, b.sunDir, t).normalize()
  return out
}

// Drives a look toward a theme over THEME_TRANSITION_MS; call step() every frame
export class LookTransition {
  look: SceneLook
  private from: SceneLook
  private to: SceneLook
  private start = 0

  constructor(theme: Theme) {
    this.look = sceneLook(theme)
    this.from = copyLook(this.look)
    this.to = copyLook(this.look)
  }

  go(theme: Theme, instant = false) {
    this.from = copyLook(this.look)
    this.to = sceneLook(theme)
    this.start = instant ? -Infinity : performance.now()
  }

  // Returns true while the look is still changing
  step() {
    const t = Math.min((performance.now() - this.start) / THEME_TRANSITION_MS, 1)
    mixLook(this.from, this.to, t * t * (3 - 2 * t), this.look)
    return t < 1
  }
}
