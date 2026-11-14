import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { API } from './lib.jsx'
import { defaults } from './defaults.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Gallery from './components/Gallery.jsx'
import Contact from './components/Contact.jsx'
import { About, Process, Services, Team, Testimonials } from './components/Sections.jsx'
import { Floating, Footer } from './components/Footer.jsx'

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // If the backend is down or slow, fall back to the built-in default content (incl. videos).
    let cancelled = false
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 6000)
    fetch(`${API}/api/site`, { headers: { Accept: 'application/json' }, signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setData(defaults))
      .finally(() => clearTimeout(timer))
    return () => { cancelled = true; clearTimeout(timer); ctrl.abort() }
  }, [])

  useEffect(() => {
    const s = data?.settings
    if (!s) return
    document.title = s.seo?.title || s.site_name
    const meta = document.querySelector('meta[name=description]') || Object.assign(document.head.appendChild(document.createElement('meta')), { name: 'description' })
    meta.content = s.seo?.description || ''
    if (s.favicon) {
      const l = document.querySelector('link[rel=icon]') || Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' })
      l.href = s.favicon
    }
  }, [data])

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 1.8 }}
          className="hex h-20 w-[4.5rem] bg-gold/80" />
      </div>
    )
  }

  const { settings, hero, services, process, gallery: all, team, testimonials, booking } = data
  const gallery = all.filter((g) => g.group !== 'client')
  const clients = all.filter((g) => g.group === 'client')
  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero slides={hero} settings={settings} />
        <Services items={services} />
        <About about={settings.about} stats={settings.stats} />
        <Process steps={process} />
        <Gallery items={gallery} />
        <Gallery items={clients} id="clients" bg="bg-ink" dark tall eyebrow="Happy customers" title={<>Fresh from <span className="gold-text italic">the chair</span></>} />
        <Team items={team} />
        <Testimonials items={testimonials} />
        <Contact settings={settings} services={services} booking={booking} offline={!!data.offline} />
      </main>
      <Footer settings={settings} />
      <Floating settings={settings} />
    </>
  )
}
