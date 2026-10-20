import type * as THREE from 'three'
import type { Materials } from './materials'

export type Params = Record<string, string | boolean>

export interface OptionDef {
  key: string
  label: string
  choices: { value: string; label: string }[]
  default: string
}

export interface ToggleDef {
  key: string
  label: string
  default: boolean
}

export interface ModelDef {
  options?: OptionDef[]
  toggles?: ToggleDef[]
  // Text shown in the viewer's corner card for the current configuration
  readout: (p: Params) => { title: string; subtitle?: string }
  // Returns the model in metres, sitting on y = 0
  build: (p: Params, m: Materials) => THREE.Object3D
}

export const str = (p: Params, key: string) => String(p[key])
export const num = (p: Params, key: string) => Number(p[key])
export const on = (p: Params, key: string) => p[key] === true

// Look up the display label of the selected choice
export function choiceLabel(def: OptionDef, p: Params) {
  return def.choices.find((c) => c.value === p[def.key])?.label ?? ''
}
