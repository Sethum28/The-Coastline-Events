export class HttpError extends Error { constructor(status, message) { super(message); this.status = status } }
export const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
const bad = (m) => { throw new HttpError(400, m) }
export const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120)
export const isEmail = (v) => typeof v === 'string' && v.length <= 190 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
const IMG = /^(\/(uploads|images)\/[\w\-./]+|https?:\/\/[^\s"'<>]+)$/
const URL_HTTP = /^https?:\/\/[^\s"'<>]+$/
// Field parsers: (value, body, key) -> clean value for the database, or throw a 400.
export const P = {
  str: (max = 255) => (v, _b, k) => { if (typeof v !== 'string') bad(`${k} must be text`); const t = v.trim(); if (!t) bad(`${k} is required`); if (t.length > max) bad(`${k} is too long (max ${max})`); return t },
  optStr: (max = 255) => (v, _b, k) => { if (v === null || v === '') return null; if (typeof v !== 'string') bad(`${k} must be text`); const t = v.trim(); if (t.length > max) bad(`${k} is too long (max ${max})`); return t || null },
  int: (min = 0, max = 100000) => (v, _b, k) => { const n = Number(v); if (!Number.isInteger(n) || n < min || n > max) bad(`${k} must be a whole number (${min}–${max})`); return n },
  bool: (v) => (v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0),
  enum: (list) => (v, _b, k) => { if (!list.includes(v)) bad(`${k} must be one of: ${list.join(', ')}`); return v },
  date: (v, _b, k) => { if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(v + 'T00:00:00Z').toISOString().slice(0, 10) !== v) bad(`${k} must be a valid date (YYYY-MM-DD)`); return v },
  slug: (v, _b, k) => { const s = slugify(v ?? ''); if (!s) bad(`${k} is required`); return s },
  img: (v, _b, k) => { if (v === null || v === '') return null; if (typeof v !== 'string' || v.length > 255 || v.includes('..') || !IMG.test(v)) bad(`${k} must be an uploaded image or an http(s) URL`); return v },
  imgReq: (v, b, k) => { const r = P.img(v, b, k); if (!r) bad(`${k} is required`); return r },
  url: (v, _b, k) => { if (v === null || v === '') return null; if (typeof v !== 'string' || v.length > 500 || !URL_HTTP.test(v)) bad(`${k} must start with http:// or https://`); return v },
  ratio: (v, _b, k) => { if (typeof v !== 'string' || !/^\d{1,2}\/\d{1,2}$/.test(v)) bad(`${k} must look like 3/2`); return v },
  pos: (v, _b, k) => { if (typeof v !== 'string' || !/^\d{1,3}% \d{1,3}%$/.test(v)) bad(`${k} must look like 50% 50%`); return v },
}
export const collector = (spec) => (body, partial) => {
  const out = {}
  for (const [k, s] of Object.entries(spec)) {
    if (body[k] === undefined) { if (!partial && s.required) bad(`${k} is required`); continue }
    out[k] = s.parse(body[k], body, k)
  }
  return out
}
export const idParam = (req) => { const id = Number(req.params.id); if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'Invalid id'); return id }
