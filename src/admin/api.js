// Admin API client. Cookie session (httpOnly) + X-CSRF header on every request.
async function req(method, path, body) {
  const o = { method, credentials: 'include', headers: { 'X-CSRF': '1' } }
  if (body instanceof FormData) o.body = body
  else if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body) }
  const r = await fetch('/api' + path, o)
  if (r.status === 204) return null
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(j.error || 'Request failed'), { status: r.status })
  return j
}
export const api = { get: (p) => req('GET', p), post: (p, b) => req('POST', p, b), put: (p, b) => req('PUT', p, b), patch: (p, b) => req('PATCH', p, b), del: (p) => req('DELETE', p) }
