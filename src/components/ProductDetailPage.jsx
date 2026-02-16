import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsData as allProducts } from '../data/products'

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
      '400 × 400 × 60mm',
      '500 × 500 × 80mm',
      '600 × 300 × 80mm',
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
    image: '/images/products/u-drains.jpg',
    specifications: [
      { label: 'Flow Capacity', value: '200-500 L/s', unit: 'liters per second' },
      { label: 'Compressive Strength', value: '45+ MPa', unit: 'megapascals' },
      { label: 'Channel Width', value: '300-1200mm', unit: 'millimeters' },
      { label: 'Wall Thickness', value: '75-150mm', unit: 'millimeters' },
      { label: 'Load Class', value: 'D400-F900', unit: 'EN 1433' },
      { label: 'Slope Options', value: '0.5-2%', unit: 'gradient' },
    ],
    dimensions: [
      '1000 × 400 × 500mm',
      '1500 × 600 × 600mm',
      '2000 × 800 × 700mm',
      'Custom specifications'
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
      '/images/products/u-drains.jpg',
      '/images/products/u-drains.jpg',
      '/images/products/u-drains.jpg',
      '/images/products/u-drains.jpg',
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
      '1000 × 1000 × 2000mm',
      '2000 × 2000 × 2500mm',
      '3000 × 3000 × 3000mm',
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
      '/images/products/box-culverts.jpg',
      '/images/products/box-culverts.jpg',
      '/images/products/box-culverts.jpg',
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
      '2400 × 1000 × 200mm',
      '3000 × 1500 × 250mm',
      '2400 × 2000 × 200mm',
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
      '/images/products/retaining-walls.jpg',
      '/images/products/retaining-walls.jpg',
      '/images/products/retaining-walls.jpg',
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
  const specifications = []
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

  // Generate feature objects with icons
  const featureIcons = ['🏗️', '💪', '⚡', '🛡️', '✓', '📐']
  const features = (basicProduct.features || []).map((feature, idx) => ({
    icon: featureIcons[idx % featureIcons.length],
    title: feature,
    description: `Premium ${basicProduct.category.toLowerCase()} featuring ${feature.toLowerCase()} for superior performance and reliability.`
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

  // Generate gallery (use same image 4 times)
  const gallery = Array(4).fill(basicProduct.image)

  return {
    ...basicProduct,
    subtitle: `Professional ${basicProduct.category} Solutions`,
    specifications,
    dimensions: basicProduct.dimensions ? [basicProduct.dimensions, 'Custom sizes available'] : ['Standard sizes', 'Custom sizes available'],
    features,
    applications,
    gallery
  }
}

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)

  // Get product data
  const basicProduct = allProducts.find(p => p.id === productId)
  const product = basicProduct ? generateDetailedProduct(basicProduct) : null

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [productId])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-display text-neutral-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-black text-white font-technical font-bold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Navigation */}
      <button
        onClick={() => navigate('/products')}
        className="fixed top-6 left-6 z-40 flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-700 font-technical hover:bg-gray-50 transition-all group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Products</span>
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1920x1080/e7e5e4/78716c?text=' + encodeURIComponent(product.title)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white" />
        </div>

        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 blueprint-line opacity-10" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 animate-[slideUp_0.8s_ease-out]">
            <span className="px-6 py-2 bg-white border border-neutral-300 rounded-full text-neutral-700 font-technical text-sm tracking-[0.3em] uppercase">
              {product.category || 'Premium Engineering'}
            </span>
          </div>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black text-neutral-900 mb-6 animate-[slideUp_0.8s_ease-out_0.2s] opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            {product.title}
          </h1>

          <p
            className="text-2xl sm:text-3xl md:text-4xl font-technical font-light text-neutral-700 mb-8 animate-[slideUp_0.8s_ease-out_0.4s] opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            {product.subtitle}
          </p>

          <p
            className="text-lg sm:text-xl text-neutral-600 font-technical max-w-4xl mx-auto leading-relaxed mb-12 animate-[slideUp_0.8s_ease-out_0.6s] opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            {product.description}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 animate-[slideUp_0.8s_ease-out_0.8s] opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            <a
              href="#specifications"
              className="px-8 py-4 bg-black text-white font-technical font-bold text-lg rounded-lg hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105"
            >
              View Specifications
            </a>
            <a
              href="/#contact"
              className="px-8 py-4 bg-white border border-neutral-300 text-neutral-700 font-technical font-bold text-lg rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Request Quote
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neutral-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-neutral-600 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border-t-2 border-l-2 border-neutral-300" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border-b-2 border-r-2 border-neutral-300" />
      </section>

      {/* Specifications Section */}
      <section id="specifications" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-display font-black text-neutral-900 mb-4">
              Technical <span className="text-neutral-700">Specifications</span>
            </h2>
            <div className="w-24 h-1 bg-neutral-600 mx-auto" />
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {product.specifications.map((spec, index) => (
              <div
                key={index}
                className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-technical font-semibold text-neutral-600 mb-2">
                      {spec.label}
                    </h3>
                    <p className="text-3xl font-display font-bold text-neutral-900 transition-all">
                      {spec.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-neutral-300 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-technical text-neutral-500 uppercase tracking-wider">
                  {spec.unit}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Dimensions */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-6">
              Available <span className="text-neutral-700">Dimensions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.dimensions.map((dimension, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-neutral-200 hover:border-neutral-400 transition-all"
                >
                  <svg className="w-6 h-6 text-neutral-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="font-technical text-neutral-600">{dimension}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-display font-black text-neutral-900 mb-4">
              Product <span className="text-neutral-700">Features</span>
            </h2>
            <p className="text-xl text-neutral-600 font-technical max-w-3xl mx-auto">
              Engineered excellence in every detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-400 transition-all duration-500 transform hover:scale-105"
              >
                <div className="text-5xl mb-6 filter drop-shadow-lg transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-4 transition-all">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 font-technical leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect corner */}
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-neutral-200 group-hover:border-neutral-400 transition-all rounded-br-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-display font-black text-neutral-900 mb-4">
              Ideal <span className="text-neutral-700">Applications</span>
            </h2>
            <p className="text-xl text-neutral-600 font-technical max-w-3xl mx-auto">
              Versatile solutions for diverse infrastructure needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.applications.map((application, index) => (
              <div
                key={index}
                className="group flex items-center space-x-4 bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-technical text-lg text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  {application}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-display font-black text-neutral-900 mb-4">
              Project <span className="text-neutral-700">Gallery</span>
            </h2>
            <p className="text-xl text-neutral-600 font-technical max-w-3xl mx-auto">
              See our products in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.gallery.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-video overflow-hidden rounded-2xl border border-neutral-200"
              >
                <img
                  src={image}
                  alt={`${product.title} application ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600/e7e5e4/78716c?text=' + encodeURIComponent(product.title)
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* View indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/90 border border-neutral-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white border border-neutral-200 rounded-3xl p-12 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 blueprint-line opacity-5" />

            <div className="relative z-10 text-center">
              <h2 className="text-4xl sm:text-5xl font-display font-black text-neutral-900 mb-6">
                Ready to Start Your <span className="text-neutral-700">Project?</span>
              </h2>
              <p className="text-xl text-neutral-600 font-technical mb-10 max-w-2xl mx-auto">
                Our engineering team is ready to provide custom solutions tailored to your specific requirements.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/#contact"
                  className="px-10 py-5 bg-black text-white font-technical font-bold text-lg rounded-xl hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Request a Quote</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <button
                  onClick={() => window.open('tel:+917008049913')}
                  className="px-10 py-5 bg-white border border-neutral-300 text-neutral-700 font-technical font-bold text-lg rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call Us Now</span>
                </button>
              </div>

              {/* Contact info */}
              <div className="mt-10 pt-10 border-t border-neutral-200">
                <p className="text-neutral-600 font-technical">
                  Email: <a href="mailto:sunita4dsinetiles@gmail.com" className="text-neutral-700 hover:text-neutral-900">sunita4dsinetiles@gmail.com</a>
                  {' '} | {' '}
                  Phone: <a href="tel:+917008049913" className="text-neutral-700 hover:text-neutral-900">+91 7008049913</a>
                </p>
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-neutral-300" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-neutral-300" />
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-black text-neutral-900 mb-4">
              Explore Other <span className="text-neutral-700">Products</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                  className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-400 transition-all duration-500 transform hover:scale-105 text-left"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/e7e5e4/78716c?text=' + encodeURIComponent(relatedProduct.title)
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-neutral-900 transition-all mb-2">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-sm text-neutral-600 font-technical line-clamp-2">
                      {relatedProduct.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white font-technical font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105"
            >
              <span>View All {allProducts.length} Products</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
