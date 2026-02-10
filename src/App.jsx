import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Products from './components/Products'
import Features from './components/Features'
import Contact from './components/Contact'
import Navigation from './components/Navigation'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative bg-slate-950">
      {/* Animated background grid */}
      <div className="fixed inset-0 blueprint-line opacity-20 pointer-events-none" />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navigation scrolled={scrolled} />
        <Hero />
        <Products />
        <Features />
        <Contact />
      </div>

      {/* Footer */}
      <footer className="relative border-t border-electric-500/20 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold text-gradient mb-4">
                DsineTiles
              </h3>
              <p className="text-concrete-400 font-technical">
                Leading manufacturer of premium precast concrete solutions
              </p>
            </div>
            <div>
              <h4 className="text-lg font-technical font-semibold text-electric-400 mb-4">
                Products
              </h4>
              <ul className="space-y-2 text-concrete-400 font-technical">
                <li>Precast Pavers</li>
                <li>U Drains</li>
                <li>Box Culverts</li>
                <li>Retaining Walls</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-technical font-semibold text-electric-400 mb-4">
                Connect
              </h4>
              <ul className="space-y-2 text-concrete-400 font-technical">
                <li>Email: info@dsinetiles.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Follow us on social media</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-electric-500/10 text-center">
            <p className="text-concrete-500 font-technical text-sm">
              © 2026 DsineTiles. All rights reserved. Building the future with precision.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
