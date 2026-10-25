import type { Brand, Product } from './products'

export const BRAND_INFO: Record<Brand, { tagline: string }> = {
  Hiperstructure: { tagline: 'Structural precast for roads, drainage and buildings.' },
  DsineTiles: { tagline: 'Pavers, tiles, blocks and outdoor pieces for finished ground.' },
  Hiperspacers: { tagline: 'Cover blocks and spacers that keep reinforcement where it belongs.' },
}

// Short size summary for cards, e.g. "300x300mm, 450x450mm, 600x600mm and custom"
export function sizeSummary(p: Product) {
  if (p.dimensions) return p.dimensions
  if (!p.sizes) return ''
  const fixed = p.sizes.filter((s) => !/custom|various/i.test(s))
  const extra = p.sizes.length > fixed.length ? ' and custom' : ''
  if (!fixed.length) return 'Sizes to order'
  return fixed.slice(0, 3).join(', ') + (fixed.length > 3 ? ' and more' : extra)
}
