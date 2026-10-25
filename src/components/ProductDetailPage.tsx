import { useState, lazy, Suspense } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productsData as allProducts } from '../data/products'
import { hasModel3D } from './viewer3d/modelIds'
import { photosFor, renderFor } from '../data/media'
import { whatsappLink } from '../data/contact'
import Navigation from './Navigation'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { ProductTile } from './Catalogue'

// Loaded on demand so three.js only ships when a 3D view is shown
const ProductViewer = lazy(() => import('./viewer3d/ProductViewer'))

// Detailed product data for featured products
const detailedProductsData = {
  'precast-pavers': {
    id: 'precast-pavers',
    title: 'Precast Pavers',
    subtitle: 'Industrial-Grade Concrete Paving Systems',
    description: 'Engineered for maximum durability and aesthetic versatility, our precast pavers combine superior load-bearing capacity with refined surface finishes. Perfect for high-traffic pedestrian zones, commercial driveways, and premium landscaping applications.',
    image: '/images/products/precast-pavers.jpg',
    specifications: [
      { label: 'Compressive Strength', value: '50-65 MPa', unit: 'megapascals' },
      { label: 'Water Absorption', value: '< 5%', unit: 'percentage' },
      { label: 'Thickness Range', value: '60-100mm', unit: 'millimeters' },
      { label: 'Load Capacity', value: '40+ tons', unit: 'maximum load' },
      { label: 'Frost Resistance', value: 'F200+', unit: 'freeze-thaw cycles' },
      { label: 'Surface Finish', value: 'Multiple', unit: 'options available' },
    ],
    dimensions: [
      '60mm',
      '80mm',
      '100mm',
      '120mm',
      '150mm',
      '200mm',
      '300mm',
      'Custom sizes available'
    ],
    features: [
      { icon: '🔩', title: 'Interlocking Design', description: 'Precision-engineered edges ensure perfect alignment and structural integrity' },
      { icon: '💧', title: 'Permeable Options', description: 'Advanced drainage systems for sustainable water management' },
      { icon: '🎨', title: 'Aesthetic Versatility', description: 'Multiple colors, textures, and patterns to match any design vision' },
      { icon: '⚡', title: 'Rapid Installation', description: 'Modular system enables quick deployment with minimal site disruption' },
      { icon: '🛡️', title: 'Weather Resistant', description: 'Engineered to withstand extreme temperatures and environmental stress' },
      { icon: '♻️', title: 'Sustainable', description: 'Made with eco-friendly materials and recyclable components' }
    ],
    applications: [
      'Pedestrian plazas and walkways',
      'Commercial parking areas',
      'Residential driveways and patios',
      'Urban streetscaping projects',
      'Park and recreation facilities',
      'Industrial loading zones'
    ],
    gallery: [
      '/images/products/precast-pavers.jpg',
      '/images/products/precast-pavers.jpg',
      '/images/products/precast-pavers.jpg',
      '/images/products/precast-pavers.jpg',
    ]
  },
  'u-drains': {
    id: 'u-drains',
    title: 'U Drains',
    subtitle: 'Precision-Engineered Drainage Solutions',
    description: 'High-performance U-shaped drainage channels designed for optimal water flow management. Our precast U drains provide reliable, maintenance-free drainage for roads, highways, and urban infrastructure with exceptional durability.',
    image: '/images/products/Udrainmain.jpg',
    specifications: [
      { label: 'Flow Capacity', value: '200-500 L/s', unit: 'liters per second' },
      { label: 'Compressive Strength', value: '45+ MPa', unit: 'megapascals' },
      { label: 'Channel Width', value: '300-1200mm', unit: 'millimeters' },
      { label: 'Wall Thickness', value: '75-150mm', unit: 'millimeters' },
      { label: 'Load Class', value: 'D400-F900', unit: 'EN 1433' },
      { label: 'Slope Options', value: '0.5-2%', unit: 'gradient' },
    ],
    dimensionGroups: [
      {
        label: '6 Ton',
        sizes: [
          '300 × 300 × 2000mm',
          '450 × 450 × 2000mm',
          '600 × 600 × 2000mm',
          '750 × 750 × 2000mm',
          '900 × 900 × 2000mm',
          '1200 × 1200 × 2000mm',
          'Custom sizes available'
        ],
      },
      {
        label: '25 Ton',
        sizes: [
          '300 × 300 × 2000mm',
          '450 × 450 × 2000mm',
          '600 × 600 × 2000mm',
          '750 × 750 × 2000mm',
          '900 × 900 × 2000mm',
          '1200 × 1200 × 2000mm',
          'Custom sizes available'
        ],
      },
    ],
    features: [
      { icon: '🌊', title: 'Hydraulic Efficiency', description: 'Smooth interior surfaces maximize flow rate and minimize debris accumulation' },
      { icon: '🏗️', title: 'Modular System', description: 'Interlocking units enable flexible configuration for any project scale' },
      { icon: '⚙️', title: 'Corrosion Resistant', description: 'Advanced concrete mix withstands chemical exposure and harsh conditions' },
      { icon: '🔧', title: 'Easy Maintenance', description: 'Accessible design allows simple inspection and cleaning operations' },
      { icon: '📐', title: 'Precision Manufacturing', description: 'Tight tolerances ensure perfect fit and seamless installation' },
      { icon: '🎯', title: 'Load Rated', description: 'Certified for heavy traffic applications including highways' }
    ],
    applications: [
      'Highway and roadway drainage',
      'Airport runway water management',
      'Urban street drainage systems',
      'Industrial facility water control',
      'Residential subdivision drainage',
      'Sports facility perimeter drainage'
    ],
    gallery: [
      '/images/products/Udrainmain.jpg',
      '/images/products/udrain2.png',
      '/images/products/udrain3.jpg',
      '/images/products/udraun4.png',
    ]
  },
  'box-culverts': {
    id: 'box-culverts',
    title: 'Box Culverts',
    subtitle: 'Heavy-Duty Underground Infrastructure',
    description: 'Reinforced concrete box culverts engineered for maximum structural performance in demanding applications. Our precast solutions deliver unmatched strength for waterway crossings, underground passages, and high-load scenarios.',
    image: '/images/products/box-culverts.jpg',
    specifications: [
      { label: 'Load Capacity', value: 'HS20-HS25', unit: 'AASHTO rating' },
      { label: 'Compressive Strength', value: '35-50 MPa', unit: 'megapascals' },
      { label: 'Section Sizes', value: '1m - 4m', unit: 'internal span' },
      { label: 'Wall Thickness', value: '150-300mm', unit: 'millimeters' },
      { label: 'Reinforcement', value: 'High-tensile', unit: 'steel mesh' },
      { label: 'Waterproofing', value: 'Integral', unit: 'system included' },
    ],
    dimensions: [
      '600 × 600 × 2000mm',
      '1000 × 1000 × 2000mm',
      '1200 × 1200 × 2000mm',
      '1500 × 1500 × 2000mm',
      '1500 × 1800 × 2000mm',
      '1800 × 1800 × 2000mm',
      '2000 × 2000 × 2000mm',
      '2500 × 2500 × 2000mm',
      '3000 × 3000 × 2000mm',
      'Engineered custom sizes'
    ],
    features: [
      { icon: '💪', title: 'Superior Strength', description: 'Reinforced concrete design handles extreme loading conditions' },
      { icon: '⚡', title: 'Rapid Deployment', description: 'Precast sections enable fast installation with minimal excavation time' },
      { icon: '💰', title: 'Cost Effective', description: 'Reduced labor and equipment costs compared to cast-in-place alternatives' },
      { icon: '🔒', title: 'Watertight Joints', description: 'Advanced sealing systems prevent infiltration and exfiltration' },
      { icon: '📏', title: 'Quality Controlled', description: 'Factory production ensures consistent quality and dimensional accuracy' },
      { icon: '🌍', title: 'Environmentally Sound', description: 'Long service life and minimal maintenance reduce environmental impact' }
    ],
    applications: [
      'Stream and river crossings',
      'Underground utility corridors',
      'Storm water management systems',
      'Wildlife passage structures',
      'Pedestrian underpass tunnels',
      'Heavy vehicle roadway crossings'
    ],
    gallery: [
      '/images/products/box-culverts.jpg',
      '/images/products/Boxculverts2.jpg',
      '/images/products/boxculvert3.jpeg',
      '/images/products/boxculvert4.jpeg',
    ]
  },
  'retaining-walls': {
    id: 'retaining-walls',
    title: 'Retaining Walls',
    subtitle: 'Structural Earth Retention Systems',
    description: 'Advanced precast retaining wall systems combining structural integrity with architectural excellence. Our engineered solutions provide reliable slope stabilization and soil retention with customizable aesthetic options.',
    image: '/images/products/retaining-walls.jpg',
    specifications: [
      { label: 'Wall Height', value: '1m - 8m', unit: 'maximum height' },
      { label: 'Design Load', value: '15+ kN/m²', unit: 'lateral pressure' },
      { label: 'Panel Width', value: '2.4-3.0m', unit: 'meters' },
      { label: 'Panel Thickness', value: '150-250mm', unit: 'millimeters' },
      { label: 'Connection Type', value: 'Tongue & Groove', unit: 'interlock system' },
      { label: 'Finish Options', value: '12+', unit: 'textures available' },
    ],
    dimensions: [
      '60mm',
      '100mm',
      '150mm',
      'Project-specific designs'
    ],
    features: [
      { icon: '🏛️', title: 'Architectural Beauty', description: 'Multiple finish options from smooth to textured stone appearance' },
      { icon: '🏗️', title: 'Quick Assembly', description: 'Precision-fit panels stack rapidly with minimal equipment' },
      { icon: '🔩', title: 'Structural Integrity', description: 'Engineered for maximum lateral earth pressure resistance' },
      { icon: '🎨', title: 'Customizable', description: 'Choose from various colors, textures, and architectural patterns' },
      { icon: '🛠️', title: 'Minimal Maintenance', description: 'Durable concrete requires no painting or ongoing treatment' },
      { icon: '📐', title: 'Geogrid Compatible', description: 'Designed to integrate with reinforced soil systems for tall walls' }
    ],
    applications: [
      'Highway embankment support',
      'Commercial site development',
      'Residential property terracing',
      'Bridge abutment construction',
      'Parking structure walls',
      'Waterfront stabilization'
    ],
    gallery: [
      '/images/products/retaining-walls.jpg',
      '/images/products/retaining-walls2.png',
      '/images/products/retaining-walls3.jpg',
      '/images/products/retaining-walls4.jpg',
    ]
  }
}

// Function to generate detailed data from basic product info
function generateDetailedProduct(basicProduct) {
  // Use detailed data if available, otherwise create from basic data
  if (detailedProductsData[basicProduct.id]) {
    return detailedProductsData[basicProduct.id]
  }

  // Generate specifications based on available data
  const specifications: Array<{ label: string; value: string; unit: string }> = []
  if (basicProduct.dimensions) {
    specifications.push({ label: 'Dimensions', value: basicProduct.dimensions, unit: 'standard size' })
  }
  if (basicProduct.thickness) {
    specifications.push({ label: 'Thickness', value: basicProduct.thickness, unit: 'millimeters' })
  }
  if (basicProduct.type) {
    specifications.push({ label: 'Type', value: basicProduct.type, unit: 'configuration' })
  }

  // Add standard specs for all products
  specifications.push(
    { label: 'Compressive Strength', value: '35-50 MPa', unit: 'megapascals' },
    { label: 'Quality Standard', value: 'IS Certified', unit: 'compliance' },
    { label: 'Durability', value: 'High', unit: 'long-lasting' }
  )

  // Available sizes: prefer the merged sizes list, fall back to a single dimension
  const dimensions = basicProduct.sizes
    ? basicProduct.sizes
    : basicProduct.dimensions
      ? [basicProduct.dimensions, 'Custom sizes available']
      : ['Standard sizes', 'Custom sizes available']

  // Generate feature objects with icons
  const featureIcons = ['🏗️', '💪', '⚡', '🛡️', '✓', '📐']
  const features = (basicProduct.features || []).map((feature, idx) => ({
    icon: featureIcons[idx % featureIcons.length],
    title: feature,
    description: '',
  }))

  // Generate applications
  const applications = [
    `Commercial ${basicProduct.category.toLowerCase()} applications`,
    `Residential construction projects`,
    `Industrial infrastructure development`,
    `Urban development and landscaping`,
    `Government and public works`,
    `Private sector construction`
  ]

  // Use the product's own gallery images if provided, otherwise repeat the main image
  const gallery = basicProduct.gallery && basicProduct.gallery.length > 0
    ? basicProduct.gallery
    : Array(4).fill(basicProduct.image)

  return {
    ...basicProduct,
    subtitle: `Professional ${basicProduct.category} Solutions`,
    specifications,
    dimensions,
    features,
    applications,
    gallery
  }
}

interface Spec { label: string; value: string; unit: string }
interface Feature { title: string; description: string }

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState<string | null>(null)

  const basicProduct = allProducts.find((p) => p.id === productId)
  const product = basicProduct ? generateDetailedProduct(basicProduct) : null

  if (!basicProduct || !product) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen grid place-items-center px-5">
          <div className="text-center">
            <h1 className="type-display text-4xl sm:text-5xl">Product not found</h1>
            <p className="mt-4 text-aggregate">The link may be out of date. Every product we make is in the catalogue.</p>
            <button onClick={() => navigate('/products')} className="btn-mark mt-8">Open the catalogue</button>
          </div>
        </main>
      </>
    )
  }

  const photos = photosFor(basicProduct.id)
  const heroImage = photos[0]
  const gallery = photos.slice(1)
  const specs: Spec[] = product.specifications
  const features: Feature[] = product.features
  const groups: { label: string; sizes: string[] }[] = product.dimensionGroups ?? [{ label: '', sizes: product.dimensions }]
  const related = allProducts.filter((p) => p.brand === basicProduct.brand && p.id !== basicProduct.id).slice(0, 4)
  const quote = whatsappLink(`Hi, I'd like a quote for ${basicProduct.title}.`)

  return (
    <>
      <Navigation />
      <main className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-[88rem] px-5 sm:px-8 pt-10 sm:pt-16 pb-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-aggregate">
              <Link to="/products" className="hover:text-graphite">Products</Link>
              <span className="mx-2">/</span>
              <Link to={`/products?brand=${basicProduct.brand}`} className="hover:text-graphite">{basicProduct.brand}</Link>
            </nav>
            <h1 className="mt-6 type-display text-4xl sm:text-5xl xl:text-6xl">{product.title}</h1>
            <p className="mt-6 max-w-xl text-lg text-aggregate">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={quote} target="_blank" rel="noopener noreferrer" className="btn-mark">Get a quote</a>
              <a href="#specifications" className="btn-line">Sizes and specifications</a>
            </div>
          </div>

          <figure className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-slab border border-formline">
            {basicProduct.video ? (
              <video src={basicProduct.video} poster={renderFor(basicProduct.id)} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : heroImage ? (
              <img src={heroImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <img src={renderFor(basicProduct.id)} alt={`${product.title}, studio render`} className="w-full h-full object-contain" />
            )}
          </figure>
        </section>

        {/* Interactive 3D model */}
        {hasModel3D(basicProduct.id) && (
          <section id="model-360" className="border-t border-formline py-20">
            <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr] items-end mb-10">
                <h2 className="type-display text-3xl sm:text-4xl lg:text-5xl">Turn it around</h2>
                <p className="text-aggregate max-w-md lg:justify-self-end">Drag to rotate, scroll to zoom, and switch sizes and options below the model.</p>
              </div>
              <Suspense fallback={<div className="h-105 sm:h-130 rounded-[4px] border border-formline bg-slab" />}>
                <ProductViewer key={basicProduct.id} productId={basicProduct.id} />
              </Suspense>
            </div>
          </section>
        )}

        {/* Specifications and sizes */}
        <section id="specifications" className="border-t border-formline py-20 bg-slab">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8 grid gap-14 lg:grid-cols-2">
            <div>
              <h2 className="type-display text-3xl sm:text-4xl">Specifications</h2>
              <dl className="mt-8 border-t border-formline">
                {specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[1fr_auto] gap-4 py-4 border-b border-formline">
                    <dt className="text-aggregate">{spec.label}</dt>
                    <dd className="text-right">
                      <span className="font-semibold tabular">{spec.value}</span>
                      <span className="block text-sm text-aggregate">{spec.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="type-display text-3xl sm:text-4xl">Sizes</h2>
              {groups.map((g) => (
                <div key={g.label} className="mt-8">
                  {g.label && <h3 className="type-wide text-lg mb-3">{g.label}</h3>}
                  <ul className="border-t border-formline">
                    {g.sizes.map((size) => (
                      <li key={size} className={`py-3 border-b border-formline tabular ${/custom|various|order/i.test(size) ? 'text-aggregate' : 'font-semibold'}`}>
                        {size}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features and applications */}
        <section className="border-t border-formline py-20">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="type-display text-3xl sm:text-4xl">Features</h2>
              <dl className="mt-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
                {features.map((f) => (
                  <div key={f.title} className="border-t border-formline pt-4">
                    <dt className="font-semibold">{f.title}</dt>
                    {f.description && <dd className="mt-1 text-aggregate">{f.description}</dd>}
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="type-display text-3xl sm:text-4xl">Where it's used</h2>
              <ul className="mt-8 border-t border-formline">
                {product.applications.map((a: string) => (
                  <li key={a} className="py-3 border-b border-formline">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Photos from site, when we have them */}
        {gallery.length > 0 && (
          <section className="border-t border-formline py-20 bg-slab">
            <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
              <h2 className="type-display text-3xl sm:text-4xl">On site</h2>
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <button key={src} onClick={() => setLightbox(src)} className="aspect-[4/3] overflow-hidden rounded-[4px] group" aria-label={`Enlarge photo ${i + 2} of ${product.title}`}>
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {lightbox && (
          <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[100] bg-black/90 grid place-items-center p-4 sm:p-10 cursor-zoom-out" role="dialog" aria-label="Photo">
            <button onClick={() => setLightbox(null)} aria-label="Close photo" className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <img src={lightbox} alt={product.title} onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-[4px] cursor-default" />
          </div>
        )}

        {/* Quote */}
        <section className="border-t border-formline">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8 py-20 grid gap-8 lg:grid-cols-[1fr_auto] items-end">
            <div>
              <h2 className="type-display text-3xl sm:text-4xl lg:text-5xl">Price this for your site</h2>
              <p className="mt-4 max-w-xl text-lg text-aggregate">Send the size and quantity you need. We reply with a price and lead time.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={quote} target="_blank" rel="noopener noreferrer" className="btn-mark">Get a quote on WhatsApp</a>
              <a href="/#contact" className="btn-line">Send an enquiry</a>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-formline py-20 bg-slab">
            <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="type-wide text-2xl">More from {basicProduct.brand}</h2>
                <Link to={`/products?brand=${basicProduct.brand}`} className="font-semibold underline decoration-marking decoration-2 underline-offset-4">
                  All {basicProduct.brand} products
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
                {related.map((p) => <ProductTile key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
