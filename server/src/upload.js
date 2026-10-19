import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { HttpError } from './util.js'
export const UPLOAD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
export const upload = multer({
  storage: multer.diskStorage({ destination: UPLOAD_DIR, filename: (_r, f, cb) => cb(null, crypto.randomUUID() + '.' + (EXT[f.mimetype] || 'bin')) }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_r, f, cb) => (EXT[f.mimetype] ? cb(null, true) : cb(new HttpError(400, 'Only JPG, PNG, WEBP or GIF images are allowed'))),
})
// Verify the real file signature (the browser-supplied mimetype can be faked).
export function verifyImage(file) {
  const b = Buffer.alloc(12), fd = fs.openSync(file.path, 'r'); fs.readSync(fd, b, 0, 12, 0); fs.closeSync(fd)
  const kind = b[0] === 0xFF && b[1] === 0xD8 ? 'jpg' : b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) ? 'png'
    : b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' ? 'webp' : b.subarray(0, 3).toString() === 'GIF' ? 'gif' : null
  if (kind !== EXT[file.mimetype]) { fs.unlink(file.path, () => {}); throw new HttpError(400, 'File content does not match an allowed image type') }
}
