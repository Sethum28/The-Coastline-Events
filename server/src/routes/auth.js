import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { pool } from '../db.js'
import { COOKIE, sign, cookieOpts, requireAuth, csrfGuard } from '../auth.js'
import { ah, isEmail, HttpError } from '../util.js'
const r = Router()
r.use(csrfGuard)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many login attempts. Try again later.' } })
const DUMMY = bcrypt.hashSync('not-a-real-password', 12) // keeps response time similar for unknown emails
r.post('/login', limiter, ah(async (req, res) => {
  const { email, password } = req.body || {}
  if (!isEmail(email) || typeof password !== 'string' || password.length > 200) throw new HttpError(400, 'Enter a valid email and password')
  const [rows] = await pool.query('SELECT id,email,name,password_hash FROM admins WHERE email=?', [email.toLowerCase()])
  const a = rows[0], ok = await bcrypt.compare(password, a ? a.password_hash : DUMMY)
  if (!a || !ok) throw new HttpError(401, 'Incorrect email or password')
  res.cookie(COOKIE, sign(a), cookieOpts()).json({ email: a.email, name: a.name })
}))
r.get('/me', requireAuth, ah(async (req, res) => {
  const [rows] = await pool.query('SELECT email,name FROM admins WHERE id=?', [req.admin.id])
  if (!rows[0]) throw new HttpError(401, 'Not authenticated')
  res.json(rows[0])
}))
r.post('/logout', (_req, res) => { res.clearCookie(COOKIE, { ...cookieOpts(), maxAge: undefined }).json({ ok: true }) })
export default r
