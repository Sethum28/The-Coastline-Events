// Creates the database, tables and starter content. Safe to re-run (never drops data).
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'
import { fileURLToPath } from 'node:url'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../database')
const c = await mysql.createConnection({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', multipleStatements: true, charset: 'utf8mb4' })
for (const f of ['schema.sql', 'seed.sql']) { await c.query(fs.readFileSync(path.join(dir, f), 'utf8')); console.log('ran', f) }
await c.end(); console.log('Database ready. Next: npm run create-admin')
