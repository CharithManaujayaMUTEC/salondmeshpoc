import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { API } from './lib.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Gallery from './components/Gallery.jsx'
import Contact from './components/Contact.jsx'
import { About, Process, Services, Team, Testimonials } from './components/Sections.jsx'
import { Floating, Footer } from './components/Footer.jsx'

export default function App() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/site`, { headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => setFailed(true))
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

  if (failed) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl text-cream">We'll be right back</h1>
          <p className="mt-3 text-mute">The site could not load right now. Please refresh in a moment.</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center">
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 1.8 }}
          className="hex h-20 w-[4.5rem] bg-gold/80" />
      </div>
    )
  }

  const { settings, hero, services, process, gallery, team, testimonials } = data
  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero slides={hero} settings={settings} />
        <Services items={services} />
        <About about={settings.about} stats={settings.stats} />
        <Process steps={process} />
        <Gallery items={gallery} />
        <Team items={team} />
        <Testimonials items={testimonials} />
        <Contact settings={settings} services={services} />
      </main>
      <Footer settings={settings} />
      <Floating settings={settings} />
    </>
  )
}
