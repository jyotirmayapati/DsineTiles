import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { brands, productsData, type Brand, type Product } from '../data/products'
import { BRAND_INFO, sizeSummary } from '../data/brands'
import { TURN_FRAMES, renderFor, turntableFor } from '../data/media'

const TURN_MS = 900
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Hover turns the product on a pre-rendered turntable strip. Only on devices with a mouse and
// without reduced motion; the strip loads once the tile is on screen.
function useTurntable(id: string) {
  const tileRef = useRef<HTMLButtonElement>(null)
  const stillRef = useRef<HTMLImageElement>(null)
  const stripRef = useRef<HTMLSpanElement>(null)
  const anim = useRef({ frame: 0, target: 0, from: 0, start: 0, raf: 0, loaded: false })

  const draw = (frame: number) => {
    const strip = stripRef.current
    const still = stillRef.current
    if (!strip || !still) return
    strip.style.backgroundPosition = `${(frame / (TURN_FRAMES - 1)) * 100}% 0`
    // Both images have transparent backgrounds, so exactly one shows at a time: the strip while
    // turning, the sharper still at rest. Frame 0 matches the still, so the hand-over is invisible.
    const turning = frame > 0
    strip.style.opacity = turning ? '1' : '0'
    still.style.opacity = turning ? '0' : '1'
  }

  const play = (target: number) => {
    const a = anim.current
    a.target = target
    if (!a.loaded) return
    cancelAnimationFrame(a.raf)
    a.from = a.frame
    a.start = performance.now()
    const duration = (TURN_MS * Math.abs(target - a.from)) / (TURN_FRAMES - 1)
    const step = () => {
      const t = duration ? Math.min((performance.now() - a.start) / duration, 1) : 1
      a.frame = Math.round(a.from + (a.target - a.from) * easeInOut(t))
      draw(a.frame)
      if (t < 1) a.raf = requestAnimationFrame(step)
    }
    a.raf = requestAnimationFrame(step)
  }

  useEffect(() => {
    const tile = tileRef.current
    const canTurn = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!tile || !canTurn) return
    const a = anim.current
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const img = new Image()
      img.onload = () => {
        if (stripRef.current) stripRef.current.style.backgroundImage = `url(${img.src})`
        a.loaded = true
        if (a.target > 0) play(a.target) // already hovered while it loaded
      }
      img.src = turntableFor(id)
    }, { rootMargin: '200px' })
    io.observe(tile)
    return () => {
      io.disconnect()
      cancelAnimationFrame(a.raf)
    }
    // play is stable in behaviour; it only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') play(TURN_FRAMES - 1) },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') play(0) },
  }
  return { tileRef, stillRef, stripRef, handlers }
}

export function ProductTile({ product, className = '' }: { product: Product; className?: string }) {
  const navigate = useNavigate()
  const sizes = sizeSummary(product)
  const { tileRef, stillRef, stripRef, handlers } = useTurntable(product.id)
  return (
    // Flex column keeps content pinned to the top, so images line up whatever the text length
    <button
      ref={tileRef}
      onClick={() => navigate(`/products/${product.id}`)}
      {...handlers}
      className={`group flex flex-col justify-start text-left ${className}`}
    >
      <span className="relative block aspect-[4/3] rounded-[4px] bg-slab border border-formline overflow-hidden transition-colors group-hover:border-aggregate">
        <img ref={stillRef} src={renderFor(product.id)} alt="" loading="lazy" className="w-full h-full object-contain" />
        <span
          ref={stripRef}
          aria-hidden="true"
          className="absolute inset-0 bg-no-repeat opacity-0"
          style={{ backgroundSize: `${TURN_FRAMES * 100}% 100%` }}
        />
      </span>
      <span className="mt-3 type-wide text-base sm:text-lg leading-snug line-clamp-2">{product.title}</span>
      {sizes && <span className="mt-0.5 text-sm text-aggregate line-clamp-2">{sizes}</span>}
    </button>
  )
}

// Brand name and count, used above each brand's products
export function BrandHeader({ brand, count, children }: { brand: Brand; count: number; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-formline pb-4">
      <h3 className="type-wide text-2xl">
        {brand} <span className="text-aggregate font-normal tabular">{count}</span>
      </h3>
      {children ?? <p className="text-aggregate">{BRAND_INFO[brand].tagline}</p>}
    </div>
  )
}

const MOBILE_PREVIEW = 4

// Phones: a 2-column grid with a "show all" toggle. Tablet and up: a sideways row with arrow buttons.
function BrandRow({ brand }: { brand: Brand }) {
  const items = productsData.filter((p) => p.brand === brand)
  const [expanded, setExpanded] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.8, behavior: 'smooth' })
  const arrow = 'w-10 h-10 grid place-items-center rounded-[3px] border border-formline hover:border-graphite transition-colors'

  return (
    <div className="mt-16 sm:mt-20">
      <BrandHeader brand={brand} count={items.length}>
        <div className="flex items-center gap-5">
          <p className="text-aggregate">{BRAND_INFO[brand].tagline}</p>
          {items.length > 4 && (
            <div className="hidden lg:flex gap-2">
              <button onClick={() => scroll(-1)} className={arrow} aria-label={`Scroll ${brand} products left`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button onClick={() => scroll(1)} className={arrow} aria-label={`Scroll ${brand} products right`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
          )}
        </div>
      </BrandHeader>

      <div className="md:hidden mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
        {(expanded ? items : items.slice(0, MOBILE_PREVIEW)).map((p) => (
          <ProductTile key={p.id} product={p} />
        ))}
      </div>
      {items.length > MOBILE_PREVIEW && (
        <button onClick={() => setExpanded((v) => !v)} className="md:hidden btn-line w-full mt-8" aria-expanded={expanded}>
          {expanded ? 'Show fewer' : `Show all ${items.length} ${brand} products`}
        </button>
      )}

      <div className="hidden md:block">
        <div
          ref={rowRef}
          className="mt-6 -mx-8 px-8 flex items-start gap-5 overflow-x-auto snap-x snap-proximity scroll-px-8 overscroll-x-contain pb-4 [scrollbar-width:thin]"
        >
          {items.map((p) => (
            <ProductTile key={p.id} product={p} className="w-[17rem] lg:w-[18rem] shrink-0 snap-start" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Catalogue() {
  const navigate = useNavigate()
  return (
    <section id="catalogue" className="py-24 sm:py-32 border-t border-formline">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-end">
          <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl">What we cast</h2>
          <p className="text-lg text-aggregate max-w-lg lg:justify-self-end">
            {productsData.length} products across three brands. Open any of them to turn it around in 3D and try its sizes.
          </p>
        </div>

        {brands.map((brand) => (
          <BrandRow key={brand} brand={brand} />
        ))}

        <button onClick={() => navigate('/products')} className="btn-line mt-14">
          See the full catalogue
        </button>
      </div>
    </section>
  )
}
