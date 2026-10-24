// Story steps for the scroll-driven site assembly. Index = stage number in AssemblyScene.
export interface Stage {
  tag: string
  title: string
  body: string
  part: string
  links?: { label: string; productId: string }[]
}

export const STAGES: Stage[] = [
  {
    tag: 'Structural frame',
    title: 'It starts with the grid.',
    body: 'Precast columns are set on prepared footings, fixing the structural grid that every later element depends on.',
    part: 'Columns on footings',
  },
  {
    tag: 'Beams & connections',
    title: 'Elements that lock together.',
    body: 'Pre-stressed beams tie the columns into a rigid frame, with connections designed and checked before casting.',
    part: 'Precast beams',
    links: [{ label: 'Precast Beams', productId: 'precast-beams' }],
  },
  {
    tag: 'Slabs & floors',
    title: 'Floors in hours, not weeks.',
    body: 'Hollow-core slabs span between beams and are ready for the next trade as soon as they are placed.',
    part: 'Hollow-core slabs',
    links: [{ label: 'Precast Slabs', productId: 'precast-slabs' }],
  },
  {
    tag: 'Enclosure',
    title: 'Closed in, factory finished.',
    body: 'Wall panels arrive with openings already cast in, closing the building envelope without on-site formwork.',
    part: 'Wall panels',
  },
  {
    tag: 'Drainage',
    title: 'Water handled from day one.',
    body: 'U drains line the road and box culverts carry stormwater off site, laid unit by unit with groove joints.',
    part: 'U drains & box culverts',
    links: [
      { label: 'U Drains', productId: 'u-drains' },
      { label: 'Box Culverts', productId: 'box-culverts' },
    ],
  },
  {
    tag: 'Site works',
    title: 'Finished, all precast.',
    body: 'Kerbs, paving, compound walls and light poles complete the site, each one a precast product made to the same standard.',
    part: 'Kerbs, paving, walls & lighting',
    links: [
      { label: 'Kerb Stones', productId: 'kerb-stones' },
      { label: 'Paving Tiles', productId: 'paving-tiles' },
      { label: 'Compound Walls', productId: 'compound-wall-panels' },
      { label: 'Light Poles', productId: 'light-poles' },
    ],
  },
]
