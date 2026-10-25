// Real photos (web-sized copies in /images/products/web) and studio renders for every product.
// Products without photos show their render, so no card is ever empty.
const WEB = '/images/products/web/'

const PHOTOS: Record<string, string[]> = {
  'u-drains': ['Udrainmain.jpg', 'udrain2.jpg', 'udrain3.jpg', 'udraun4.jpg'],
  'box-culverts': ['box-culverts.jpg', 'Boxculverts2.jpg', 'boxculvert3.jpg', 'boxculvert4.jpg'],
  'retaining-walls': ['retaining-walls.jpg', 'retaining-walls2.jpg', 'retaining-walls3.jpg', 'retaining-walls4.jpg'],
  'manhole-1200x1200': ['manhole1.jpg', 'manhole2.jpg', 'manhole3.jpg', 'manhole4.jpg'],
  'compound-wall-panels': ['compound-walls1.jpg'],
  'precast-pavers': ['precast-pavers.jpg'],
}

export const photosFor = (id: string) => (PHOTOS[id] ?? []).map((f) => WEB + f)

export const renderFor = (id: string) => `/images/renders/${id}.webp`

// Turntable strip: TURN_FRAMES frames side by side, sweeping from the still's corner round to the other front corner.
// Frame 0 matches the still exactly.
export const TURN_FRAMES = 19
export const turntableFor = (id: string) => `/images/renders/${id}-turn.webp`
