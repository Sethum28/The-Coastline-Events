import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth, csrfGuard } from '../auth.js'
import { ah, P, collector, idParam, slugify, HttpError } from '../util.js'
import { upload, verifyImage } from '../upload.js'
const r = Router()
r.use(requireAuth, csrfGuard)
const SERIES = ['soiree', 'one-love', 'exclusive']
const q = (sql, p) => pool.query(sql, p)
const clean = (b = {}) => { const o = { ...b }; if (o.slug === '') delete o.slug; return o } // empty slug = auto-generate
const one = async (table, id) => { const [rows] = await q(`SELECT * FROM \`${table}\` WHERE id=?`, [id]); if (!rows[0]) throw new HttpError(404, 'Not found'); return rows[0] }

// ---- generic CRUD for simple tables (table/column names come from the specs below, never from the request)
function crud(path, table, spec, { order = 'id DESC', slugFrom } = {}) {
  const collect = collector(spec), cols = (d) => Object.keys(d).map(k => `\`${k}\``)
  r.get(path, ah(async (_q, res) => res.json((await q(`SELECT * FROM \`${table}\` ORDER BY ${order}`))[0])))
  r.post(path, ah(async (req, res) => {
    const body = clean(req.body), d = collect(body, false)
    if (slugFrom && !d.slug) { d.slug = slugify(body[slugFrom] || ''); if (!d.slug) throw new HttpError(400, 'slug is required') }
    const [ins] = await q(`INSERT INTO \`${table}\` (${cols(d).join(',')}) VALUES (${Object.keys(d).map(() => '?').join(',')})`, Object.values(d))
    res.status(201).json(await one(table, ins.insertId))
  }))
  r.put(`${path}/:id`, ah(async (req, res) => {
    const id = idParam(req); await one(table, id)
    const d = collect(clean(req.body), true), keys = Object.keys(d)
    if (keys.length) await q(`UPDATE \`${table}\` SET ${keys.map(k => `\`${k}\`=?`).join(',')} WHERE id=?`, [...Object.values(d), id])
    res.json(await one(table, id))
  }))
  r.delete(`${path}/:id`, ah(async (req, res) => { const id = idParam(req); await one(table, id); await q(`DELETE FROM \`${table}\` WHERE id=?`, [id]); res.status(204).end() }))
}
crud('/artists', 'artists', {
  slug: { parse: P.slug }, name: { required: true, parse: P.str(120) }, img: { parse: P.img }, pos: { parse: P.pos }, bio: { parse: P.optStr(3000) },
  instagram: { parse: P.url }, soundcloud: { parse: P.url }, sort_order: { parse: P.int(0, 9999) }, published: { parse: P.bool },
}, { order: 'sort_order, id', slugFrom: 'name' })
crud('/gallery', 'gallery', {
  cat: { required: true, parse: P.enum(SERIES) }, src: { required: true, parse: P.imgReq }, alt: { required: true, parse: P.str(255) },
  ar: { parse: P.ratio }, sort_order: { parse: P.int(0, 9999) }, published: { parse: P.bool },
}, { order: 'sort_order, id' })
crud('/faqs', 'faqs', { question: { required: true, parse: P.str(190) }, answer: { required: true, parse: P.str(3000) }, sort_order: { parse: P.int(0, 9999) }, published: { parse: P.bool } }, { order: 'sort_order, id' })

// ---- events (with linked artists)
const evSpec = {
  slug: { parse: P.slug }, title: { required: true, parse: P.str(190) }, series: { required: true, parse: P.enum(SERIES) }, event_date: { required: true, parse: P.date },
  event_time: { parse: P.optStr(80) }, venue: { parse: P.optStr(190) }, status: { parse: P.str(40) }, img: { parse: P.img },
  description: { parse: P.optStr(5000) }, ticket_url: { parse: P.url }, published: { parse: P.bool },
}
const evCollect = collector(evSpec)
const artistIds = (v) => { if (v === undefined) return undefined; if (!Array.isArray(v) || v.length > 100 || !v.every(n => Number.isInteger(n) && n > 0)) throw new HttpError(400, 'artist_ids must be a list of artist ids'); return [...new Set(v)] }
async function saveEvent(id, data, ids) {
  const c = await pool.getConnection()
  try {
    await c.beginTransaction()
    const keys = Object.keys(data)
    if (id === null) { const [ins] = await c.query(`INSERT INTO events (${keys.map(k => `\`${k}\``).join(',')}) VALUES (${keys.map(() => '?').join(',')})`, Object.values(data)); id = ins.insertId }
    else if (keys.length) await c.query(`UPDATE events SET ${keys.map(k => `\`${k}\`=?`).join(',')} WHERE id=?`, [...Object.values(data), id])
    if (ids) { await c.query('DELETE FROM event_artists WHERE event_id=?', [id]); if (ids.length) await c.query('INSERT INTO event_artists (event_id,artist_id) VALUES ?', [ids.map(a => [id, a])]) }
    await c.commit(); return id
  } catch (e) { await c.rollback(); throw e } finally { c.release() }
}
const evOut = async (id) => { const [rows] = await q('SELECT e.*, GROUP_CONCAT(ea.artist_id) AS ids FROM events e LEFT JOIN event_artists ea ON ea.event_id=e.id WHERE e.id=? GROUP BY e.id', [id]); if (!rows[0]) throw new HttpError(404, 'Not found'); const { ids, ...e } = rows[0]; return { ...e, artist_ids: ids ? ids.split(',').map(Number) : [] } }
r.get('/events', ah(async (_q, res) => {
  const [rows] = await q('SELECT e.*, GROUP_CONCAT(ea.artist_id) AS ids FROM events e LEFT JOIN event_artists ea ON ea.event_id=e.id GROUP BY e.id ORDER BY e.event_date DESC, e.id DESC')
  res.json(rows.map(({ ids, ...e }) => ({ ...e, artist_ids: ids ? ids.split(',').map(Number) : [] })))
}))
r.post('/events', ah(async (req, res) => {
  const b = clean(req.body), d = evCollect(b, false); if (!d.slug) d.slug = slugify(d.title); if (!d.slug) throw new HttpError(400, 'slug is required')
  res.status(201).json(await evOut(await saveEvent(null, d, artistIds(b.artist_ids))))
}))
r.put('/events/:id', ah(async (req, res) => { const id = idParam(req); await one('events', id); const b = clean(req.body); await saveEvent(id, evCollect(b, true), artistIds(b.artist_ids)); res.json(await evOut(id)) }))
r.delete('/events/:id', ah(async (req, res) => { const id = idParam(req); await one('events', id); await q('DELETE FROM events WHERE id=?', [id]); res.status(204).end() }))

// ---- messages & subscribers
r.get('/messages', ah(async (_q, res) => res.json((await q('SELECT * FROM messages ORDER BY created_at DESC, id DESC LIMIT 500'))[0])))
r.patch('/messages/:id', ah(async (req, res) => { const id = idParam(req); await one('messages', id); await q('UPDATE messages SET is_read=? WHERE id=?', [P.bool(req.body?.is_read), id]); res.json(await one('messages', id)) }))
r.delete('/messages/:id', ah(async (req, res) => { const id = idParam(req); await one('messages', id); await q('DELETE FROM messages WHERE id=?', [id]); res.status(204).end() }))
r.get('/subscribers', ah(async (_q, res) => res.json((await q('SELECT * FROM subscribers ORDER BY created_at DESC, id DESC LIMIT 5000'))[0])))
r.get('/subscribers/export.csv', ah(async (_q, res) => {
  const [rows] = await q('SELECT email,created_at FROM subscribers ORDER BY created_at DESC')
  const cell = (v) => { let s = String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"' } // blocks spreadsheet formula injection
  res.type('text/csv').attachment('subscribers.csv').send('email,subscribed_at\n' + rows.map(x => `${cell(x.email)},${cell(x.created_at)}`).join('\n'))
}))
r.delete('/subscribers/:id', ah(async (req, res) => { const id = idParam(req); await one('subscribers', id); await q('DELETE FROM subscribers WHERE id=?', [id]); res.status(204).end() }))

// ---- settings
const SETTINGS = { ticket_url: P.url, email: P.str(190), phone: P.optStr(60), location: P.optStr(190), instagram: P.url, facebook: P.url, tagline: P.optStr(120), description: P.optStr(1000) }
const readSettings = async () => Object.fromEntries((await q('SELECT `key`,`value` FROM settings'))[0].map(x => [x.key, x.value]))
r.get('/settings', ah(async (_q, res) => { const s = await readSettings(); res.json(Object.fromEntries(Object.keys(SETTINGS).map(k => [k, s[k] || '']))) }))
r.put('/settings', ah(async (req, res) => {
  const b = req.body || {}, rows = []
  for (const [k, parse] of Object.entries(SETTINGS)) if (b[k] !== undefined) rows.push([k, parse(b[k], b, k) ?? ''])
  if (rows.length) await q('INSERT INTO settings (`key`,`value`) VALUES ? ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)', [rows])
  const s = await readSettings(); res.json(Object.fromEntries(Object.keys(SETTINGS).map(k => [k, s[k] || ''])))
}))

// ---- dashboard + image upload
r.get('/stats', ah(async (_q, res) => {
  const [[c]] = await q(`SELECT (SELECT COUNT(*) FROM events) events,(SELECT COUNT(*) FROM events WHERE published=1 AND event_date>=CURDATE()) upcoming,(SELECT COUNT(*) FROM artists) artists,(SELECT COUNT(*) FROM gallery) gallery,(SELECT COUNT(*) FROM messages WHERE is_read=0) unread,(SELECT COUNT(*) FROM subscribers) subscribers`)
  const [recent] = await q('SELECT id,name,email,type,is_read,created_at FROM messages ORDER BY created_at DESC, id DESC LIMIT 5')
  const s = await readSettings()
  res.json({ ...c, ticketUrlSet: !!s.ticket_url, recent })
}))
r.post('/upload', upload.single('file'), ah(async (req, res) => { if (!req.file) throw new HttpError(400, 'No file uploaded'); verifyImage(req.file); res.status(201).json({ url: '/uploads/' + req.file.filename }) }))
export default r
