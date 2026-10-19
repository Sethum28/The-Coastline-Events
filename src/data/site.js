// MOCK DATA — all demo content lives here. Replace with API calls in src/services/api.js.
export const SITE = {
  name: 'THE COASTLINE EVENTS',
  tagline: 'BEYOND THE BEATS.',
  description: 'Conducting the best accompanied coastal events to your shores. Follow us towards electrifying beats — the ultimate coastal event experience.',
  email: 'thecoastlineevents@gmail.com', phone: '077 713 7266', location: 'Colombo, Sri Lanka',
  // Ticket sales happen on a separate ticketing site. Paste its URL here (an event can override with its own ticketUrl).
  ticketUrl: '',
  instagram: 'https://www.instagram.com/thecoastlineevents',
}
export const SERIES = {
  soiree: { name: 'SOIRÉE', color: '#B7FF00', bg: 'linear-gradient(150deg,#0b3a1d,#050706)', line: 'AFTER DARK. BEYOND ORDINARY.', blurb: 'A signature night-event experience driven by progressive house, atmosphere, light and sound.', motif: 'OPEN — CLOSE', img: '/images/gallery/event-02.jpg', alt: 'SOIRÉE event atmosphere', video: '/videos/logo-reveal.mp4' },
  'one-love': { name: 'ONE LOVE', color: '#e9895a', bg: 'linear-gradient(150deg,#f3e6c4,#8fae6a 60%,#e9895a)', line: 'SUNLIT MOMENTS. SHARED FREQUENCIES.', blurb: 'A tropical brunch concept combining music, coastal culture and social experiences.', motif: 'BRUNCH BY THE SEA', img: '/images/one-love/hero.jpg', alt: 'ONE LOVE stage at dusk with LED screens and floral trusses', video: '/videos/one-love.mp4' },
  exclusive: { name: 'THE COASTLINE EXCLUSIVE', color: '#c9b27a', bg: 'linear-gradient(150deg,#0c3b2c,#050706)', line: 'RARE EXPERIENCES. DISTINCTLY COASTLINE.', blurb: 'A premium event concept built around exclusive gatherings and curated experiences.', motif: 'CURATED · PRIVATE', img: '/images/exclusive/hero.jpg', alt: 'DJ performing at THE COASTLINE EXCLUSIVE with white floral decor', video: '/videos/exclusive.mp4' },
}
export const ARTISTS = [
  { slug: 'adora', name: 'ADORA', img: '/images/artists/adora.jpg', pos: '50% 18%', bio: 'Artist profile coming soon — bio and social links to be supplied.' },
  { slug: 'echo-daft', name: 'ECHO DAFT', img: '/images/artists/echo-daft.jpg', pos: '56% 50%', bio: 'Artist profile coming soon — bio and social links to be supplied.' },
  { slug: 'jayy-vibes', name: 'JAYY VIBES', img: '/images/artists/jayy-vibes.jpg', pos: '64% 50%', bio: 'Artist profile coming soon — bio and social links to be supplied.' },
  { slug: 'kryptone', name: 'KRYPTONE', img: '/images/artists/kryptone.jpg', pos: '56% 50%', bio: 'Artist profile coming soon — bio and social links to be supplied.' },
  { slug: 'perc-capsule', name: 'PERC CAPSULE', img: '/images/artists/perc-capsule.jpg', pos: '68% 50%', bio: 'Artist profile coming soon — bio and social links to be supplied.' },
  { slug: 'universe-sl', name: 'UNIVERSE SL', img: '/images/artists/universe-sl.jpg', pos: '68% 50%', bio: 'Artist profile coming soon — bio and social links to be supplied.' },
]
export const EVENTS = [
  { slug: 'soiree-open-to-close', title: 'SOIRÉE — Open to Close', series: 'soiree', date: '2026-12-24', time: 'Time to be announced', venue: 'Venue to be announced', status: 'Announced', img: '/images/gallery/event-02.jpg', artists: [], desc: 'The next SOIRÉE: progressive house, light and sound from open to close. Venue, timings and lineup will be announced soon.' },
]

export const FAQS = [
  ['Are the events on this site real?', 'Not yet. All events, artists and prices are demo content until verified information is supplied by THE COASTLINE EVENTS.'],
  ['Where do I buy tickets?', 'Tickets are sold on our separate ticketing site. Use any Get Tickets button on this website to go there.'],
  ['What is the difference between SOIRÉE, ONE LOVE and THE COASTLINE EXCLUSIVE?', 'SOIRÉE is our night series, ONE LOVE is our tropical brunch concept, and THE COASTLINE EXCLUSIVE is our premium, curated concept.'],
  ['Is there an age limit or dress code?', 'This is set per event and will be shown on the event page once confirmed.'],
  ['How can I enquire about a private event or collaboration?', 'Use the contact page, email thecoastlineevents@gmail.com or call 077 713 7266.'],
]
// Gallery: stills are taken from the client-supplied videos. Entries with src:null render a labelled placeholder.
export const GALLERY = [
  ...[1, 2, 3, 4, 5, 6].map(n => ({ id: 'e' + n, cat: 'soiree', src: `/images/gallery/event-0${n}.jpg`, alt: `Event atmosphere still ${n}`, ar: '16/9' })),
  ...[1, 2, 3, 4].map(n => ({ id: 'r' + n, cat: 'soiree', src: `/images/gallery/soiree-reveal-0${n}.jpg`, alt: `SOIRÉE neon logo reveal still ${n}`, ar: '16/9' })),
  { id: 'o1', cat: 'one-love', src: '/images/one-love/hero.jpg', alt: 'ONE LOVE main stage at dusk', ar: '3/2' },
  { id: 'o2', cat: 'one-love', src: '/images/one-love/stage.jpg', alt: 'DJ on the ONE LOVE stage in front of the LED screen', ar: '4/5' },
  { id: 'o3', cat: 'one-love', src: '/images/one-love/florals.jpg', alt: 'ONE LOVE LED screen with floral truss and butterfly lights', ar: '3/2' },
  { id: 'x1', cat: 'exclusive', src: '/images/exclusive/hero.jpg', alt: 'DJ at THE COASTLINE EXCLUSIVE', ar: '3/2' },
  { id: 'x2', cat: 'exclusive', src: '/images/exclusive/dj.jpg', alt: 'DJ behind the decks at THE COASTLINE EXCLUSIVE', ar: '4/5' },
  { id: 'x3', cat: 'exclusive', src: '/images/exclusive/sign.jpg', alt: 'THE COASTLINE lettering and white flower garland on the DJ booth', ar: '16/9' },
]
