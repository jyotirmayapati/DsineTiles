import { useState } from 'react'

const REASONS = [
  {
    title: 'Made to the drawing',
    body: 'Factory production keeps every unit to the exact specification, so joints close and runs stay straight.',
    image: '/images/products/web/Udrainmain.jpg',
  },
  {
    title: 'Faster on site',
    body: 'Units arrive ready to place, which cuts labour on site and the disruption to traffic and neighbours around it.',
    image: '/images/products/web/Boxculverts2.jpg',
  },
  {
    title: 'Lower carbon',
    body: 'Eco-friendly concrete mixes reduce the carbon in every unit without giving up strength or durability.',
    image: '/images/products/web/precast-pavers.jpg',
  },
]

// Figures carried over from the previous site
const FIGURES = [
  { value: '50%', label: 'faster installation' },
  { value: '30%', label: 'cost savings' },
  { value: '100%', label: 'quality control' },
  { value: '25 yr+', label: 'product lifespan' },
]

export default function WhyPrecast() {
  const [open, setOpen] = useState(0)
  return (
    <section id="why" className="py-24 sm:py-32 bg-slab border-y border-formline">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl max-w-3xl">Why build with precast</h2>

        {/* Panels widen on hover or focus; the open one shows its full text */}
        <div className="mt-14 flex flex-col md:flex-row gap-3 md:h-[30rem]">
          {REASONS.map((r, i) => (
            <button
              key={r.title}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className={`relative overflow-hidden rounded-[4px] text-left h-72 md:h-auto transition-[flex-grow] duration-500 ease-out ${
                open === i ? 'md:grow-[2.6]' : 'md:grow'
              } md:basis-0`}
            >
              <img src={r.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/5" />
              <span className="relative h-full flex flex-col justify-end p-6 text-white">
                <span className="type-wide text-2xl">{r.title}</span>
                <span
                  className={`mt-2 max-w-md text-white/85 transition-opacity duration-500 ${
                    open === i ? 'opacity-100' : 'md:opacity-0'
                  }`}
                >
                  {r.body}
                </span>
              </span>
            </button>
          ))}
        </div>

        <dl className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {FIGURES.map((f) => (
            <div key={f.label} className="border-t border-formline pt-5">
              <dt className="text-aggregate">{f.label}</dt>
              <dd className="mt-1 type-display text-4xl sm:text-5xl tabular">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
