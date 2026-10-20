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

export function hasModel3D(id: string): id is ModelId {
  return (MODEL_IDS as readonly string[]).includes(id)
}
