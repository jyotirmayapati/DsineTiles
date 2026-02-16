import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Tagline */}
          <div className="mb-8">
            <span className="inline-block px-6 py-3 bg-stone-50 border border-stone-200 rounded-sm text-neutral-600 font-body elegant-caps animate-fade-in">
              Precision Engineering • Future Ready
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 text-neutral-900 refined-heading text-depth">
            <span className="block mb-2 elegant-text animate-fade-up stagger-1">Building Tomorrow's</span>
            <span className="block elegant-italic animate-fade-up stagger-2">Infrastructure</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-neutral-600 font-body max-w-4xl mx-auto mb-12 elegant-subtitle animate-fade-up stagger-3">
            Advanced precast concrete solutions engineered for durability, precision, and sustainable construction
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="#products"
              className="group px-10 py-4 bg-black text-white font-body font-semibold text-lg rounded-sm hover:bg-neutral-900 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-md animate-scale-in stagger-4"
            >
              <span>Explore Products</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>

            <a
              href="#contact"
              className="group px-10 py-4 bg-white border-2 border-black text-neutral-800 font-body font-semibold text-lg rounded-sm hover:bg-stone-50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 animate-scale-in stagger-5"
            >
              <span>Request Consultation</span>
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {[
              { value: '25+', label: 'Years Experience' },
              { value: '10K+', label: 'Projects Completed' },
              { value: '500+', label: 'Happy Clients' },
              { value: '99%', label: 'Quality Assured' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-stone-50 border border-stone-200 rounded-sm p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl font-display font-bold text-neutral-900 mb-2 refined-number text-lifted">
                  {stat.value}
                </div>
                <div className="text-neutral-600 font-body elegant-caps">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
