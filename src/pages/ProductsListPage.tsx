import { useSearchParams } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { BrandHeader, ProductTile } from '../components/Catalogue'
import { productsData, brands, type Brand } from '../data/products'
import { whatsappLink } from '../data/contact'

export default function ProductsListPage() {
  const [params, setParams] = useSearchParams()
  const selected = brands.find((b) => b === params.get('brand')) ?? null
  const shown: Brand[] = selected ? [selected] : brands

  const filters: { label: string; value: Brand | null; count: number }[] = [
    { label: 'All', value: null, count: productsData.length },
    ...brands.map((b) => ({ label: b, value: b, count: productsData.filter((p) => p.brand === b).length })),
  ]

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <header className="mx-auto max-w-[88rem] px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <h1 className="type-display text-5xl sm:text-7xl">Products</h1>
          <p className="mt-6 max-w-xl text-lg text-aggregate">
            Everything we cast, from cover blocks to box culverts. Open a product to see its sizes and turn it around in 3D.
          </p>

          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by brand">
            {filters.map((f) => {
              const active = f.value === selected
              return (
                <button
                  key={f.label}
                  onClick={() => setParams(f.value ? { brand: f.value } : {}, { replace: true })}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-[3px] border text-[0.95rem] transition-colors ${
                    active ? 'bg-graphite text-concrete border-graphite' : 'border-formline hover:border-graphite'
                  }`}
                >
                  {f.label} <span className={`tabular ${active ? 'opacity-70' : 'text-aggregate'}`}>{f.count}</span>
                </button>
              )
            })}
          </div>
        </header>

        {shown.map((brand) => (
          <section key={brand} className="mx-auto max-w-[88rem] px-5 sm:px-8 pb-20">
            <BrandHeader brand={brand} count={productsData.filter((p) => p.brand === brand).length} />
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
              {productsData.filter((p) => p.brand === brand).map((p) => (
                <ProductTile key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}

        <section className="border-t border-formline bg-slab">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8 py-20 grid gap-8 lg:grid-cols-[1fr_auto] items-end">
            <div>
              <h2 className="type-display text-3xl sm:text-4xl lg:text-5xl">Need a size we don't list?</h2>
              <p className="mt-4 max-w-xl text-lg text-aggregate">
                Most products can be cast to your drawings. Send us the dimensions and quantities.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappLink("Hi, I need a precast unit that isn't in your catalogue.")} target="_blank" rel="noopener noreferrer" className="btn-mark">
                Ask on WhatsApp
              </a>
              <a href="/#contact" className="btn-line">Send an enquiry</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
