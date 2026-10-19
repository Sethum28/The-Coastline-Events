export const LKR = (n) => 'LKR ' + n.toLocaleString('en-LK')
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const isPast = (d) => new Date(d) < new Date(new Date().toDateString())
export const validEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
export const daysUntil = (d) => { const [y, m, dd] = d.split('-').map(Number), n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((new Date(y, m - 1, dd) - n) / 864e5) }
