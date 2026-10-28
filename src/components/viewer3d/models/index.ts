import type { ModelId, ViewerModelId } from '../modelIds'
import type { ModelDef } from '../types'
import { dsineTilesModels } from './dsinetiles'
import { hiperspacersModels } from './hiperspacers'
import { hiperstructureModels } from './hiperstructure'
import { railwayModels } from './railway'

// Typed against MODEL_IDS so a missing or misspelled model fails the type-check
export const MODELS: Record<ModelId, ModelDef> = {
  ...dsineTilesModels,
  ...hiperspacersModels,
  ...hiperstructureModels,
}

// Catalogue models plus the railway elements cast to order
export const VIEWER_MODELS: Record<ViewerModelId, ModelDef> = {
  ...MODELS,
  ...railwayModels,
}
