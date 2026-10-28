// Product ids that have an interactive 3D model. Kept free of three.js imports so the
// product page can check for a model without pulling the 3D bundle.
export const MODEL_IDS = [
  // DsineTiles
  'precast-pavers',
  'chequered-tiles',
  'kerb-stones',
  'saucer-drains',
  'hollow-blocks',
  'solid-blocks',
  'pavers',
  'grass-pavers',
  'paving-tiles',
  'flagstones',
  'water-channels',
  'walls-and-fencing',
  'furniture-and-decor',
  // Hiperspacers
  'cover-blocks',
  'wheel-spacers',
  // Hiperstructure
  'u-drains',
  'box-culverts',
  'retaining-walls',
  'catch-basins',
  'manhole-1200x1200',
  'compound-wall-panels',
  'compound-wall-posts',
  'precast-slabs',
  'precast-beams',
  'cable-trays',
  'electric-poles',
  'light-poles',
] as const

export type ModelId = (typeof MODEL_IDS)[number]

// Railway elements cast to order: viewable in 3D, but not catalogue products
export const RAIL_MODEL_IDS = [
  'rail-sleepers',
  'rail-km-stone',
  'rail-gradient-post',
  'rail-fouling-mark',
  'rail-coping',
  'rail-shed-footing',
  'rail-column',
  'rail-wall-panel',
  'rail-name-board',
  'rail-fob',
  'rail-staircase',
  'rail-picket-fence',
] as const

export type RailModelId = (typeof RAIL_MODEL_IDS)[number]

// Anything the 3D viewer can show
export type ViewerModelId = ModelId | RailModelId

export function hasModel3D(id: string): id is ModelId {
  return (MODEL_IDS as readonly string[]).includes(id)
}
