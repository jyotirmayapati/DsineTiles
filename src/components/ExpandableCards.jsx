import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function ExpandableCards() {
  const cardsRef = useRef([])
  const containerRef = useRef(null)
  const [activeCard, setActiveCard] = useState(null)

  const cards = [
    {
      id: 1,
      title: 'Sustainable Materials',
      description: 'We use eco-friendly concrete alternatives that reduce carbon footprint while maintaining superior quality and durability for all infrastructure projects.',
      image: '/images/products/precast-pavers.jpg'
    },
    {
      id: 2,
      title: 'Precision Engineering',
      description: 'Our advanced manufacturing processes ensure every precast element meets exact specifications with consistent quality and perfect dimensional accuracy.',
      image: '/images/products/u-drains.jpg'
    },
    {
      id: 3,
      title: 'Rapid Installation',
      description: 'Precast components allow for faster project completion, reducing on-site labor costs and minimizing disruption to surrounding areas and traffic.',
      image: '/images/products/box-culverts.jpg'
    }
  ]

  useEffect(() => {
    // Desktop animations
    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return

        const headerGroup = card.querySelector('.header-group')
        const description = card.querySelector('.description')
        const heading = card.querySelector('.heading')
        const number = card.querySelector('.number')

        // Initial setup
        gsap.set(headerGroup, {
          top: '50%',
          left: '50%',
          xPercent: -50,
          yPercent: -50
        })

        gsap.set(description, {
          top: '60%',
          opacity: 0
        })

        gsap.set(heading, {
          width: 0,
          opacity: 0
        })

        // Mouse enter
        card.addEventListener('mouseenter', () => {
          if (activeCard === index) return

          // Animate out previous card
          if (activeCard !== null && cardsRef.current[activeCard]) {
            const prevCard = cardsRef.current[activeCard]
            const prevHeaderGroup = prevCard.querySelector('.header-group')
            const prevDescription = prevCard.querySelector('.description')
            const prevHeading = prevCard.querySelector('.heading')

            gsap.to(prevCard, { flex: 1, duration: 0.5, ease: 'power3.inOut' })
            gsap.to(prevHeaderGroup, {
              top: '50%',
              left: '50%',
              xPercent: -50,
              yPercent: -50,
              duration: 0.5,
              ease: 'power3.inOut'
            })
            gsap.to(prevHeading, {
              width: 0,
              opacity: 0,
              duration: 0.5,
              ease: 'power3.inOut'
            })
            gsap.to(prevDescription, {
              opacity: 0,
              duration: 0.5,
              ease: 'power3.inOut'
            })
          }

          // Animate in current card
          setActiveCard(index)

          gsap.to(card, { flex: 5, duration: 0.6, ease: 'power3.inOut' })
          gsap.to(headerGroup, {
            top: '25%',
            left: '2rem',
            xPercent: 0,
            yPercent: 0,
            duration: 0.6,
            ease: 'power3.inOut'
          })
          gsap.to(heading, {
            width: 'auto',
            opacity: 1,
            duration: 0.6,
            ease: 'power3.inOut'
          })
          gsap.to(description, {
            opacity: 1,
            duration: 0.6,
            delay: 0.2,
            ease: 'power3.inOut'
          })
        })
      })

      // Mouse leave container
      if (containerRef.current) {
        containerRef.current.addEventListener('mouseleave', () => {
          if (activeCard !== null && cardsRef.current[activeCard]) {
            const card = cardsRef.current[activeCard]
            const headerGroup = card.querySelector('.header-group')
            const description = card.querySelector('.description')
            const heading = card.querySelector('.heading')

            gsap.to(card, { flex: 1, duration: 0.5, ease: 'power3.inOut' })
            gsap.to(headerGroup, {
              top: '50%',
              left: '50%',
              xPercent: -50,
              yPercent: -50,
              duration: 0.5,
              ease: 'power3.inOut'
            })
            gsap.to(heading, {
              width: 0,
              opacity: 0,
              duration: 0.5,
              ease: 'power3.inOut'
            })
            gsap.to(description, {
              opacity: 0,
              duration: 0.5,
              ease: 'power3.inOut'
            })
            setActiveCard(null)
          }
        })
      }

      return () => {
        cardsRef.current.forEach(card => {
          if (card) {
            card.removeEventListener('mouseenter', () => {})
          }
        })
      }
    })

    // Mobile click interactions
    mm.add("(max-width: 767px)", () => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return

        const handleClick = () => {
          const headerGroup = card.querySelector('.header-group')
          const description = card.querySelector('.description')
          const heading = card.querySelector('.heading')

          if (activeCard === index) {
            // Toggle off
            gsap.to(card, { flex: 1, duration: 0.5, ease: 'power3.inOut' })
            gsap.to(headerGroup, {
              top: '50%',
              left: '50%',
              xPercent: -50,
              yPercent: -50,
              duration: 0.5
            })
            gsap.to(heading, { width: 0, opacity: 0, duration: 0.5 })
            gsap.to(description, { opacity: 0, duration: 0.5 })
            setActiveCard(null)
          } else {
            // Toggle on
            if (activeCard !== null && cardsRef.current[activeCard]) {
              const prevCard = cardsRef.current[activeCard]
              const prevHeaderGroup = prevCard.querySelector('.header-group')
              const prevDescription = prevCard.querySelector('.description')
              const prevHeading = prevCard.querySelector('.heading')

              gsap.to(prevCard, { flex: 1, duration: 0.5 })
              gsap.to(prevHeaderGroup, {
                top: '50%',
                left: '50%',
                xPercent: -50,
                yPercent: -50,
                duration: 0.5
              })
              gsap.to(prevHeading, { width: 0, opacity: 0, duration: 0.5 })
              gsap.to(prevDescription, { opacity: 0, duration: 0.5 })
            }

            setActiveCard(index)
            gsap.to(card, { flex: 3, duration: 0.6 })
            gsap.to(headerGroup, {
              top: '25%',
              left: '2rem',
              xPercent: 0,
              yPercent: 0,
              duration: 0.6
            })
            gsap.to(heading, { width: 'auto', opacity: 1, duration: 0.6 })
            gsap.to(description, { opacity: 1, delay: 0.2, duration: 0.6 })
          }
        }

        card.addEventListener('click', handleClick)
      })
    })

  }, [activeCard])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="ornamental-line mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
            Why Choose <span className="italic">DsineTiles</span>
          </h2>
          <p className="text-lg font-body text-neutral-600 max-w-2xl mx-auto">
            Innovative solutions that transform infrastructure development
          </p>
        </div>

        <div
          ref={containerRef}
          className="flex flex-col md:flex-row w-full h-[600px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl gap-3"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={el => cardsRef.current[index] = el}
              className="flex-1 relative bg-cover bg-center cursor-pointer overflow-hidden group"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/70" />

              {/* Header Group: Number + Title */}
              <div className="header-group absolute flex items-center z-20">
                <span className="number text-7xl md:text-8xl font-display font-black text-white/90 leading-none">
                  {card.id}
                </span>
                <h3 className="heading text-2xl md:text-3xl font-display font-bold uppercase text-white ml-4 whitespace-nowrap overflow-hidden">
                  {card.title}
                </h3>
              </div>

              {/* Description */}
              <p className="description font-body absolute top-[60%] left-0 right-0 text-lg md:text-xl text-white/95 px-8 z-10 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
