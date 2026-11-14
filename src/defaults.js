// Built-in fallback content, shown only when the backend API is unreachable.
// Mirrors the shape returned by GET /api/site. Media lives in /public/defaults.
const base = import.meta.env.BASE_URL.replace(/\/$/, '') + '/defaults'
const img = (n) => `${base}/img/img_${n}.webp`
const vid = (n) => `${base}/video/${n}.mp4`

const gallery = [
  ['9678', 'Reception', 'Salon'], ['9667', 'Wash lounge', 'Salon'], ['9674', 'Styling station', 'Stations'],
  ['9673', 'The main floor', 'Salon'], ['9676', 'Arched mirrors', 'Stations'], ['9666', 'Wash basins', 'Details'],
  ['9669', 'Gold accents', 'Details'], ['9672', 'Signature chair', 'Stations'], ['9679', 'Premium leather', 'Details'],
  ['9686', 'Styling chair', 'Stations'], ['9685', 'Mirror wall', 'Salon'], ['9671', 'Vanity corner', 'Salon'],
].map(([n, title, category], i) => ({
  id: `g${i}`, group: 'salon', title, category, type: 'image', image: img(n), video: null, featured: i < 3,
}))

export const defaults = {
  offline: true,
  settings: {
    site_name: 'Salon Dmesh',
    tagline: 'Where every strand finds its style',
    logo: `${base}/logo-light.png`,
    favicon: null,
    phone: '+94 11 000 0000',
    whatsapp: '+94 77 000 0000',
    email: 'hello@salondmesh.lk',
    address: 'Salon Dmesh (Pvt) Ltd\nMirihana, Nugegoda\nSri Lanka',
    map_embed_url: 'https://www.google.com/maps?q=Salon+Dmesh+Mirihana&output=embed',
    map_link: 'https://www.google.com/maps/search/?api=1&query=Salon+Dmesh+Mirihana',
    opening_hours: [
      { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
      { day: 'Saturday', hours: '9:00 AM – 7:00 PM' },
      { day: 'Sunday', hours: '10:00 AM – 5:00 PM' },
    ],
    socials: [
      { platform: 'facebook', url: 'https://www.facebook.com/' },
      { platform: 'instagram', url: 'https://www.instagram.com/' },
    ],
    about: {
      eyebrow: 'About the salon',
      title: 'A calm, modern space for beautiful hair',
      text: 'Step into Salon Dmesh in Mirihana: warm light, plush seating and a team that listens before they cut. From precision styling to deep restorative treatments, every visit is designed to leave you feeling polished and completely at ease.',
      image: img('9678'),
      points: [
        'Premium leather chairs with built-in charging',
        'Luxury wash stations for a spa-like experience',
        'Professional colour & treatment products',
      ],
    },
    stats: [
      { value: '10', suffix: '+', label: 'Years of craft' },
      { value: '5000', suffix: '+', label: 'Happy clients' },
      { value: '12', suffix: '', label: 'Signature services' },
      { value: '4.9', suffix: '★', label: 'Average rating' },
    ],
    cta: {
      title: 'Ready for your best hair day?',
      text: 'Tell us what you have in mind and our team will confirm your appointment shortly.',
      button: 'Book appointment',
    },
    footer_text: 'Salon Dmesh (Pvt) Ltd. All rights reserved.',
    seo: { title: 'Salon Dmesh — Hair Salon in Mirihana', description: 'Premium hair styling, colour, treatments and bridal services in Mirihana.' },
  },
  hero: [
    { id: 'h1', eyebrow: 'Salon Dmesh · Mirihana', title: 'Style that', highlight: 'finds you', subtitle: 'Premium hair care in a calm, modern space.', type: 'video', image: img('9678'), video: vid('salon-tour'), button_label: 'Book now', button_link: '#appointment' },
    { id: 'h2', eyebrow: 'Luxury wash lounge', title: 'Relax. Refresh.', highlight: 'Renew.', subtitle: 'Spa-style basins with plush leather seating.', type: 'image', image: img('9667'), video: null, button_label: 'Our services', button_link: '#services' },
    { id: 'h3', eyebrow: 'Crafted with care', title: 'Beauty in', highlight: 'every detail', subtitle: 'Warm light, arched mirrors and chairs made for comfort.', type: 'image', image: img('9675'), video: null, button_label: 'See the salon', button_link: '#gallery' },
  ],
  services: [
    ['Hair Styling', 'Cuts, blow-dries and finishes tailored to your face and lifestyle.', 'scissors', '9674', 'From Rs. 1,500'],
    ['Colour & Highlights', 'Balayage, global colour and corrections using professional colour.', 'palette', '9676', 'From Rs. 6,000'],
    ['Hair Treatments', 'Keratin, smoothing and deep-repair rituals for healthy shine.', 'droplets', '9666', 'From Rs. 5,000'],
    ['Bridal & Occasion', 'Elegant updos and bridal looks for your special day.', 'crown', '9671', 'On request'],
    ['Wash & Scalp Care', 'Relaxing wash, massage and scalp therapy at our lounge.', 'waves', '9670', 'From Rs. 1,000'],
    ['Styling & Grooming', 'Sharp, clean looks for him: cuts, beard and grooming.', 'sparkles', '9686', 'From Rs. 1,200'],
  ].map(([title, description, icon, n, price], i) => ({ id: `s${i}`, title, description, icon, image: img(n), price })),
  process: [
    ['Welcome & consultation', 'A warm welcome and a relaxed chat about your hair goals.', 'coffee'],
    ['Wash & prepare', 'A soothing wash and scalp massage at our lounge basins.', 'droplets'],
    ['Crafting your look', 'Our stylists bring your look to life with precision and care.', 'scissors'],
    ['Finish & glow', 'Final styling, aftercare tips and a mirror moment you will love.', 'sparkles'],
  ].map(([title, description, icon], i) => ({ id: `p${i}`, title, description, icon })),
  gallery: [
    { id: 'gv1', group: 'salon', title: 'Salon reel', category: 'Salon', type: 'video', image: img('9674'), video: vid('salon-reel'), featured: false },
    ...gallery,
  ],
  team: [],
  testimonials: [],
}
