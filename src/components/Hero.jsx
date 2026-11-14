import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

const bokeh = [
  ['8%', '22%', 10, 0], ['18%', '68%', 16, 1.5], ['34%', '14%', 7, 3], ['52%', '78%', 12, 2],
  ['70%', '30%', 9, 4], ['84%', '60%', 18, 0.8], ['92%', '16%', 8, 2.6],
]

export default function Hero({ slides, settings }) {
  const [i, setI] = useState(0)
  const n = slides.length
  const next = useCallback(() => setI((v) => (v + 1) % n), [n])
  const prev = () => setI((v) => (v - 1 + n) % n)

  useEffect(() => {
    if (n < 2) return
    const t = setTimeout(next, 7500)
    return () => clearTimeout(t)
  }, [i, n, next])

  const s = slides[i] || { title: settings.site_name, subtitle: settings.tagline }
  const go = (link) => (e) => {
    if (link?.startsWith('#')) { e.preventDefault(); document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' }) }
  }

  return (
    <section id="home" className="theme-dark relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink">
      <AnimatePresence mode="sync">
        <motion.div key={s.id ?? 'x'} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }}>
          {s.type === 'video' && s.video
            ? <video src={s.video} poster={s.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            : s.image && <img src={s.image} alt="" className="kenburns h-full w-full object-cover" />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
      {bokeh.map(([l, t, size, d], k) => (
        <span key={k} className="bokeh" style={{ left: l, top: t, width: size, height: size, animationDelay: `${d}s` }} />
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-5 text-center md:px-8">
        <AnimatePresence mode="wait">
          <motion.div key={s.id ?? 'x'} className="mx-auto max-w-4xl" initial="hidden" animate="show" exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
            variants={{ show: { transition: { staggerChildren: 0.14 } } }}>
            {s.eyebrow && (
              <motion.p variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="section-eyebrow mb-6">{s.eyebrow}</motion.p>
            )}
            <motion.h1 variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
              className="font-display text-[2.8rem] leading-[1.03] text-cream sm:text-7xl lg:text-[6.2rem]">
              {s.title}{' '}
              {s.highlight && <span className="gold-text italic">{s.highlight}</span>}
            </motion.h1>
            {s.subtitle && (
              <motion.p variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="mx-auto mt-6 max-w-xl text-lg text-cream/80 md:text-xl">{s.subtitle}</motion.p>
            )}
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {s.button_label && <a href={s.button_link || '#appointment'} onClick={go(s.button_link)} className="btn-gold">{s.button_label}</a>}
              <a href="#appointment" onClick={go('#appointment')} className="btn-ghost">Book appointment</a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <>
          <button onClick={prev} aria-label="Previous slide" className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/40 text-cream backdrop-blur transition hover:border-gold hover:text-gold md:grid"><ChevronLeft /></button>
          <button onClick={next} aria-label="Next slide" className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/40 text-cream backdrop-blur transition hover:border-gold hover:text-gold md:grid"><ChevronRight /></button>
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {slides.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className="group relative h-3 w-10 py-1">
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-cream/25" />
                {k === i && <motion.span key={i} className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-gold" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 7.5, ease: 'linear' }} />}
              </button>
            ))}
          </div>
        </>
      )}

      <a href="#services" className="absolute bottom-8 right-8 z-20 hidden text-gold/80 md:block" aria-label="Scroll down">
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="block"><ChevronDown /></motion.span>
      </a>
    </section>
  )
}
