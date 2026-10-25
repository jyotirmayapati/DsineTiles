import { useNavigate } from 'react-router-dom'
import { brands, productsData } from '../data/products'
import { CONTACT } from '../data/contact'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="border-t border-formline bg-slab">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 grid place-items-center rounded-[3px] bg-graphite text-concrete type-wide text-lg leading-none" aria-hidden="true">H</span>
            <span className="type-wide text-lg">Hiperstructures</span>
          </div>
          <p className="mt-4 text-aggregate">
            Precast concrete cast in Baripada, Odisha, for roads, drains, buildings and outdoor spaces.
          </p>
        </div>

        {brands.map((brand) => (
          <div key={brand}>
            <h3 className="type-wide text-base">{brand}</h3>
            <ul className="mt-4 space-y-2 text-[0.95rem]">
              {productsData.filter((p) => p.brand === brand).slice(0, 6).map((p) => (
                <li key={p.id}>
                  <button onClick={() => navigate(`/products/${p.id}`)} className="text-aggregate hover:text-graphite transition-colors text-left">
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Oversized wordmark closing the page */}
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 overflow-hidden" aria-hidden="true">
        {/* The word is ~9.2em wide, so this fills the content width exactly */}
        <p className="type-display text-[min(calc((100vw-2.5rem)/9.3),9rem)] sm:text-[min(calc((100vw-4rem)/9.3),9rem)] leading-[0.82] text-formline whitespace-nowrap select-none -mb-[0.06em]">
          Hiperstructures
        </p>
      </div>

      <div className="border-t border-formline">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 py-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-sm text-aggregate">
          <p>© {new Date().getFullYear()} Hiperstructures</p>
          <p className="flex flex-wrap gap-x-6 gap-y-1">
            <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-graphite">{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`} className="hover:text-graphite [overflow-wrap:anywhere]">{CONTACT.email}</a>
            <span>{CONTACT.town}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
