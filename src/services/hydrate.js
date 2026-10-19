import { SITE, EVENTS, ARTISTS, GALLERY, FAQS } from '../data/site.js'
// Loads live content from the API into the shared data modules (in place). If the API is unreachable the
// built-in starter content in data/site.js is used, so the site still renders.
export async function hydrate() {
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 5000)
  try {
    const get = (u) => fetch(u, { signal: ctrl.signal }).then(r => { if (!r.ok) throw new Error(u); return r.json() })
    const [s, e, a, g, f] = await Promise.all([get('/api/settings'), get('/api/events'), get('/api/artists'), get('/api/gallery'), get('/api/faqs')])
    Object.assign(SITE, s); EVENTS.splice(0, EVENTS.length, ...e); ARTISTS.splice(0, ARTISTS.length, ...a)
    GALLERY.splice(0, GALLERY.length, ...g); FAQS.splice(0, FAQS.length, ...f)
    return true
  } catch { return false } finally { clearTimeout(t) }
}
