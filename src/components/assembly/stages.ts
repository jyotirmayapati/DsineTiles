import type { Stage } from '../story/stage'

// Story steps for the home page site. Index = stage number in siteStory.
export const STAGES: Stage[] = [
  {
    title: 'Start from clean ground',
    body: 'The site is set out with string lines on the column grid, and a footing is placed at every grid point, ready to take the frame.',
    part: 'Setting out and footings',
  },
  {
    title: 'Raise the columns',
    body: 'Columns are lowered onto the footings and set plumb. Everything that follows depends on getting this right.',
    part: 'Columns on footings',
  },
  {
    title: 'Lock the frame',
    body: 'Pre-stressed beams tie the columns into a rigid frame. Inside every beam, our cover blocks and wheel spacers hold the steel at the right cover.',
    part: 'Precast beams',
    links: [
      { label: 'Precast beams', productId: 'precast-beams' },
      { label: 'Cover blocks', productId: 'cover-blocks' },
      { label: 'Wheel spacers', productId: 'wheel-spacers' },
    ],
  },
  {
    title: 'Lay the floors',
    body: 'Hollow-core slabs span from beam to beam and can be walked on the day they are placed.',
    part: 'Hollow-core slabs',
    links: [{ label: 'Precast slabs', productId: 'precast-slabs' }],
  },
  {
    title: 'Close it in',
    body: 'Wall panels arrive with the window openings already cast. At the gate, a guard house goes up course by course in hollow blocks under a precast roof slab.',
    part: 'Wall panels and block walls',
    links: [
      { label: 'Hollow blocks', productId: 'hollow-blocks' },
      { label: 'Solid blocks', productId: 'solid-blocks' },
    ],
  },
  {
    title: 'Drain the site',
    body: 'U drains line the road, box culverts carry stormwater away, and catch basins, manholes, water channels and a cable trench go in flush with the ground.',
    part: 'Drainage and services',
    links: [
      { label: 'U drains', productId: 'u-drains' },
      { label: 'Box culverts', productId: 'box-culverts' },
      { label: 'Catch basins', productId: 'catch-basins' },
      { label: 'Manholes', productId: 'manhole-1200x1200' },
      { label: 'Water channels', productId: 'water-channels' },
      { label: 'Cable trench', productId: 'cable-trays' },
    ],
  },
  {
    title: 'Pave the ground',
    body: 'Kerbs edge the road. Tiles for the forecourt, pavers for the driveway, grass pavers for parking and a chequered walkway to the gate.',
    part: 'Kerbs, tiles and pavers',
    links: [
      { label: 'Kerb stones', productId: 'kerb-stones' },
      { label: 'Paving tiles', productId: 'paving-tiles' },
      { label: 'Pavers', productId: 'pavers' },
      { label: 'Grass pavers', productId: 'grass-pavers' },
      { label: 'Chequered tiles', productId: 'chequered-tiles' },
      { label: 'Saucer drains', productId: 'saucer-drains' },
    ],
  },
  {
    title: 'Edge and finish',
    body: 'Retaining walls hold a raised garden with flagstone paths and benches. Compound walls and fencing close the boundary, and street and power poles light it up.',
    part: 'Walls, poles and garden',
    links: [
      { label: 'Retaining walls', productId: 'retaining-walls' },
      { label: 'Compound walls', productId: 'compound-wall-panels' },
      { label: 'Fencing', productId: 'walls-and-fencing' },
      { label: 'Light poles', productId: 'light-poles' },
      { label: 'Electric poles', productId: 'electric-poles' },
      { label: 'Furniture', productId: 'furniture-and-decor' },
      { label: 'Flagstones', productId: 'flagstones' },
    ],
  },
]
