import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Building2, CalendarDays, Check, CheckCircle2, CreditCard, Loader2, Phone, XCircle } from 'lucide-react'
import { API, digits, Icon } from '../lib.jsx'

const todayStr = () => new Date().toLocaleDateString('en-CA')
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toLocaleDateString('en-CA') }
const t12 = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }

const METHODS = {
  cash: { icon: Banknote, title: 'Pay at the salon', text: 'Pay when you visit (cash or card in person).' },
  online: { icon: CreditCard, title: 'Pay online', text: 'Secure card payment via PayHere.' },
  bank: { icon: Building2, title: 'Bank transfer', text: 'Transfer to our account; we confirm once received.' },
}

function depositFor(total, b) {
  if (!b) return total
  const v = b.deposit_type === 'percent' ? (total * b.deposit_value) / 100 : b.deposit_type === 'fixed' ? b.deposit_value : total
  return Math.round(Math.min(total, Math.max(0, v)) * 100) / 100
}

export default function Booking({ services, booking, settings, offline }) {
  const money = (n) => `${booking?.symbol || 'Rs.'} ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  const bookable = useMemo(() => services.filter((s) => s.bookable !== false), [services])
  const [serviceId, setServiceId] = useState(null)
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState(null) // null = not loaded
  const [time, setTime] = useState('')
  const [f, setF] = useState({ name: '', phone: '', email: '', notes: '' })
  const [method, setMethod] = useState('')
  const [state, setState] = useState('idle') // idle|sending|done|error
  const [errs, setErrs] = useState({})
  const [result, setResult] = useState(null)
  const payForm = useRef(null)

  const service = bookable.find((s) => s.id === serviceId)
  const methods = booking?.methods || []
  const total = service?.amount || 0
  const due = method === 'online' ? depositFor(total, booking) : 0

  useEffect(() => { if (!method && methods.length) setMethod(methods[0]) }, [methods, method])

  // "Book this" buttons on service cards
  useEffect(() => {
    const h = (e) => { setServiceId(e.detail); setDate(''); setTime(''); setSlots(null) }
    window.addEventListener('book-service', h)
    return () => window.removeEventListener('book-service', h)
  }, [])

  // availability
  useEffect(() => {
    if (!serviceId || !date) return
    let dead = false
    setSlots(null); setTime('')
    fetch(`${API}/api/availability?date=${date}&service_id=${serviceId}`, { headers: { Accept: 'application/json' } })
      .then((r) => r.json()).then((d) => !dead && setSlots(d.slots || []))
      .catch(() => !dead && setSlots([]))
    return () => { dead = true }
  }, [serviceId, date])

  // auto-submit to PayHere once we have the signed fields
  useEffect(() => { if (result?.payhere && payForm.current) payForm.current.submit() }, [result])

  const closed = booking?.closed_days || []
  const dateClosed = date && closed.includes(new Date(date + 'T00:00').getDay())

  const canSubmit = service && date && time && f.name.trim() && f.phone.trim() && method && state !== 'sending'

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setState('sending'); setErrs({})
    try {
      const r = await fetch(`${API}/api/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ service_id: serviceId, date, time, ...f, payment_method: method }),
      })
      if (r.status === 422) { setErrs((await r.json()).errors || {}); setState('idle'); return }
      if (!r.ok) throw new Error()
      const d = await r.json()
      setResult(d)
      setState(d.payhere ? 'redirecting' : 'done')
    } catch { setState('error') }
  }

  const reset = () => { setResult(null); setState('idle'); setServiceId(null); setDate(''); setTime(''); setSlots(null); setF({ name: '', phone: '', email: '', notes: '' }) }
  const err = (k) => errs[k] && <p className="mt-1 text-sm text-red-400">{errs[k][0]}</p>

  const contactFallback = (
    <div className="grid min-h-[22rem] place-items-center text-center">
      <div>
        <CalendarDays className="mx-auto text-gold" size={48} strokeWidth={1.2} />
        <h3 className="mt-5 font-display text-3xl text-cream">{offline ? 'Online booking is unavailable right now' : 'Online booking is paused'}</h3>
        <p className="mx-auto mt-3 max-w-sm text-mute">Please call or message us and we will book you in.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {settings.phone && <a className="btn-gold" href={`tel:${digits(settings.phone)}`}><Phone size={16} /> {settings.phone}</a>}
          {settings.whatsapp && <a className="btn-ghost" target="_blank" rel="noreferrer" href={`https://wa.me/${digits(settings.whatsapp).replace('+', '')}`}>WhatsApp</a>}
        </div>
      </div>
    </div>
  )

  if (offline || !booking?.enabled || !bookable.length) return contactFallback

  if (state === 'done' && result) {
    const b = result.booking
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid min-h-[26rem] place-items-center text-center">
        <div>
          <CheckCircle2 className="mx-auto text-gold" size={64} strokeWidth={1.2} />
          <h3 className="mt-6 font-display text-4xl text-cream">Booking received</h3>
          <p className="mt-2 text-gold">Reference {b.reference}</p>
          <p className="mx-auto mt-3 max-w-md text-mute">{b.service} · {b.date_label} at {b.time_label}</p>
          {result.bank_details && (
            <div className="mx-auto mt-5 max-w-md rounded-2xl border border-line p-4 text-left text-sm text-cream/90">
              <div className="mb-1 text-xs uppercase tracking-[.2em] text-gold">Bank transfer details</div>
              <pre className="whitespace-pre-wrap font-sans">{result.bank_details}</pre>
              <div className="mt-2 text-mute">Use <b>{b.reference}</b> as the payment reference.</div>
            </div>
          )}
          <p className="mx-auto mt-4 max-w-sm text-sm text-mute">We will confirm your appointment shortly.</p>
          <button type="button" onClick={reset} className="btn-ghost mt-8">Book another</button>
        </div>
      </motion.div>
    )
  }

  if (state === 'redirecting' && result?.payhere) {
    return (
      <div className="grid min-h-[22rem] place-items-center text-center">
        <div>
          <Loader2 className="mx-auto animate-spin text-gold" size={44} />
          <h3 className="mt-5 font-display text-3xl text-cream">Taking you to secure payment…</h3>
          <p className="mt-2 text-mute">Booking {result.reference} · {money(due)}</p>
          <form ref={payForm} method="post" action={result.payhere.action} className="hidden">
            {Object.entries(result.payhere.fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          </form>
        </div>
      </div>
    )
  }

  const Step = ({ n, title, children, done }) => (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-medium ${done ? 'bg-gold text-ink' : 'border border-gold/50 text-gold'}`}>{done ? <Check size={14} /> : n}</span>
        <h3 className="text-xs uppercase tracking-[.22em] text-cream/80">{title}</h3>
      </div>
      {children}
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-9">
      <Step n={1} title="Choose a service" done={!!service}>
        <div className="grid gap-3 sm:grid-cols-2">
          {bookable.map((s) => (
            <button type="button" key={s.id} onClick={() => { setServiceId(s.id); setTime('') }}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${serviceId === s.id ? 'border-gold bg-gold/10' : 'border-line hover:border-gold/50'}`}>
              <span className="hex-frame h-12 w-[2.7rem] shrink-0 text-gold"><Icon name={s.icon} size={18} strokeWidth={1.5} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-cream">{s.title}</span>
                <span className="text-xs text-mute">{s.duration} min{s.amount ? ` · ${money(s.amount)}` : ''}</span>
              </span>
            </button>
          ))}
        </div>
        {errs.service_id && err('service_id')}
      </Step>

      <Step n={2} title="Pick a date & time" done={!!time}>
        <input type="date" className="field max-w-xs" style={{ colorScheme: 'dark' }} value={date} min={todayStr()}
          max={addDays(todayStr(), booking.max_days_ahead || 60)} disabled={!service} onChange={(e) => setDate(e.target.value)} />
        <div className="mt-4 min-h-[3rem]">
          {!service && <p className="text-sm text-mute">Choose a service first.</p>}
          {service && !date && <p className="text-sm text-mute">Select a date to see available times.</p>}
          {service && date && slots === null && <p className="flex items-center gap-2 text-sm text-mute"><Loader2 className="animate-spin" size={16} /> Checking availability…</p>}
          {service && date && slots && slots.length === 0 && <p className="text-sm text-gold">{dateClosed ? 'We are closed on this day.' : 'No times left on this day. Please try another date.'}</p>}
          {slots && slots.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button type="button" key={s} onClick={() => setTime(s)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${time === s ? 'border-gold bg-gold text-ink' : 'border-line text-cream/80 hover:border-gold/60'}`}>{t12(s)}</button>
              ))}
            </div>
          )}
          {err('time')}
        </div>
      </Step>

      <Step n={3} title="Your details" done={!!(f.name && f.phone)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><input className="field" placeholder="Your name *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />{err('name')}</div>
          <div><input className="field" placeholder="Phone number *" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required />{err('phone')}</div>
          <div className="sm:col-span-2"><input className="field" placeholder="Email (for your confirmation)" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{err('email')}</div>
          <div className="sm:col-span-2"><textarea className="field" rows={3} placeholder="Anything we should know?" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        </div>
      </Step>

      <Step n={4} title="Payment" done={!!method}>
        {methods.length === 0 ? <p className="text-sm text-gold">No payment method is available. Please call us to book.</p> : (
          <div className="grid gap-3 sm:grid-cols-3">
            {methods.map((m) => {
              const M = METHODS[m]; const I = M.icon
              return (
                <button type="button" key={m} onClick={() => setMethod(m)}
                  className={`rounded-2xl border p-4 text-left transition-all ${method === m ? 'border-gold bg-gold/10' : 'border-line hover:border-gold/50'}`}>
                  <I className="text-gold" size={22} strokeWidth={1.5} />
                  <div className="mt-3 text-cream">{M.title}</div>
                  <div className="mt-1 text-xs text-mute">{M.text}</div>
                </button>
              )
            })}
          </div>
        )}
        {err('payment_method')}
        {method === 'bank' && booking.bank_details && <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-line p-4 font-sans text-sm text-cream/90">{booking.bank_details}</pre>}
      </Step>

      {service && (
        <div className="rounded-2xl border border-gold/30 bg-gold/[.06] p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-cream">{service.title}{date && time ? <span className="text-mute"> · {new Date(date + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}, {t12(time)}</span> : null}</div>
            {total > 0 && <div className="font-display text-2xl text-gold">{money(total)}</div>}
          </div>
          {method === 'online' && due > 0 && (
            <div className="mt-2 text-sm text-cream/80">Pay now: <b className="text-gold">{money(due)}</b>{due < total ? ` · balance ${money(total - due)} at the salon` : ''}</div>
          )}
          {booking.policy && <p className="mt-3 text-xs text-mute">{booking.policy}</p>}
        </div>
      )}

      {state === 'error' && <p className="flex items-center gap-2 text-red-400"><XCircle size={18} /> We couldn't complete your booking. Please try again or call us{settings.phone ? ` on ${settings.phone}` : ''}.</p>}

      <button className="btn-gold w-full justify-center sm:w-auto" disabled={!canSubmit} style={!canSubmit ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
        {state === 'sending' ? <><Loader2 className="animate-spin" size={18} /> Booking…</> : method === 'online' ? `Pay ${money(due)} & book` : 'Confirm booking'}
      </button>
    </form>
  )
}

/** Shown after returning from PayHere (?booking=REF) */
export function PaymentReturn({ symbol }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const ref = params.get('booking')
  const cancelled = params.get('cancelled')
  const [b, setB] = useState(null)
  const [open, setOpen] = useState(!!ref)

  useEffect(() => {
    if (!ref) return
    let tries = 0, dead = false
    const poll = () => fetch(`${API}/api/bookings/${ref}`).then((r) => r.json()).then((d) => {
      if (dead) return
      setB(d)
      // PayHere's server notification can lag a few seconds
      if (!cancelled && d.payment_method === 'online' && d.paid <= 0 && ++tries < 8) setTimeout(poll, 2500)
    }).catch(() => {})
    poll()
    return () => { dead = true }
  }, [ref, cancelled])

  const close = () => { setOpen(false); window.history.replaceState({}, '', window.location.pathname + '#appointment') }
  if (!open) return null
  const paid = b && b.paid > 0
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/90 p-5 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8 text-center">
        {!b ? <Loader2 className="mx-auto animate-spin text-gold" size={40} /> : cancelled ? (
          <>
            <XCircle className="mx-auto text-gold" size={56} strokeWidth={1.2} />
            <h3 className="mt-5 font-display text-3xl text-cream">Payment cancelled</h3>
            <p className="mt-2 text-mute">Your booking {b.reference} is held but unpaid. Please call us to complete it or choose to pay at the salon.</p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto text-gold" size={56} strokeWidth={1.2} />
            <h3 className="mt-5 font-display text-3xl text-cream">{paid ? 'Payment received' : 'Booking received'}</h3>
            <p className="mt-1 text-gold">Reference {b.reference}</p>
            <p className="mt-3 text-mute">{b.service} · {b.date_label} at {b.time_label}</p>
            <p className="mt-3 text-sm text-cream/80">{paid ? `Paid ${symbol || b.currency_symbol} ${b.paid.toLocaleString()}. Your appointment is confirmed.` : 'We are confirming your payment. You will hear from us shortly.'}</p>
          </>
        )}
        <button onClick={close} className="btn-gold mt-7">Close</button>
      </motion.div>
    </div>
  )
}
