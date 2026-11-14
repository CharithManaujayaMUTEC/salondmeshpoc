import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from 'lucide-react'
import { Heading } from './Sections.jsx'

export default function Gallery({ items }) {
  const [cat, setCat] = useState('All')
  const [lb, setLb] = useState(null)
  const cats = useMemo(() => ['All', ...new Set(items.map((i) => i.category).filter(Boolean))], [items])
  const shown = useMemo(() => items.filter((i) => cat === 'All' || i.category === cat), [items, cat])

  const step = useCallback((d) => setLb((v) => (v === null ? v : (v + d + shown.length) % shown.length)), [shown.length])
  useEffect(() => {
    if (lb === null) return
    const k = (e) => { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [lb, step])

  if (!items.length) return null
  const cur = lb !== null ? shown[lb] : null

  return (
    <section id="gallery" className="relative bg-coal py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Heading eyebrow="Inside the salon" title={<>Our <span className="gold-text italic">gallery</span></>} />
        {cats.length > 2 && (
          <div className="-mt-6 mb-12 flex flex-wrap justify-center gap-2.5">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[.2em] transition-all ${cat === c ? 'border-gold bg-gold text-ink' : 'border-line text-cream/70 hover:border-gold/60 hover:text-gold'}`}>{c}</button>
            ))}
          </div>
        )}
        <LayoutGroup>
          <motion.div layout className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <AnimatePresence>
              {shown.map((g, i) => (
                <motion.button layout key={g.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}
                  onClick={() => setLb(i)}
                  className={`group relative overflow-hidden rounded-2xl bg-panel text-left ${g.featured ? 'col-span-2 row-span-2' : ''}`}>
                  <img src={g.image} alt={g.title || ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="text-[.65rem] uppercase tracking-[.25em] text-gold">{g.category}</div>
                    <div className="font-display text-xl text-cream">{g.title}</div>
                  </div>
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/60 text-gold backdrop-blur">
                    {g.type === 'video' ? <Play size={14} fill="currentColor" /> : <ZoomIn size={15} />}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <AnimatePresence>
        {cur && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-ink/95 p-4 backdrop-blur-xl" onClick={() => setLb(null)}>
            <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-line text-cream hover:text-gold" onClick={() => setLb(null)} aria-label="Close"><X /></button>
            <button className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line text-cream hover:text-gold md:left-8" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous"><ChevronLeft /></button>
            <button className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line text-cream hover:text-gold md:right-8" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next"><ChevronRight /></button>
            <motion.div key={cur.id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {cur.type === 'video' && cur.video
                ? <video src={cur.video} poster={cur.image} controls autoPlay className="max-h-[82vh] rounded-2xl" />
                : <img src={cur.image} alt={cur.title || ''} className="max-h-[82vh] rounded-2xl object-contain" />}
              <div className="mt-4 text-center font-display text-2xl text-cream">{cur.title}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
