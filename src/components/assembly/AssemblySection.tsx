import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme'
import { productsData } from '../../data/products'
import { STAGES } from './stages'

// three.js is fetched as soon as the home page renders, while the hero copy animates in
const AssemblyScene = lazy(() => import('./AssemblyScene'))

// Viewport line that drives progress; lower on mobile, where the model fills the top of the screen
const triggerLine = () => window.innerHeight * (window.innerWidth < 1024 ? 0.8 : 0.55)

// On load the frame goes up by itself, so the first screen already shows something being built
const INTRO_PROGRESS = 0.98
const INTRO_MS = 2600

export default function AssemblySection() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const stepsRef = useRef<HTMLDivElement>(null)
  // Continuous progress 0…STAGES.length, read by the 3D scene every frame
  const progressRef = useRef(0)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let intro = reduced ? INTRO_PROGRESS : 0
    let frame = 0

    const update = () => {
      const steps = stepsRef.current
      if (!steps) return
      const rect = steps.getBoundingClientRect()
      const scrolled = Math.min(Math.max((triggerLine() - rect.top) / rect.height, 0), 0.999) * STAGES.length
      progressRef.current = Math.max(scrolled, intro)
      setActive(rect.top > triggerLine() ? -1 : Math.floor(scrolled))
    }
    const tick = () => {
      intro = Math.min((performance.now() - start) / INTRO_MS, 1) * INTRO_PROGRESS
      update()
      if (intro < INTRO_PROGRESS) frame = requestAnimationFrame(tick)
    }
    // Let the hero copy land before the columns start dropping
    const delay = window.setTimeout(() => { frame = requestAnimationFrame(tick) }, reduced ? 0 : 500)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(delay)
      cancelAnimationFrame(frame)
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

  const current = STAGES[Math.max(active, 0)]

  return (
    <section id="top" className="relative">
      {/* Sticky 3D stage: right of the copy on desktop. On mobile it sits above the copy,
          which slides underneath it, so text never covers the model. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden z-20 lg:z-auto pointer-events-none lg:pointer-events-auto">
        <div className="absolute inset-x-0 top-0 h-[calc(52svh+4rem)] pt-16 bg-concrete pointer-events-auto lg:bg-transparent lg:pt-0 lg:h-auto lg:bottom-0 lg:left-[34%]">
          <div className="relative h-full">
            <Suspense fallback={null}>
              <AssemblyScene progressRef={progressRef} theme={theme} onSelect={(id) => navigate(`/products/${id}`)} />
            </Suspense>
            {/* Mobile: soft lower edge where the copy slides under the model */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-concrete pointer-events-none" />
          </div>
        </div>
        {/* Soft edge so the model melts into the copy column */}
        <div className="hidden lg:block absolute inset-y-0 left-[34%] w-40 bg-linear-to-r from-concrete to-transparent pointer-events-none" />

        <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-1.5" role="group" aria-label="Jump to a build stage">
          {STAGES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => goTo(i)}
              aria-label={`Stage ${i + 1}: ${s.title}`}
              aria-current={i === active ? 'step' : undefined}
              className={`w-9 h-9 rounded-[3px] text-sm tabular font-semibold border transition-colors ${
                i === active
                  ? 'bg-marking text-marking-ink border-marking'
                  : i < active
                    ? 'border-graphite/60 text-graphite'
                    : 'border-formline text-aggregate hover:border-graphite'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <p className="hidden lg:block absolute left-[calc(34%+2rem)] bottom-6 text-sm text-aggregate" aria-live="polite">
          <span className="block type-wide text-base text-graphite">{active >= 0 ? current.part : 'Footings and columns'}</span>
          Schematic model, not to scale
        </p>
      </div>

      {/* Copy column, scrolling over the stage */}
      <div className="relative z-10 -mt-[100svh] mx-auto max-w-[88rem] px-5 sm:px-8 pointer-events-none">
        <div className="lg:w-[34%] lg:pr-8 pointer-events-auto">
          <div className="min-h-[100svh] flex flex-col justify-end lg:justify-center pb-10 lg:pb-0 pt-[56svh] lg:pt-16">
            <h1 className="type-display text-[2.5rem] sm:text-6xl xl:text-[4rem] rise">
              Precast, from footing to finish.
            </h1>
            <p className="mt-6 max-w-md text-lg text-aggregate rise rise-2">
              We cast drains, culverts, beams, slabs, walls, pavers and blocks in Baripada, Odisha. Scroll to watch a site go up from them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 rise rise-3">
              <a href="#contact" className="btn-mark">Get a quote</a>
              <button onClick={() => navigate('/products')} className="btn-line">
                Browse {productsData.length} products
              </button>
            </div>
          </div>

          <div ref={stepsRef}>
            {STAGES.map((s, i) => (
              <article
                key={s.title}
                className={`min-h-[75svh] lg:min-h-[85svh] flex flex-col justify-end lg:justify-center pb-10 lg:pb-0 transition-opacity duration-500 ${
                  i === active ? 'opacity-100' : 'lg:opacity-40'
                }`}
              >
                <div className="border-t border-formline pt-6 lg:border-0 lg:pt-0">
                  <p className="text-sm tabular text-aggregate">Stage {i + 1} of {STAGES.length}</p>
                  <h2 className="mt-2 type-display text-3xl sm:text-4xl lg:text-5xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-aggregate">{s.body}</p>
                  {s.links && (
                    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {s.links.map((l) => (
                        <button
                          key={l.productId}
                          onClick={() => navigate(`/products/${l.productId}`)}
                          className="font-semibold underline decoration-marking decoration-2 underline-offset-4 hover:decoration-graphite"
                        >
                          {l.label}
                        </button>
                      ))}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          {/* Room for the last stage to finish before the stage scrolls away */}
          <div className="h-[30svh] lg:h-[45svh]" />
        </div>
      </div>
    </section>
  )
}
