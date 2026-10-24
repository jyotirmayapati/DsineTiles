import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { STAGES } from './stages'

// three.js is only fetched once the home page renders this section
const AssemblyScene = lazy(() => import('./AssemblyScene'))

const pad = (n: number) => String(n).padStart(2, '0')

// Viewport line that drives progress; lower on mobile, where the sticky model covers the top half
const triggerLine = () => window.innerHeight * (window.innerWidth < 1024 ? 0.75 : 0.55)

export default function AssemblySection() {
  const navigate = useNavigate()
  const stepsRef = useRef<HTMLDivElement>(null)
  // Continuous progress 0…STAGES.length, written on scroll and read by the 3D scene every frame
  const progressRef = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const update = () => {
      const steps = stepsRef.current
      if (!steps) return
      const rect = steps.getBoundingClientRect()
      const line = triggerLine()
      const p = Math.min(Math.max((line - rect.top) / rect.height, 0), 0.999) * STAGES.length
      progressRef.current = p
      setActive(Math.floor(p))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Scroll so the chosen stage has just finished assembling
  const goTo = (i: number) => {
    const steps = stepsRef.current
    if (!steps) return
    const rect = steps.getBoundingClientRect()
    const top = window.scrollY + rect.top + ((i + 0.9) / STAGES.length) * rect.height - triggerLine()
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section id="assembly" className="relative bg-stone-50 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[5fr_7fr] lg:gap-12">
        {/* Sticky model panel (on top for mobile, right column on desktop) */}
        <div className="sticky top-16 lg:top-24 z-10 h-[46vh] lg:h-[calc(100vh-8rem)] lg:order-2 pt-4 lg:pt-0 bg-stone-50 lg:bg-transparent">
          <div className="relative h-full bg-white border border-stone-200 rounded-sm overflow-hidden">
            <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[11px] font-body font-semibold tracking-widest uppercase text-neutral-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Precast site · live model
              </span>
              <span className="text-[11px] font-body tracking-widest text-neutral-500">
                STAGE {pad(active + 1)} / {pad(STAGES.length)}
              </span>
            </div>

            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center text-sm font-body text-neutral-500">
                  Loading model…
                </div>
              }
            >
              <AssemblyScene progressRef={progressRef} />
            </Suspense>
            <div className="absolute inset-0 blueprint-line opacity-10 pointer-events-none" />

            <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 border-t border-stone-200 bg-white/90 backdrop-blur-sm text-[11px] font-body tracking-widest uppercase">
              <span className="font-semibold text-neutral-800">{STAGES[active].part}</span>
              <span className="hidden sm:inline text-neutral-500">Schematic · not to scale</span>
            </div>

            {/* Stage rail */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5" role="group" aria-label="Jump to assembly stage">
              {STAGES.map((s, i) => (
                <button
                  key={s.tag}
                  onClick={() => goTo(i)}
                  aria-label={`Show stage ${i + 1}: ${s.tag}`}
                  className={`w-8 h-8 rounded-sm text-[11px] font-body font-semibold border transition-all ${
                    i === active
                      ? 'bg-black text-white border-black'
                      : i < active
                        ? 'bg-white text-neutral-800 border-neutral-400'
                        : 'bg-white/80 text-neutral-400 border-stone-200 hover:border-neutral-400'
                  }`}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="lg:order-1 relative">
          <div className="pt-16 lg:pt-28 pb-8">
            <div className="ornamental-line mb-6" />
            <span className="px-5 py-2 bg-white border border-stone-200 rounded-sm text-neutral-700 font-body text-xs tracking-widest uppercase font-medium">
              From frame to finish
            </span>
            <h2 className="mt-6 text-4xl sm:text-5xl font-display font-bold text-neutral-900 leading-tight">
              Watch a site <span className="italic">assemble</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 font-body leading-relaxed">
              Scroll to build a complete precast project, element by element.
            </p>
          </div>

          <div ref={stepsRef}>
            {STAGES.map((s, i) => (
              <div
                key={s.tag}
                className={`min-h-[75vh] lg:min-h-[85vh] flex flex-col justify-center py-12 transition-opacity duration-500 ${
                  i === active ? 'opacity-100' : 'opacity-35'
                }`}
              >
                <div className="text-sm font-body font-semibold tracking-widest text-neutral-500">
                  {pad(i + 1)} <span className="text-neutral-400">/ {pad(STAGES.length)}</span>
                </div>
                <h3 className="mt-3 text-3xl sm:text-4xl font-display font-bold text-neutral-900 leading-tight">{s.title}</h3>
                <p className="mt-4 text-base sm:text-lg text-neutral-600 font-body leading-relaxed max-w-md">{s.body}</p>
                <span className="mt-6 text-xs font-body tracking-widest uppercase text-neutral-500">
                  {pad(i + 1)} — {s.tag}
                </span>
                {s.links && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.links.map((l) => (
                      <button
                        key={l.productId}
                        onClick={() => navigate(`/products/${l.productId}`)}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded-sm text-sm font-body text-neutral-700 hover:bg-black hover:text-white hover:border-black transition-colors"
                      >
                        {l.label} ↗
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Room for the last stage to finish before the sticky panel scrolls away */}
          <div className="h-[20vh] lg:h-[50vh]" />
        </div>
      </div>
    </section>
  )
}
