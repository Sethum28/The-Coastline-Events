import jwt from 'jsonwebtoken'
export const COOKIE = 'ce_admin'
export const checkEnv = () => { const s = process.env.JWT_SECRET; if (!s || s.length < 32) throw new Error('JWT_SECRET is missing or too short (need 32+ characters). See .env.example') }
export const sign = (a) => jwt.sign({ id: a.id, email: a.email }, process.env.JWT_SECRET, { expiresIn: '8h' })
export const cookieOpts = () => ({ httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 3600 * 1000, path: '/' })
export function requireAuth(req, res, next) {
  const t = req.cookies?.[COOKIE]
  if (!t) return res.status(401).json({ error: 'Not authenticated' })
  try { req.admin = jwt.verify(t, process.env.JWT_SECRET); next() } catch { res.status(401).json({ error: 'Session expired' }) }
}
// CSRF defence: state-changing requests must carry a custom header (cross-site forms/fetches cannot add it without CORS approval).
export function csrfGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  if (req.get('X-CSRF') !== '1') return res.status(403).json({ error: 'Forbidden' })
  next()
}
