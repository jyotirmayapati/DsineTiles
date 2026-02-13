import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Contact from '../components/Contact'
import Navigation from '../components/Navigation'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const products = [
    {
      id: 'precast-pavers',
      title: 'Precast Pavers',
      description: 'Durable, aesthetically pleasing pavers for pedestrian areas, driveways, and landscaping with superior load-bearing capacity.',
      features: ['High durability', 'Multiple designs', 'Easy installation', 'Weather resistant'],
      image: '/images/products/precast-pavers.jpg',
      gradient: 'from-electric-500 to-cyan-500',
    },
    {
      id: 'u-drains',
      title: 'U Drains',
      description: 'Precision-engineered U-shaped drainage systems for efficient water management in roads, highways, and urban infrastructure.',
      features: ['Efficient drainage', 'Corrosion resistant', 'Modular design', 'Long lifespan'],
      image: '/images/products/u-drains.jpg',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'box-culverts',
      title: 'Box Culverts',
      description: 'Heavy-duty box culverts designed for underground drainage, waterway crossings, and load-bearing applications.',
      features: ['High strength', 'Custom sizes', 'Rapid installation', 'Cost effective'],
      image: '/images/products/box-culverts.jpg',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'retaining-walls',
      title: 'Retaining Walls',
      description: 'Engineered precast retaining wall systems providing structural stability for soil retention and slope protection.',
      features: ['Structural integrity', 'Aesthetic options', 'Quick assembly', 'Minimal maintenance'],
      image: '/images/products/retaining-walls.jpg',
      gradient: 'from-indigo-500 to-electric-500',
    },
  ]

  return (
    <>
      <Navigation scrolled={scrolled} />
      <Hero />

      {/* Products Section */}
      <section id="products" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="ornamental-line mx-auto mb-6" />
            <div className="inline-block mb-6">
              <span className="px-5 py-2 bg-bronze-50 border border-bronze-200 rounded-sm text-bronze-700 font-body text-xs tracking-widest uppercase">
                Our Collection
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6 leading-tight">
              Premium <span className="text-gradient italic">Precast Products</span>
            </h2>
            <p className="text-lg text-charcoal-600 font-body max-w-2xl mx-auto leading-relaxed">
              Exceptional concrete solutions crafted with precision for enduring quality and architectural beauty
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {products.map((product, index) => (
              <div
                key={index}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group relative premium-card overflow-hidden hover:elevated-shadow transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-sm shadow-lg">
                    <span className="text-bronze-700 font-body font-semibold text-sm tracking-wide">Premium Quality</span>
                  </div>
                </div>

                <div className="p-8">
                  {/* Product Title */}
                  <h3 className="text-2xl font-display font-semibold text-charcoal-800 mb-4 group-hover:text-bronze-600 transition-all duration-300">
                    {product.title}
                  </h3>

                  {/* Product Description */}
                  <p className="text-charcoal-600 font-body leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 text-sm text-stone-700 font-body"
                      >
                        <svg
                          className="w-5 h-5 text-bronze-600 flex-shrink-0"
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

                  {/* View Details Button */}
                  <button className="w-full py-3 bg-stone-100 border border-stone-300 text-charcoal-700 font-body font-semibold rounded-sm hover:bg-bronze-600 hover:text-white hover:border-bronze-600 transition-all duration-300 flex items-center justify-center space-x-2 group">
                    <span>View Details</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>

                {/* Decorative corner accents */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-bronze-400/40" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-bronze-400/40" />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="ornamental-line mx-auto mb-8" />
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-bronze-600 text-bronze-700 font-body font-semibold text-base rounded-sm hover:bg-bronze-600 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-md"
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
                  strokeWidth={1.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Features />
      <Contact />

      {/* Footer */}
      <footer className="relative border-t border-stone-300 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-bronze-600 to-bronze-500 rounded-sm flex items-center justify-center shadow-md">
                  <span className="text-white font-accent font-bold text-lg">D</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-accent font-semibold text-white tracking-wide leading-none">
                    DsineTiles
                  </h3>
                  <span className="text-xs font-body text-stone-400 tracking-widest uppercase">
                    Precast Excellence
                  </span>
                </div>
              </div>
              <p className="text-stone-400 font-body text-sm leading-relaxed">
                Leading manufacturer of premium precast concrete solutions for modern infrastructure
              </p>
            </div>
            <div>
              <h4 className="text-base font-display font-semibold text-bronze-400 mb-4 tracking-wide">
                Products
              </h4>
              <ul className="space-y-2 text-stone-400 font-body text-sm">
                {products.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="hover:text-bronze-400 transition-colors"
                    >
                      {product.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-base font-display font-semibold text-bronze-400 mb-4 tracking-wide">
                Connect
              </h4>
              <ul className="space-y-3 text-stone-400 font-body text-sm">
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-bronze-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@dsinetiles.com</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-bronze-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-bronze-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Industrial District, City</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-700">
            <div className="ornamental-line mx-auto mb-6 opacity-50" />
            <p className="text-stone-500 font-body text-sm text-center">
              © 2026 DsineTiles. All rights reserved. Building the future with precision and elegance.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
