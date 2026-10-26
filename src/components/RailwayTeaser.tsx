import { Link } from 'react-router-dom'

// Home page pointer to the railway station story
export default function RailwayTeaser() {
  return (
    <section className="border-t border-formline">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 py-24 sm:py-28 grid gap-10 lg:grid-cols-[1fr_1.25fr] items-center">
        <div>
          <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl">Built for the railways</h2>
          <p className="mt-6 max-w-md text-lg text-aggregate">
            Culverts, drains, platforms, sheds and foot over bridges. Watch a whole station assemble from precast, from bare ground to the first train.
          </p>
          <Link to="/railways" className="btn-mark mt-8">Explore the railway station</Link>
        </div>
        <Link to="/railways" className="block rounded-[4px] overflow-hidden border border-formline bg-slab group" aria-label="Explore the railway station">
          <img src="/images/railway-light.jpg" alt="" loading="lazy" className="w-full aspect-[16/10] object-cover dark:hidden transition-transform duration-700 group-hover:scale-[1.02]" />
          <img src="/images/railway-dark.jpg" alt="" loading="lazy" className="w-full aspect-[16/10] object-cover hidden dark:block transition-transform duration-700 group-hover:scale-[1.02]" />
        </Link>
      </div>
    </section>
  )
}
