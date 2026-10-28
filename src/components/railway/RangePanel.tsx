import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { RAIL_STAGES } from './stages'
import type { RangeItem } from './range'
import { productsData } from '../../data/products'
import { whatsappLink } from '../../data/contact'

// three.js loads the first time a panel opens
const ProductViewer = lazy(() => import('../viewer3d/ProductViewer'))

export type PanelItem = RangeItem & { stage: number }

interface Props {
  items: PanelItem[]
  index: number
  onMove: (index: number) => void
  onClose: () => void
  // Called after the panel has closed, to scroll the story to a stage
  onWatch: (stage: number) => void
}

const OUT_MS = 260

// Detail panel for one station element: 3D model, what it does, sizes and how to order.
// A side sheet on larger screens, a bottom sheet on phones; the page stays where it was.
export default function RangePanel({ items, index, onMove, onClose, onWatch }: Props) {
  const item = items[index]
  const product = item.productId ? productsData.find((p) => p.id === item.productId) : undefined
  const stage = RAIL_STAGES[item.stage]
  const [shown, setShown] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const close = (after?: () => void) => {
    setShown(false)
    window.setTimeout(() => {
      onClose()
      // Once the page behind is unlocked
      if (after) requestAnimationFrame(() => requestAnimationFrame(after))
    }, OUT_MS)
  }

  // Slide in, lock the page behind, and give focus back to the card on close
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setShown(true))
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      cancelAnimationFrame(raf)
      root.style.overflow = prevOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [])

  // New element: back to the top of the panel
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [index])

  // Esc closes, arrow keys step through elements, Tab stays inside the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      const typing = (e.target as HTMLElement).closest('input, textarea, [role="tablist"]')
      if (!typing && e.key === 'ArrowRight' && index < items.length - 1) onMove(index + 1)
      if (!typing && e.key === 'ArrowLeft' && index > 0) onMove(index - 1)
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const prev = items[index - 1]
  const next = items[index + 1]
  const sizes = product?.sizes?.length ? product.sizes : product?.dimensions ? [product.dimensions] : []
  const ask = whatsappLink(`Hi, I'd like a price for precast ${item.name.toLowerCase()} for a railway project.`)
  const arrow = 'w-10 h-10 grid place-items-center rounded-[3px] border border-formline hover:border-graphite disabled:opacity-35 disabled:hover:border-formline transition-colors'

  return (
    <>
      <div
        className={`fixed inset-0 z-[65] bg-graphite/45 backdrop-blur-[2px] transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => close()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="range-panel-title"
        className={`fixed z-[70] flex flex-col bg-concrete shadow-[0_-8px_40px_rgba(0,0,0,0.25)]
          inset-x-0 bottom-0 h-[92svh] rounded-t-[10px]
          sm:inset-x-auto sm:right-0 sm:top-0 sm:h-full sm:w-[34rem] sm:rounded-none sm:border-l sm:border-formline
          transition-transform duration-300 ease-out motion-reduce:transition-none
          ${shown ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-formline px-5 pt-3 pb-4 sm:pt-5">
          <div className="sm:hidden mx-auto mb-3 w-10 h-1 rounded-full bg-formline" aria-hidden="true" />
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm tabular text-aggregate">
                Stage {String(item.stage + 1).padStart(2, '0')} · {stage.title}
              </p>
              <h2 id="range-panel-title" className="mt-1 type-wide text-2xl leading-tight">{item.name}</h2>
            </div>
            <button ref={closeRef} onClick={() => close()} className={arrow} aria-label="Close">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-1 rounded-[3px] border border-formline text-xs font-semibold">
              {item.productId ? 'In our catalogue' : 'Made to order'}
            </span>
            <span className="ml-auto text-sm tabular text-aggregate">{index + 1} of {items.length}</span>
            <button onClick={() => onMove(index - 1)} disabled={!prev} className={arrow} aria-label={prev ? `Previous: ${prev.name}` : 'Previous'}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button onClick={() => onMove(index + 1)} disabled={!next} className={arrow} aria-label={next ? `Next: ${next.name}` : 'Next'}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-7">
          <Suspense fallback={<div className="h-72 sm:h-80 rounded-[4px] border border-formline bg-slab grid place-items-center text-sm text-aggregate">Loading 3D model…</div>}>
            <ProductViewer key={item.id} productId={item.model} initial={item.preset} compact />
          </Suspense>
          <p className="text-sm text-aggregate -mt-4">Drag to turn it round. Pinch or scroll to zoom.</p>

          <div>
            <h3 className="type-wide text-lg">What it does</h3>
            <p className="mt-2 text-aggregate leading-relaxed">{item.about}</p>
          </div>

          {product ? (
            <div>
              <h3 className="type-wide text-lg">Standard sizes</h3>
              {sizes.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <li key={s} className="px-3 py-1.5 rounded-[3px] border border-formline text-sm tabular">{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-aggregate">Sizes to order.</p>
              )}
              {product.features.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-marking shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <h3 className="type-wide text-lg">Sizes</h3>
              <p className="mt-2 text-aggregate">Cast to your drawings and specification. Send them over and we will confirm sizes, lead time and price.</p>
            </div>
          )}

          <div>
            <h3 className="type-wide text-lg">Where it goes</h3>
            <div className="mt-3 grid grid-cols-[8.5rem_1fr] gap-4 items-center">
              <span className="relative block aspect-[4/3] rounded-[4px] overflow-hidden border border-formline bg-slab">
                <img src={`/images/railway/${item.id}-light.webp`} alt="" className="w-full h-full object-cover dark:hidden" />
                <img src={`/images/railway/${item.id}-dark.webp`} alt="" className="w-full h-full object-cover hidden dark:block" />
                <span className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-marking ring-[3px] ring-concrete" style={{ left: `${item.pin[0]}%`, top: `${item.pin[1]}%` }} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-aggregate">{stage.part}</p>
                <button onClick={() => close(() => onWatch(item.stage))} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold underline decoration-marking decoration-2 underline-offset-4 hover:decoration-graphite">
                  Watch it being built
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 border-t border-formline px-5 py-4 flex flex-wrap gap-3">
          <a href={ask} target="_blank" rel="noopener noreferrer" className="btn-mark flex-1 justify-center">Ask for a price</a>
          {item.productId && (
            <a href={`/products/${item.productId}`} target="_blank" rel="noopener noreferrer" className="btn-line flex-1 justify-center">
              Full details <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </>
  )
}
