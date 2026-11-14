import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone } from 'lucide-react'
import { API, digits, fade } from '../lib.jsx'
import { Heading } from './Sections.jsx'

const empty = { name: '', phone: '', email: '', service: '', preferred_date: '', message: '' }

export default function Contact({ settings, services }) {
  const [f, setF] = useState(empty)
  const [state, setState] = useState('idle') // idle|sending|done|error
  const [errs, setErrs] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setState('sending'); setErrs({})
    try {
      const r = await fetch(`${API}/api/inquiries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f),
      })
      if (r.status === 422) { setErrs((await r.json()).errors || {}); setState('idle'); return }
      if (!r.ok) throw new Error()
      setState('done'); setF(empty)
    } catch { setState('error') }
  }

  const cta = settings.cta || {}
  const err = (k) => errs[k] && <p className="mt-1 text-sm text-red-400">{errs[k][0]}</p>
  const info = [
    settings.phone && { icon: Phone, label: 'Call us', value: settings.phone, href: `tel:${digits(settings.phone)}` },
    settings.email && { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPin, label: 'Visit', value: settings.address, href: settings.map_link },
  ].filter(Boolean)

  return (
    <section id="appointment" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-[130px]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Heading eyebrow="Appointments" title={cta.title || 'Book your visit'} text={cta.text} />

        <div className="grid gap-8 lg:grid-cols-5">
          <motion.form variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} onSubmit={submit} className="card relative p-6 md:p-10 lg:col-span-3">
            <AnimatePresence mode="wait">
              {state === 'done' ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="grid min-h-[26rem] place-items-center text-center">
                  <div>
                    <CheckCircle2 className="mx-auto text-gold" size={64} strokeWidth={1.2} />
                    <h3 className="mt-6 font-display text-4xl text-cream">Request received</h3>
                    <p className="mt-3 text-mute">Thank you! Our team will contact you shortly to confirm.</p>
                    <button type="button" onClick={() => setState('idle')} className="btn-ghost mt-8">Send another</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" className="grid gap-5 sm:grid-cols-2">
                  <div><input className="field" placeholder="Your name *" value={f.name} onChange={set('name')} required />{err('name')}</div>
                  <div><input className="field" placeholder="Phone number *" value={f.phone} onChange={set('phone')} required type="tel" />{err('phone')}</div>
                  <div><input className="field" placeholder="Email (optional)" value={f.email} onChange={set('email')} type="email" />{err('email')}</div>
                  <div><input className="field" type="date" value={f.preferred_date} onChange={set('preferred_date')} min={new Date().toISOString().slice(0, 10)} style={{ colorScheme: 'dark' }} />{err('preferred_date')}</div>
                  <div className="sm:col-span-2">
                    <select className="field" value={f.service} onChange={set('service')}>
                      <option value="">Select a service</option>
                      {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2"><textarea className="field" rows={4} placeholder="Anything we should know?" value={f.message} onChange={set('message')} /></div>
                  {state === 'error' && <p className="text-red-400 sm:col-span-2">Something went wrong. Please try again or call us.</p>}
                  <div className="sm:col-span-2">
                    <button className="btn-gold w-full justify-center sm:w-auto" disabled={state === 'sending'}>
                      {state === 'sending' ? <><Loader2 className="animate-spin" size={18} /> Sending</> : (cta.button || 'Book appointment')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          <div className="space-y-5 lg:col-span-2">
            {info.map(({ icon: I, label, value, href }, i) => (
              <motion.a key={label} href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ x: 6 }}
                className="card group flex items-center gap-5 p-5">
                <div className="hex-frame h-14 w-[3.1rem] shrink-0 text-gold"><I size={20} strokeWidth={1.5} /></div>
                <div><div className="text-xs uppercase tracking-[.22em] text-gold">{label}</div><div className="whitespace-pre-line text-cream">{value}</div></div>
              </motion.a>
            ))}
            {settings.opening_hours?.length > 0 && (
              <motion.div variants={fade} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }} className="card p-6">
                <div className="mb-4 flex items-center gap-3 text-gold"><Clock size={18} /><span className="text-xs uppercase tracking-[.22em]">Opening hours</span></div>
                <ul className="divide-y divide-line">
                  {settings.opening_hours.map((h, k) => (
                    <li key={k} className="flex justify-between gap-4 py-2.5 text-sm"><span className="text-mute">{h.day}</span><span className="text-cream">{h.hours}</span></li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {settings.map_embed_url && (
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10 overflow-hidden rounded-[1.5rem] border border-line">
            <iframe title="Map" src={settings.map_embed_url} loading="lazy" className="h-80 w-full border-0 grayscale invert-[.92] contrast-[.9] hue-rotate-180" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        )}
      </div>
    </section>
  )
}
