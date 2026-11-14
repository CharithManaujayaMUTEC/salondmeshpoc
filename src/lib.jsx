import {
  Scissors, Palette, Droplets, Crown, Waves, Sparkles, Coffee, Heart, Star, Flower2, Gem, Camera,
  MessageCircle,
} from 'lucide-react'

export const API = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8010').replace(/\/$/, '')

export const iconMap = {
  scissors: Scissors, palette: Palette, droplets: Droplets, crown: Crown, waves: Waves,
  sparkles: Sparkles, coffee: Coffee, heart: Heart, star: Star, flower: Flower2, gem: Gem, camera: Camera,
}
export const Icon = ({ name, ...p }) => {
  const C = iconMap[name] || Sparkles
  return <C {...p} />
}

const svg = (d) => ({ size = 18, strokeWidth, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}><path d={d} /></svg>
)
const Facebook = svg('M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21z')
const Instagram = svg('M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4zM17.2 5.5a1.3 1.3 0 1 1 0 2.600 1.3 1.3 0 0 1 0-2.600zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z')
const Youtube = svg('M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800C22 15.200 22 12 22 12s0-3.200-.4-4.800zM10 15V9l5.200 3z')
const TikTok = svg('M16.600 2h-3.100v13.200a2.800 2.800 0 1 1-2.800-2.800c.3 0 .600 0 .800.100V9.300a6 6 0 1 0 5.100 5.900V8.600a7 7 0 0 0 4 1.300V6.800a4 4 0 0 1-4-4.800z')

export const socialMap = {
  facebook: Facebook, instagram: Instagram, youtube: Youtube, whatsapp: MessageCircle, tiktok: TikTok,
}

export const fade = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
}

export const digits = (s = '') => s.replace(/[^\d+]/g, '')
