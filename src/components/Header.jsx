import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  ['Home', '#home'], ['Services', '#services'], ['About', '#about'],
  ['Process', '#process'], ['Gallery', '#gallery'], ['Contact', '#appointment'],
]

export default function Header({ settings }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach(([, h]) => { const el = document.querySelector(h); el && io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink/80 backdrop-blur-xl border-b border-line py-3' : 'py-5'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#home" aria-label={settings.site_name}>
          {settings.logo
            ? <img src={settings.logo} alt={settings.site_name} className="h-9 md:h-11 w-auto" />
            : <span className="font-display text-2xl text-cream">{settings.site_name}</span>}
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className={`relative text-[.78rem] uppercase tracking-[.2em] transition-colors hover:text-gold ${active === h ? 'text-gold' : 'text-cream/80'}`}>
              {l}
              {active === h && <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#appointment" className="btn-gold hidden !py-2.5 !px-5 sm:inline-flex">Book now</a>
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-cream lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-2xl lg:hidden">
            <button onClick={() => setOpen(false)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-line text-cream" aria-label="Close menu"><X size={20} /></button>
            <div className="flex h-full flex-col items-center justify-center gap-7">
              {links.map(([l, h], i) => (
                <motion.a key={h} href={h} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
                  className="font-display text-4xl text-cream hover:text-gold">{l}</motion.a>
              ))}
              <a href="#appointment" onClick={() => setOpen(false)} className="btn-gold mt-4">Book now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
