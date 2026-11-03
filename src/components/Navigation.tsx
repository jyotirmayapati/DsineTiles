import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme'

const LINKS = [
  { name: 'Products', path: '/products', hash: '' },
  { name: 'Railways', path: '/railways', hash: '' },
  { name: 'How we work', path: '/', hash: '#process' },
  { name: 'Carbon calculator', path: '/', hash: '#impact' },
  { name: 'Contact', path: '/', hash: '#contact' },
]

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`w-10 h-10 grid place-items-center rounded-[3px] border border-formline text-graphite hover:border-graphite transition-colors ${className}`}
    >
      {dark ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  )
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (path: string, hash = '') => {
    setOpen(false)
    if (!hash) return navigate(path)
    if (location.pathname === '/') return document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    navigate('/')
    setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 120)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 border-b ${
        scrolled || open
          ? 'bg-concrete/90 backdrop-blur-md border-formline shadow-[0_16px_36px_-24px_rgba(29,31,33,0.45)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-[88rem] px-5 sm:px-8 h-16 flex items-center justify-between gap-6" aria-label="Main">
        <button onClick={() => go('/')} className="group flex items-center gap-3" aria-label="Hiperstructures home">
          {/* Mark: pressed-concrete block with a sharp top-left highlight, like the marking yellow wipes around the yard */}
          <span className="relative w-8 h-8 grid place-items-center rounded-[3px] bg-graphite text-concrete type-wide text-lg leading-none transition-transform duration-300 group-hover:-translate-y-px" aria-hidden="true">
            H
            <span className="absolute -top-1 left-1.5 right-1.5 h-0.5 bg-marking opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </span>
          <span className="type-wide text-lg transition-colors group-hover:text-graphite">Hiperstructures</span>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => {
            const active = !l.hash && l.path !== '/' && location.pathname.startsWith(l.path)
            return (
              <button
                key={l.name}
                onClick={() => go(l.path, l.hash)}
                // h-16 row + a marking-yellow bar on the header's bottom edge for the active page
                className={`relative h-16 grid place-items-center text-[0.95rem] transition-colors hover:text-graphite ${
                  active ? 'text-graphite font-semibold' : 'text-aggregate'
                } after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-marking after:transition-transform after:duration-300 after:origin-left ${active ? 'after:scale-x-100' : 'after:scale-x-0'}`}
                aria-current={active ? 'page' : undefined}
              >
                {l.name}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => go('/', '#contact')} className="btn-mark hidden sm:inline-flex !py-2 !px-4 text-[0.95rem]">
            Get a quote
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-[3px] border border-formline"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-5 pb-5 flex flex-col">
          {LINKS.map((l) => (
            <button key={l.name} onClick={() => go(l.path, l.hash)} className="text-left py-3 border-b border-formline text-lg">
              {l.name}
            </button>
          ))}
          <button onClick={() => go('/', '#contact')} className="btn-mark mt-4">
            Get a quote
          </button>
        </div>
      </div>
    </header>
  )
}
