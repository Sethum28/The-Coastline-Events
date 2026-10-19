// Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-passphrase' npm run create-admin
// (or: node scripts/create-admin.js you@example.com 'a-long-passphrase'). Re-running changes that admin's password.
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from '../src/db.js'
import { isEmail } from '../src/util.js'
const email = (process.argv[2] || process.env.ADMIN_EMAIL || '').toLowerCase(), pw = process.argv[3] || process.env.ADMIN_PASSWORD || '', name = process.env.ADMIN_NAME || 'Admin'
if (!isEmail(email)) { console.error('Provide a valid ADMIN_EMAIL'); process.exit(1) }
if (pw.length < 10) { console.error('ADMIN_PASSWORD must be at least 10 characters'); process.exit(1) }
await pool.query('INSERT INTO admins (email,password_hash,name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), name=VALUES(name)', [email, await bcrypt.hash(pw, 12), name])
console.log('Admin ready:', email); await pool.end()
