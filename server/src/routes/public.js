import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db.js'
import { ah, isEmail, HttpError } from '../util.js'
const r = Router()
const lim = (limit, windowMs) => rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } })
const SERIES = ['soiree', 'one-love', 'exclusive']

r.get('/settings', ah(async (_q, res) => {
  const [rows] = await pool.query('SELECT `key`,`value` FROM settings'), s = Object.fromEntries(rows.map(x => [x.key, x.value]))
  res.json({ ticketUrl: s.ticket_url || '', email: s.email || '', phone: s.phone || '', location: s.location || '', instagram: s.instagram || '', facebook: s.facebook || '', tagline: s.tagline || '', description: s.description || '' })
}))
r.get('/events', ah(async (_q, res) => {
  const [rows] = await pool.query('SELECT id,slug,title,series,event_date,event_time,venue,status,img,description,ticket_url FROM events WHERE published=1 ORDER BY event_date ASC, id ASC')
  const [links] = await pool.query('SELECT ea.event_id, a.slug FROM event_artists ea JOIN artists a ON a.id=ea.artist_id WHERE a.published=1 ORDER BY a.sort_order, a.id')
  const by = {}; for (const l of links) (by[l.event_id] ||= []).push(l.slug)
  res.json(rows.map(e => ({ slug: e.slug, title: e.title, series: e.series, date: e.event_date, time: e.event_time || 'Time to be announced', venue: e.venue || 'Venue to be announced', status: e.status, img: e.img || undefined, artists: by[e.id] || [], desc: e.description || '', ticketUrl: e.ticket_url || '' })))
}))
r.get('/artists', ah(async (_q, res) => {
  const [rows] = await pool.query('SELECT slug,name,img,pos,bio,instagram,soundcloud FROM artists WHERE published=1 ORDER BY sort_order, id')
  res.json(rows.map(a => ({ ...a, bio: a.bio || '', instagram: a.instagram || '', soundcloud: a.soundcloud || '' })))
}))
r.get('/gallery', ah(async (_q, res) => {
  const [rows] = await pool.query('SELECT id,cat,src,alt,ar FROM gallery WHERE published=1 ORDER BY sort_order, id')
  res.json(rows.map(g => ({ id: 'g' + g.id, cat: g.cat, src: g.src, alt: g.alt, ar: g.ar })))
}))
r.get('/faqs', ah(async (_q, res) => {
  const [rows] = await pool.query('SELECT question,answer FROM faqs WHERE published=1 ORDER BY sort_order, id')
  res.json(rows.map(f => [f.question, f.answer]))
}))
r.post('/contact', lim(5, 60 * 60 * 1000), ah(async (req, res) => {
  const { name, email, type, message } = req.body || {}
  const TYPES = ['Event booking', 'Private event', 'Artist / brand collaboration']
  if (typeof name !== 'string' || !name.trim() || name.length > 120) throw new HttpError(400, 'Please enter your name')
  if (!isEmail(email)) throw new HttpError(400, 'Please enter a valid email')
  if (!TYPES.includes(type)) throw new HttpError(400, 'Choose an enquiry type')
  if (typeof message !== 'string' || message.trim().length < 5 || message.length > 4000) throw new HttpError(400, 'Please write a message (5–4000 characters)')
  await pool.query('INSERT INTO messages (name,email,type,message) VALUES (?,?,?,?)', [name.trim(), email.toLowerCase(), type, message.trim()])
  res.status(201).json({ ok: true })
}))
r.post('/newsletter', lim(10, 60 * 60 * 1000), ah(async (req, res) => {
  const { email } = req.body || {}
  if (!isEmail(email)) throw new HttpError(400, 'Please enter a valid email')
  await pool.query('INSERT IGNORE INTO subscribers (email) VALUES (?)', [email.toLowerCase()]) // same answer whether new or existing
  res.status(201).json({ ok: true })
}))
export default r
