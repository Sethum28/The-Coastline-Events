// Public API calls. The Express server lives in /server (see README). Data is loaded once at start-up by hydrate.js.
const post = async (url, body) => {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.error || 'Something went wrong. Please try again.')
  return j
}
export const submitContact = (data) => post('/api/contact', data)
export const subscribe = (email) => post('/api/newsletter', { email })
