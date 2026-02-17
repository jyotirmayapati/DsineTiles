export default function Products() {
  const products = [
    {
      title: 'Precast Pavers',
      description: 'Durable, aesthetically pleasing pavers for pedestrian areas, driveways, and landscaping with superior load-bearing capacity.',
      features: ['High durability', 'Multiple designs', 'Easy installation', 'Weather resistant'],
      image: '/images/products/precast-pavers.jpg',
      gradient: 'from-electric-500 to-cyan-500',
    },
    {
      title: 'U Drains',
      description: 'Precision-engineered U-shaped drainage systems for efficient water management in roads, highways, and urban infrastructure.',
      features: ['Efficient drainage', 'Corrosion resistant', 'Modular design', 'Long lifespan'],
      image: '/images/products/u-drains.jpg',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Box Culverts',
      description: 'Heavy-duty box culverts designed for underground drainage, waterway crossings, and load-bearing applications.',
      features: ['High strength', 'Custom sizes', 'Rapid installation', 'Cost effective'],
      image: '/images/products/box-culverts.jpg',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Retaining Walls',
      description: 'Engineered precast retaining wall systems providing structural stability for soil retention and slope protection.',
      features: ['Structural integrity', 'Aesthetic options', 'Quick assembly', 'Minimal maintenance'],
      image: '/images/products/retaining-walls.jpg',
      gradient: 'from-indigo-500 to-electric-500',
    },
  ]

  return (
    <section id="products" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-electric-500/10 border border-electric-500/30 rounded-full text-electric-400 font-technical text-sm tracking-widest uppercase">
              Our Solutions
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-6">
            Premium <span className="text-gradient">Precast Products</span>
          </h2>
          <p className="text-xl text-concrete-300 font-technical max-w-3xl mx-auto">
            Cutting-edge concrete solutions engineered for modern infrastructure demands
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative glass-effect rounded-2xl overflow-hidden tech-border hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className={`absolute top-4 right-4 px-4 py-2 bg-linear-to-r ${product.gradient} rounded-lg`}>
                  <span className="text-slate-950 font-technical font-bold text-sm">Premium Quality</span>
                </div>
              </div>

              <div className="p-8">
                {/* Product Title */}
                <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                  {product.title}
                </h3>

                {/* Product Description */}
                <p className="text-concrete-300 font-technical leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-sm text-concrete-400 font-technical"
                    >
                      <svg
                        className="w-5 h-5 text-electric-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                <button className="w-full py-3 bg-linear-to-r from-electric-500/20 to-electric-600/20 border border-electric-500/50 text-electric-400 font-technical font-semibold rounded-lg hover:from-electric-500 hover:to-electric-600 hover:text-slate-950 transition-all duration-300 flex items-center justify-center space-x-2 group">
                  <span>Learn More</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-electric-500/30 rounded-tl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-electric-500/30 rounded-br-lg" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-flex items-center space-x-2 px-8 py-4 glass-effect text-electric-400 font-technical font-bold text-lg rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
          >
            <span>Request Custom Solution</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
