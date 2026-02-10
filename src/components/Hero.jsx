import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-electric-500/20 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Tagline */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-electric-500/10 border border-electric-500/30 rounded-full text-electric-400 font-technical text-sm tracking-widest uppercase">
              Precision Engineering • Future Ready
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
            <span className="block text-white mb-2">Building Tomorrow's</span>
            <span className="block text-gradient glow-text">Infrastructure</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-concrete-300 font-technical font-light max-w-4xl mx-auto mb-12 leading-relaxed">
            Advanced precast concrete solutions engineered for durability, precision, and sustainable construction
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="#products"
              className="group px-8 py-4 bg-gradient-to-r from-electric-500 to-electric-600 text-slate-950 font-technical font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-electric-500/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
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
              className="group px-8 py-4 glass-effect text-electric-400 font-technical font-bold text-lg rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
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
                className="glass-effect rounded-lg p-6 tech-border hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-concrete-400 font-technical text-sm uppercase tracking-wide">
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
          className="w-6 h-6 text-electric-400"
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
