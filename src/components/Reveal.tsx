import { useEffect, useRef, useState, type ReactNode } from 'react'

// Fades and rises content the first time it scrolls into view.
// A plain div wrapper, so it slots into existing gradients and grids.
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /** ms before the animation starts, for a light stagger */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Reduced motion: our global CSS already zeroes transitions, but we also skip
    // observing entirely so nothing lingers at opacity 0 waiting for an observer
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
