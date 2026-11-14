import { motion } from 'framer-motion'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { digits, fade } from '../lib.jsx'
import { Heading } from './Sections.jsx'
import Booking, { PaymentReturn } from './Booking.jsx'

export default function Contact({ settings, services, booking, offline }) {
  const cta = settings.cta || {}
  const info = [
    settings.phone && { icon: Phone, label: 'Call us', value: settings.phone, href: `tel:${digits(settings.phone)}` },
    settings.email && { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPin, label: 'Visit', value: settings.address, href: settings.map_link },
  ].filter(Boolean)

  return (
    <section id="appointment" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-gold/[.03] blur-[130px]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Heading eyebrow="Book online" title={cta.title || 'Book your visit'} text={cta.text} />

        <div className="grid gap-8 lg:grid-cols-5">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="card relative p-6 md:p-10 lg:col-span-3">
            <Booking services={services} booking={booking} settings={settings} offline={offline} />
          </motion.div>

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
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10 overflow-hidden rounded-[1.75rem]">
            <iframe title="Map" src={settings.map_embed_url} loading="lazy" className="h-80 w-full border-0 grayscale-[.3]" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        )}
      </div>
      <PaymentReturn symbol={booking?.symbol} />
    </section>
  )
}
