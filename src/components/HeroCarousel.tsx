import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const navGroupsRef = useRef<(HTMLDivElement | null)[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const slides = [
    {
      image: '/images/products/precast-pavers.jpg',
      title: 'Premium Precast Solutions',
      keywords: ['Quality', 'Innovation', 'Durability']
    },
    {
      image: '/images/products/u-drains.jpg',
      title: 'Engineered Excellence',
      keywords: ['Precision', 'Sustainable', 'Efficient']
    }
  ]

  const animateSlides = (oldIndex: number, newIndex: number) => {
    // Fade slides
    if (slidesRef.current[oldIndex]) {
      gsap.to(slidesRef.current[oldIndex], {
        opacity: 0,
        duration: 1,
        ease: 'power1.inOut'
      })
    }

    if (slidesRef.current[newIndex]) {
      gsap.to(slidesRef.current[newIndex], {
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut'
      })
    }

    // Animate nav groups
    if (navGroupsRef.current[oldIndex] && navGroupsRef.current[newIndex]) {
      const oldGroup = navGroupsRef.current[oldIndex]
      const newGroup = navGroupsRef.current[newIndex]
      const oldItems = Array.from(oldGroup.children)
      const newItems = Array.from(newGroup.children)

      gsap.set(newGroup, { opacity: 1 })

      // Animate out old items
      oldItems.forEach((item, i) => {
        gsap.to(item, {
          opacity: 0,
          y: Math.random() > 0.5 ? 100 : -100,
          duration: 0.5,
          delay: i * 0.05,
          ease: 'power2.in',
          onComplete: () => {
            if (i === oldItems.length - 1) {
              gsap.set(oldGroup, { opacity: 0 })
            }
          }
        })
      })

      // Animate in new items
      newItems.forEach((item, i) => {
        gsap.fromTo(item,
          {
            opacity: 0,
            y: Math.random() > 0.5 ? 100 : -100
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.2 + (i * 0.05),
            ease: 'power2.out'
          }
        )
      })
    }
  }

  const showNextSlide = () => {
    const oldSlide = currentSlide
    const newSlide = (currentSlide + 1) % slides.length
    setCurrentSlide(newSlide)
    animateSlides(oldSlide, newSlide)
  }

  useEffect(() => {
    // Initial setup
    slidesRef.current.forEach((slide, index) => {
      if (slide) {
        gsap.set(slide, { opacity: index === 0 ? 1 : 0 })
      }
    })

    navGroupsRef.current.forEach((group, index) => {
      if (group) {
        const items = Array.from(group.children)
        if (index === 0) {
          gsap.set(group, { opacity: 1 })
          items.forEach(item => gsap.set(item, { opacity: 1, y: 0 }))
        } else {
          gsap.set(group, { opacity: 0 })
          items.forEach(item => gsap.set(item, { opacity: 0, y: 100 }))
        }
      }
    })

    // Auto-play
    intervalRef.current = setInterval(showNextSlide, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentSlide])

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={el => { slidesRef.current[index] = el }}
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative w-full h-full flex items-center justify-start z-20 px-6 sm:px-12 lg:px-24">
            <div className="text-left max-w-4xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Keywords */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 overflow-hidden bg-white/30 backdrop-blur-md rounded-xl shadow-2xl px-8 py-4 min-w-75 md:min-w-125">
        <div className="relative w-full h-12">
          {slides.map((slide, index) => (
            <div
              key={index}
              ref={el => { navGroupsRef.current[index] = el }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-around gap-4"
            >
              {slide.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="flex-1 text-center font-body font-bold text-neutral-900 text-sm md:text-base"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-0 w-full z-30 flex justify-center items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentSlide) {
                animateSlides(currentSlide, index)
                setCurrentSlide(index)
                if (intervalRef.current) clearInterval(intervalRef.current)
                intervalRef.current = setInterval(showNextSlide, 4000)
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
