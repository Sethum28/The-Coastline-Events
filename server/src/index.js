import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'
import { checkEnv } from './auth.js'
import { UPLOAD_DIR } from './upload.js'
import { HttpError } from './util.js'
import authRoutes from './routes/auth.js'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'

checkEnv()
const isProd = process.env.NODE_ENV === 'production', app = express()
app.disable('x-powered-by')
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: { useDefaults: true, directives: {
    'default-src': ["'self'"], 'script-src': ["'self'"], 'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], 'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'blob:'], 'media-src': ["'self'"], 'connect-src': ["'self'"], 'object-src': ["'none'"], 'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': isProd ? [] : null } },
}))
const origins = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
app.use(cors({ origin: origins.length ? origins : false, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

app.get('/api/health', async (_q, res) => { try { await pool.query('SELECT 1'); res.json({ ok: true }) } catch { res.status(503).json({ ok: false }) } })
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', publicRoutes)
app.use('/api', (_q, _r, next) => next(new HttpError(404, 'Not found')))
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', fallthrough: false }))

// Production: serve the built React app (npm run build in the project root) from the same server.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist')
if (isProd && fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '1h', index: false }))
  app.get('*', (_q, res) => res.sendFile(path.join(dist, 'index.html')))
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'That value already exists (for example, the slug or image is already used).' })
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'A linked item does not exist.' })
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Image is too large (max 8 MB).' })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' })
  if (err.status === 404) return res.status(404).json({ error: 'Not found' })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong.' })
})
const port = Number(process.env.PORT || 4000)
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
