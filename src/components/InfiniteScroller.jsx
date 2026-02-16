import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function InfiniteScroller() {
  const scrollerRef = useRef(null)

  const logos = [
    { name: 'Company 1', logo: '🏢' },
    { name: 'Company 2', logo: '🏗️' },
    { name: 'Company 3', logo: '🏭' },
    { name: 'Company 4', logo: '🏛️' },
    { name: 'Company 5', logo: '🏢' },
    { name: 'Company 6', logo: '🏗️' },
  ]

  useEffect(() => {
    if (!scrollerRef.current) return

    const scroller = scrollerRef.current
    const items = Array.from(scroller.children)

    // Clone items for infinite scroll
    items.forEach(item => {
      const clone = item.cloneNode(true)
      scroller.appendChild(clone)
    })

    // Calculate total width
    const scrollerWidth = items.reduce((acc, item) => {
      const styles = window.getComputedStyle(item)
      const marginRight = parseFloat(styles.marginRight) || 0
      return acc + item.offsetWidth + marginRight
    }, 0)

    // Animate
    gsap.to(scroller, {
      x: -scrollerWidth,
      duration: 25,
      ease: 'none',
      repeat: -1,
    })

  }, [])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="ornamental-line mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Trusted by <span className="italic">Industry Leaders</span>
          </h2>
          <p className="text-lg font-body text-neutral-600">
            Building partnerships that last generations
          </p>
        </div>

        <div className="relative overflow-hidden h-24">
          <div
            ref={scrollerRef}
            className="flex items-center h-full gap-16"
            style={{ width: 'max-content' }}
          >
            {logos.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center h-20 w-32 bg-stone-50 border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-4xl mb-1">{item.logo}</span>
                <span className="text-xs font-body font-semibold text-neutral-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
