import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, MessageCircle } from 'lucide-react'
import { digits, socialMap } from '../lib.jsx'

export function Footer({ settings }) {
  return (
    <footer className="theme-dark bg-ink pb-8 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3 md:px-8">
        <div>
          {settings.logo ? <img src={settings.logo} alt={settings.site_name} className="h-12 w-auto" /> : <span className="font-display text-3xl text-cream">{settings.site_name}</span>}
          <p className="mt-4 max-w-xs text-mute">{settings.tagline}</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-mute">Explore</h4>
          <ul className="space-y-2 text-cream/80">
            {[['Services', '#services'], ['About', '#about'], ['Gallery', '#gallery'], ['Book now', '#appointment']].map(([l, h]) => (
              <li key={h}><a href={h} className="transition hover:text-gold">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-mute">Follow us</h4>
          <div className="flex gap-3">
            {settings.socials?.map((s, i) => {
              const I = socialMap[s.platform] || MessageCircle
              return (
                <motion.a key={i} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform} whileHover={{ y: -4 }} className="group">
                  <span className="hex-frame h-12 w-[2.7rem] text-gold"><I size={17} strokeWidth={1.6} /></span>
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-line px-5 pt-6 text-center text-sm text-mute md:px-8">
        © {new Date().getFullYear()} {settings.footer_text || settings.site_name}
      </div>
    </footer>
  )
}

export function Floating({ settings }) {
  const [top, setTop] = useState(false)
  useEffect(() => {
    const f = () => setTop(window.scrollY > 700)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const wa = settings.whatsapp && `https://wa.me/${digits(settings.whatsapp).replace('+', '')}`
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {top && (
          <motion.button initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
            className="hex grid h-12 w-[2.8rem] place-items-center bg-gold text-ink"><ChevronUp /></motion.button>
        )}
      </AnimatePresence>
      {wa && (
        <a href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/40 transition hover:scale-110">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40" />
          <MessageCircle className="relative" />
        </a>
      )}
    </div>
  )
}
