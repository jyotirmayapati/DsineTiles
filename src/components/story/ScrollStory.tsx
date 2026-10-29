import { Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme'
import type { Stage } from './stage'
import type { SceneProps } from './StoryScene'

// Viewport line that drives progress; lower on mobile, where the model fills the top of the screen
const triggerLine = () => window.innerHeight * (window.innerWidth < 1024 ? 0.8 : 0.55)

interface ScrollStoryProps {
  id: string
  stages: Stage[]
  // Lazily loaded scene, so three.js only downloads with a story
  Scene: ComponentType<SceneProps>
  // Opening copy shown before the first stage (headline, intro, actions)
  intro: ReactNode
  // Part label shown before the first stage begins
  idlePart: string
  // Progress the scene plays to on its own after load, before any scrolling
  introProgress?: number
  introMs?: number
  // Open a tagged element in place (scene clicks, labels and stage links) instead of its product page
  onPick?: (id: string) => void
  // Show the monsoon toggle; the story's world draws the rain and water
  weather?: { label: string; caption: string }
  // Offer a free look around the finished model after the last stage
  explore?: { label: string; title: string }
}

// Sticky 3D stage beside scrolling copy: each stage of copy assembles its part of the model
export default function ScrollStory({ id, stages, Scene, intro, idlePart, introProgress = 0, introMs = 1600, onPick, weather, explore }: ScrollStoryProps) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const stepsRef = useRef<HTMLDivElement>(null)
  // Continuous progress 0…stages.length, read by the 3D scene every frame
  const progressRef = useRef(0)
  const [active, setActive] = useState(-1)
  const [rain, setRain] = useState(false)
  const [exploring, setExploring] = useState(false)
  const exploreBtnRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  // Exploring fills the screen: lock the page, Esc goes back (unless a detail panel is open on top)
  useEffect(() => {
    if (!exploring) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    backRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) setExploring(false)
    }
    window.addEventListener('keydown', onKey)
    const opener = exploreBtnRef.current
    return () => {
      root.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      opener?.focus({ preventScroll: true })
    }
  }, [exploring])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let intro = reduced ? introProgress : 0
    let frame = 0

    const update = () => {
      const steps = stepsRef.current
      if (!steps) return
      const rect = steps.getBoundingClientRect()
      const scrolled = Math.min(Math.max((triggerLine() - rect.top) / rect.height, 0), 0.999) * stages.length
      progressRef.current = Math.max(scrolled, intro)
      setActive(rect.top > triggerLine() ? -1 : Math.floor(scrolled))
    }
    const tick = () => {
      intro = Math.min((performance.now() - start) / introMs, 1) * introProgress
      update()
      if (intro < introProgress) frame = requestAnimationFrame(tick)
    }
    // Let the hero copy land before the intro plays
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
  }, [stages.length, introProgress, introMs])

  // Scroll so the chosen stage has just finished assembling
  const goTo = (i: number) => {
    const steps = stepsRef.current
    if (!steps) return
    const rect = steps.getBoundingClientRect()
    const top = window.scrollY + rect.top + ((i + 0.9) / stages.length) * rect.height - triggerLine()
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Other parts of the page can jump back to a stage: dispatch 'story:goto' with { id, stage }
  useEffect(() => {
    const onGoto = (e: Event) => {
      const { id: target, stage } = (e as CustomEvent<{ id: string; stage: number }>).detail
      if (target === id) goTo(stage)
    }
    window.addEventListener('story:goto', onGoto)
    return () => window.removeEventListener('story:goto', onGoto)
    // goTo only reads refs and props that are fixed for the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const current = stages[Math.max(active, 0)]

  return (
    <section id={id} className="relative">
      {/* Sticky 3D stage: right of the copy on desktop. On mobile it sits above the copy,
          which slides underneath it, so text never covers the model. */}
      <div className={`sticky top-0 h-[100svh] overflow-hidden ${exploring ? 'z-[60] pointer-events-auto' : 'z-20 lg:z-auto pointer-events-none lg:pointer-events-auto'}`}>
        <div
          className={
            exploring
              ? 'fixed inset-0 z-[60] bg-concrete'
              : 'absolute inset-x-0 top-0 h-[calc(52svh+4rem)] pt-16 bg-concrete pointer-events-auto lg:bg-transparent lg:pt-0 lg:h-auto lg:bottom-0 lg:left-[34%]'
          }
          role={exploring ? 'region' : undefined}
          aria-label={exploring ? explore?.title : undefined}
        >
          <div className="relative h-full">
            <Suspense fallback={null}>
              <Scene progressRef={progressRef} theme={theme} onSelect={(pid) => navigate(`/products/${pid}`)} onPick={onPick} rain={rain} explore={exploring} />
            </Suspense>
            {exploring && explore && (
              <div className="absolute inset-x-0 top-0 p-4 sm:p-6 flex flex-wrap items-start justify-between gap-3 pointer-events-none">
                <div className="px-3.5 py-2.5 rounded-[4px] bg-concrete/85 backdrop-blur-sm border border-formline max-w-md">
                  <p className="type-wide text-lg leading-tight">{explore.title}</p>
                  <p className="mt-1 text-sm text-aggregate pointer-coarse:hidden">Drag to turn, scroll to zoom, right-drag to move. Click any element to open it.</p>
                  <p className="mt-1 text-sm text-aggregate hidden pointer-coarse:block">Drag to turn, pinch to zoom, two fingers to move. Tap any element to open it.</p>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                  {weather && (
                    <button
                      onClick={() => setRain((r) => !r)}
                      aria-pressed={rain}
                      className={`inline-flex items-center gap-2 h-10 px-3.5 rounded-[3px] border text-sm font-semibold backdrop-blur-sm transition-colors ${
                        rain ? 'bg-marking text-marking-ink border-marking' : 'bg-concrete/85 border-formline hover:border-graphite'
                      }`}
                    >
                      {weather.label}
                    </button>
                  )}
                  <button ref={backRef} onClick={() => setExploring(false)} className="inline-flex items-center gap-2 h-10 px-3.5 rounded-[3px] bg-graphite text-concrete text-sm font-semibold hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
                    Back to the story
                  </button>
                </div>
              </div>
            )}
            {weather && !exploring && (
              <button
                onClick={() => setRain((r) => !r)}
                aria-pressed={rain}
                className={`absolute top-3 right-3 lg:top-20 lg:right-6 z-10 inline-flex items-center gap-2 h-10 px-3.5 rounded-[3px] border text-sm font-semibold backdrop-blur-sm transition-colors ${
                  rain ? 'bg-marking text-marking-ink border-marking' : 'bg-concrete/85 border-formline hover:border-graphite'
                }`}
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 15a4.5 4.5 0 1 1 1.2-8.85A6 6 0 0 1 19.5 9 3.5 3.5 0 0 1 18 15.7" />
                  <path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5" />
                </svg>
                {weather.label}
              </button>
            )}
            {/* Mobile: soft lower edge where the copy slides under the model */}
            {!exploring && <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-concrete pointer-events-none" />}
          </div>
        </div>
        {/* Soft edge so the model melts into the copy column */}
        <div className="hidden lg:block absolute inset-y-0 left-[34%] w-40 bg-linear-to-r from-concrete to-transparent pointer-events-none" />

        <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-1.5" role="group" aria-label="Jump to a stage">
          {stages.map((s, i) => (
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
          <span className="block type-wide text-base text-graphite">{active >= 0 ? current.part : idlePart}</span>
          {rain && weather ? weather.caption : 'Schematic model, not to scale'}
        </p>
      </div>

      {/* Copy column, scrolling over the stage */}
      <div className="relative z-10 -mt-[100svh] mx-auto max-w-[88rem] px-5 sm:px-8 pointer-events-none">
        <div className="lg:w-[34%] lg:pr-8 pointer-events-auto">
          <div className="min-h-[100svh] flex flex-col justify-end lg:justify-center pb-10 lg:pb-0 pt-[56svh] lg:pt-16">
            {intro}
          </div>

          <div ref={stepsRef}>
            {stages.map((s, i) => (
              <article
                key={s.title}
                className={`min-h-[75svh] lg:min-h-[85svh] flex flex-col justify-end lg:justify-center pb-10 lg:pb-0 transition-opacity duration-500 ${
                  i === active ? 'opacity-100' : 'lg:opacity-40'
                }`}
              >
                <div className="border-t border-formline pt-6 lg:border-0 lg:pt-0">
                  <p className="text-sm tabular text-aggregate">Stage {i + 1} of {stages.length}</p>
                  <h2 className="mt-2 type-display text-3xl sm:text-4xl lg:text-5xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-aggregate">{s.body}</p>
                  {explore && i === stages.length - 1 && (
                    <button ref={exploreBtnRef} onClick={() => setExploring(true)} className="btn-mark mt-6 inline-flex items-center gap-2">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3a9 9 0 1 0 9 9" /><path d="M21 3l-6 6M15 3h6v6" />
                      </svg>
                      {explore.label}
                    </button>
                  )}
                  {s.links && (
                    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {s.links.map((l) => (
                        <button
                          key={l.productId}
                          onClick={() => (onPick && l.pick ? onPick(l.pick) : navigate(`/products/${l.productId}`))}
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
