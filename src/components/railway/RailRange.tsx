import { useEffect, useState } from 'react'
import { RAIL_STAGES } from './stages'
import { RAIL_RANGE, type RangeItem } from './range'
import RangePanel, { type PanelItem } from './RangePanel'

const ALL: PanelItem[] = RAIL_RANGE.flatMap((g) => g.items.map((item) => ({ ...item, stage: g.stage })))
const WITH_PAGE = ALL.filter((i) => i.productId).length

// Scrolls the station story back to a stage (ScrollStory listens for this)
const watch = (stage: number) => window.dispatchEvent(new CustomEvent('story:goto', { detail: { id: 'station', stage } }))

function Pin({ at }: { at: [number, number] }) {
  return (
    <span className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center" style={{ left: `${at[0]}%`, top: `${at[1]}%` }} aria-hidden="true">
      <span className="absolute w-7 h-7 rounded-full bg-marking/50 motion-safe:animate-ping [animation-duration:2.2s]" />
      <span className="relative w-3.5 h-3.5 rounded-full bg-marking ring-[3px] ring-concrete shadow-[0_1px_4px_rgba(0,0,0,0.35)]" />
    </span>
  )
}

function RangeCard({ item, onOpen }: { item: RangeItem; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group flex flex-col justify-start text-left" aria-haspopup="dialog">
      <span className="relative block aspect-[4/3] rounded-[4px] overflow-hidden border border-formline bg-slab transition-colors group-hover:border-aggregate">
        <img src={`/images/railway/${item.id}-light.webp`} alt={`${item.name} in the station model`} loading="lazy" className="w-full h-full object-cover dark:hidden transition-transform duration-700 group-hover:scale-[1.04]" />
        <img src={`/images/railway/${item.id}-dark.webp`} alt={`${item.name} in the station model`} loading="lazy" className="w-full h-full object-cover hidden dark:block transition-transform duration-700 group-hover:scale-[1.04]" />
        <Pin at={item.pin} />
        <span className="absolute left-2 bottom-2 px-2 py-1 rounded-[3px] bg-concrete/90 backdrop-blur-sm border border-formline text-xs font-semibold">
          {item.productId ? 'In our catalogue' : 'Made to order'}
        </span>
        <span className="absolute right-2 top-2 px-2 py-1 rounded-[3px] bg-graphite text-concrete text-xs font-semibold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          3D
        </span>
      </span>
      <span className="mt-3 type-wide text-base sm:text-lg leading-snug">{item.name}</span>
      <span className="mt-1 text-sm text-aggregate">{item.note}</span>
      <span className="mt-3 text-sm font-semibold underline decoration-marking decoration-2 underline-offset-4 group-hover:decoration-graphite">
        View in 3D <span aria-hidden="true">→</span>
      </span>
    </button>
  )
}

// The elements of the station, stage by stage, each shown in place with a pin
export default function RailRange() {
  const [open, setOpen] = useState<number | null>(null)
  // The station story opens elements clicked in the 3D scene, its labels and stage links
  useEffect(() => {
    const onOpen = (e: Event) => {
      const i = ALL.findIndex((a) => a.id === (e as CustomEvent<{ id: string }>).detail.id)
      if (i >= 0) setOpen(i)
    }
    window.addEventListener('range:open', onOpen)
    return () => window.removeEventListener('range:open', onOpen)
  }, [])
  return (
    <section id="range" className="py-24 sm:py-32 border-t border-formline">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-end">
          <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl">Every element in the station</h2>
          <p className="text-lg text-aggregate max-w-lg lg:justify-self-end">
            The station above is built from {ALL.length} precast elements. Each one is shown where it sits, marked with a yellow pin.
          </p>
        </div>

        {/* At a glance */}
        <dl className="mt-12 grid grid-cols-3 border-y border-formline divide-x divide-formline">
          {[
            [ALL.length, 'precast elements'],
            [RAIL_RANGE.length, 'build stages'],
            [WITH_PAGE, 'in our catalogue'],
          ].map(([n, label]) => (
            <div key={label} className="py-5 px-3 sm:px-6 first:pl-0">
              <dt className="sr-only">{label}</dt>
              <dd className="type-display text-3xl sm:text-5xl tabular">{n}</dd>
              <dd className="mt-1 text-sm sm:text-base text-aggregate">{label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-aggregate">
          <span>Open any element to turn it round in 3D, see what it does and ask for a price.</span>
          <span><b className="text-graphite">In our catalogue</b>: standard sizes. <b className="text-graphite">Made to order</b>: cast to your drawings.</span>
        </p>

        <div className="mt-16 space-y-20 sm:space-y-24">
          {RAIL_RANGE.map(({ stage, items }) => {
            const s = RAIL_STAGES[stage]
            return (
              <div key={stage} className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12">
                <div className="lg:sticky lg:top-24 self-start border-t-2 border-marking pt-5">
                  <p className="text-sm tabular text-aggregate">Stage {String(stage + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 type-wide text-2xl">{s.title}</h3>
                  <p className="mt-2 text-aggregate">{s.part}</p>
                  <button onClick={() => watch(stage)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-aggregate transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                    Watch it being built
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-10">
                  {items.map((item) => (
                    <RangeCard key={item.id} item={item} onOpen={() => setOpen(ALL.findIndex((a) => a.id === item.id))} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {open !== null && (
        <RangePanel items={ALL} index={open} onMove={setOpen} onClose={() => setOpen(null)} onWatch={watch} />
      )}
    </section>
  )
}
