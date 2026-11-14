import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { ArrowUpRight, Check, Quote, Star } from 'lucide-react'
import { Icon, fade } from '../lib.jsx'

export function Heading({ eyebrow, title, text, center = true }) {
  return (
    <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className={`mb-14 md:mb-20 ${center ? 'text-center' : ''}`}>
      {eyebrow && <p className="section-eyebrow mb-5">{eyebrow}</p>}
      <h2 className="font-display text-4xl font-medium leading-tight text-cream md:text-6xl">{title}</h2>
      {text && <p className={`mt-5 max-w-xl text-mute md:text-lg ${center ? 'mx-auto' : ''}`}>{text}</p>}
    </motion.div>
  )
}

/* ---------------- Services ---------------- */
export function Services({ items }) {
  if (!items.length) return null
  return (
    <section id="services" className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Heading eyebrow="What we do" title={<>Signature <span className="gold-text italic">services</span></>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <motion.article key={s.id} variants={fade} custom={i % 3} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -8 }} className="group card relative overflow-hidden p-7 transition-colors duration-500 hover:border-gold/50">
              {s.image && (
                <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-25" />
              )}
              <div className="relative flex items-start justify-between">
                <div className="hex-frame h-16 w-[3.6rem] text-gold transition-colors"><Icon name={s.icon} size={24} strokeWidth={1.4} /></div>
                <ArrowUpRight className="text-mute transition-all duration-500 group-hover:rotate-12 group-hover:text-gold" />
              </div>
              <h3 className="relative mt-7 font-display text-3xl text-cream">{s.title}</h3>
              <p className="relative mt-3 text-mute">{s.description}</p>
              {s.price && <p className="relative mt-6 border-t border-line pt-4 text-sm uppercase tracking-[.18em] text-gold">{s.price}</p>}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- About + stats ---------------- */
function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const target = parseFloat(String(value).replace(/,/g, '')) || 0
  const decimals = String(value).includes('.') ? 1 : 0
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => (decimals ? v.toFixed(1) : Math.round(v).toLocaleString()))
  useEffect(() => { if (inView) animate(mv, target, { duration: 2.2, ease: 'easeOut' }) }, [inView, target, mv])
  return <span ref={ref}><motion.span>{text}</motion.span>{suffix}</span>
}

export function About({ about, stats }) {
  if (!about?.title && !about?.text) return null
  return (
    <section id="about" className="relative overflow-hidden bg-coal py-24 md:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="relative">
          <div className="absolute -inset-3 rounded-[2rem] border border-gold/25" />
          <div className="relative overflow-hidden rounded-[1.6rem]">
            {about.image && <motion.img src={about.image} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 1.2 }} />}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}
            className="hex absolute -bottom-8 -right-4 hidden h-36 w-32 place-items-center bg-gold text-center text-ink sm:grid md:-right-10">
            <div><div className="font-display text-4xl font-semibold leading-none">{stats?.[0]?.value}{stats?.[0]?.suffix}</div><div className="mt-1 text-[.65rem] uppercase tracking-widest">{stats?.[0]?.label}</div></div>
          </motion.div>
        </motion.div>

        <div>
          <Heading center={false} eyebrow={about.eyebrow} title={about.title} />
          <motion.p variants={fade} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }} className="-mt-8 text-lg leading-relaxed text-mute md:-mt-12">{about.text}</motion.p>
          <ul className="mt-8 space-y-4">
            {about.points?.map((p, k) => (
              <motion.li key={k} variants={fade} custom={k + 2} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 text-cream/90">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold"><Check size={15} /></span>{p}
              </motion.li>
            ))}
          </ul>
          {stats?.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-10 sm:grid-cols-4">
              {stats.map((s, k) => (
                <div key={k}>
                  <div className="font-display text-4xl text-gold md:text-5xl"><Counter value={s.value} suffix={s.suffix} /></div>
                  <div className="mt-1 text-xs uppercase tracking-[.18em] text-mute">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Process ---------------- */
export function Process({ steps }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (steps.length < 2) return
    const t = setInterval(() => setActive((v) => (v + 1) % steps.length), 3500)
    return () => clearInterval(t)
  }, [steps.length])
  if (!steps.length) return null
  return (
    <section id="process" className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Heading eyebrow="Your visit" title={<>How it <span className="gold-text italic">works</span></>} />
        <div className="relative">
          <div className="absolute bottom-8 left-[2.1rem] top-8 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <div className="space-y-6">
            {steps.map((s, i) => {
              const on = i === active
              return (
                <motion.div key={s.id} variants={fade} custom={0} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                  onMouseEnter={() => setActive(i)} className="relative flex items-center gap-5 md:gap-8">
                  <div className={`hex-frame z-10 h-[4.7rem] w-[4.2rem] shrink-0 transition-all duration-500 ${on ? 'scale-110 text-gold' : 'text-gold/70'}`}
                    style={on ? { filter: 'drop-shadow(0 0 14px rgba(242,166,74,.55))' } : undefined}>
                    <Icon name={s.icon} size={24} strokeWidth={1.4} />
                  </div>
                  <div className={`flex-1 rounded-2xl border p-6 transition-all duration-500 md:p-7 ${on ? 'border-transparent bg-gold text-ink shadow-[0_20px_50px_-20px_rgba(242,166,74,.6)]' : 'card'}`}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className={`font-display text-2xl md:text-3xl ${on ? 'text-ink' : 'text-cream'}`}>{s.title}</h3>
                      <span className={`font-display text-lg ${on ? 'text-ink/60' : 'text-gold/60'}`}>0{i + 1}</span>
                    </div>
                    <p className={`mt-2 ${on ? 'text-ink/80' : 'text-mute'}`}>{s.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Testimonials ---------------- */
export function Testimonials({ items }) {
  if (!items.length) return null
  return (
    <section className="bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Heading eyebrow="Kind words" title={<>Loved by our <span className="gold-text italic">clients</span></>} />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure key={t.id} variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -6 }} className="card p-8">
              <Quote className="text-gold/60" />
              <blockquote className="mt-5 text-lg leading-relaxed text-cream/90">{t.quote}</blockquote>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                <figcaption><div className="text-cream">{t.name}</div><div className="text-sm text-mute">{t.title}</div></figcaption>
                <div className="flex gap-0.5 text-gold">{Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}</div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Team ---------------- */
export function Team({ items }) {
  if (!items.length) return null
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Heading eyebrow="The artists" title={<>Meet the <span className="gold-text italic">team</span></>} />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m, i) => (
            <motion.div key={m.id} variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} className="group text-center">
              <div className="relative mx-auto aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-panel">
                {m.photo && <img src={m.photo} alt={m.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent" />
              </div>
              <h3 className="mt-5 font-display text-3xl text-cream">{m.name}</h3>
              <p className="text-sm uppercase tracking-[.2em] text-gold">{m.role}</p>
              {m.bio && <p className="mx-auto mt-3 max-w-xs text-mute">{m.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
