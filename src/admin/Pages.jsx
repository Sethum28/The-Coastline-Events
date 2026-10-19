import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from './api.js'
const fmt = (s) => (s ? String(s).replace('T', ' ').slice(0, 16) : '')

export function Dashboard() {
  const [s, setS] = useState(null), [err, setErr] = useState('')
  useEffect(() => { api.get('/admin/stats').then(setS).catch(e => setErr(e.message)) }, [])
  if (err) return <p className="err">{err}</p>
  if (!s) return <p className="mut">Loading…</p>
  const cards = [['Upcoming events', s.upcoming, '/admin/events'], ['Total events', s.events, '/admin/events'], ['Artists', s.artists, '/admin/artists'], ['Gallery images', s.gallery, '/admin/gallery'], ['Unread messages', s.unread, '/admin/messages'], ['Subscribers', s.subscribers, '/admin/subscribers']]
  return (<div><header className="ad-h"><div><h1>Dashboard</h1><p className="mut">Welcome back. Everything you change here updates the public website.</p></div></header>
    {!s.ticketUrlSet && <div className="warn">The ticket site URL is not set, so “Get tickets” buttons send visitors to the contact page. <Link className="lk" to="/admin/settings">Set it in Settings →</Link></div>}
    <div className="cards">{cards.map(([l, n, to]) => <Link key={l} to={to} className="stat"><b>{n}</b><span>{l}</span></Link>)}</div>
    <h2>Latest messages</h2>
    {s.recent.length ? <div className="tbl"><table><thead><tr><th>From</th><th>Type</th><th>Received</th></tr></thead><tbody>{s.recent.map(m => <tr key={m.id}><td>{!m.is_read && <i className="dot" />} {m.name} <span className="mut">· {m.email}</span></td><td>{m.type}</td><td>{fmt(m.created_at)}</td></tr>)}</tbody></table></div> : <p className="mut">No messages yet.</p>}
  </div>)
}

export function Messages() {
  const [rows, setRows] = useState(null), [open, setOpen] = useState(null), [err, setErr] = useState('')
  const load = () => api.get('/admin/messages').then(setRows).catch(e => setErr(e.message))
  useEffect(() => { load() }, [])
  const toggle = async (m) => { const next = !m.is_read; try { await api.patch(`/admin/messages/${m.id}`, { is_read: next }); setRows(rows.map(x => x.id === m.id ? { ...x, is_read: next ? 1 : 0 } : x)) } catch (e) { setErr(e.message) } }
  const show = (m) => { setOpen(open === m.id ? null : m.id); if (!m.is_read) toggle(m) }
  const del = async (m) => { if (!window.confirm('Delete this message?')) return; try { await api.del(`/admin/messages/${m.id}`); setRows(rows.filter(x => x.id !== m.id)) } catch (e) { setErr(e.message) } }
  return (<div><header className="ad-h"><div><h1>Messages</h1><p className="mut">Enquiries sent from the website contact form.</p></div></header>
    {err && <p className="err" role="alert">{err}</p>}
    {!rows ? <p className="mut">Loading…</p> : !rows.length ? <p className="mut empty">No messages yet.</p> :
      <div className="msgs">{rows.map(m => <article key={m.id} className={'msg' + (m.is_read ? '' : ' unread')}>
        <button className="mh" onClick={() => show(m)} aria-expanded={open === m.id}><span>{!m.is_read && <i className="dot" />} <b>{m.name}</b> <span className="mut">· {m.type}</span></span><span className="mut">{fmt(m.created_at)}</span></button>
        {open === m.id && <div className="mb"><p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p><div className="act"><a className="btn p sm" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your enquiry — THE COASTLINE EVENTS')}`}>Reply by email</a><button className="btn s sm" onClick={() => toggle(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button><button className="btn s sm danger" onClick={() => del(m)}>Delete</button></div></div>}
      </article>)}</div>}
  </div>)
}

export function Subscribers() {
  const [rows, setRows] = useState(null), [err, setErr] = useState('')
  const load = () => api.get('/admin/subscribers').then(setRows).catch(e => setErr(e.message))
  useEffect(() => { load() }, [])
  const del = async (r) => { if (!window.confirm(`Remove ${r.email}?`)) return; try { await api.del(`/admin/subscribers/${r.id}`); setRows(rows.filter(x => x.id !== r.id)) } catch (e) { setErr(e.message) } }
  return (<div><header className="ad-h"><div><h1>Subscribers</h1><p className="mut">{rows ? `${rows.length} newsletter sign-up${rows.length === 1 ? '' : 's'}` : ''}</p></div><a className="btn s sm" href="/api/admin/subscribers/export.csv">Export CSV</a></header>
    {err && <p className="err" role="alert">{err}</p>}
    {!rows ? <p className="mut">Loading…</p> : !rows.length ? <p className="mut empty">No subscribers yet.</p> :
      <div className="tbl"><table><thead><tr><th>Email</th><th>Subscribed</th><th /></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td>{r.email}</td><td>{fmt(r.created_at)}</td><td className="act"><button className="btn s sm danger" onClick={() => del(r)}>Remove</button></td></tr>)}</tbody></table></div>}
  </div>)
}

const SET = [['ticket_url', 'Ticket site URL', 'Where every “Get tickets” button sends visitors (https://…). Leave empty to send them to the contact page.'], ['email', 'Contact email'], ['phone', 'Phone'], ['location', 'Location'], ['instagram', 'Instagram URL'], ['facebook', 'Facebook URL'], ['tagline', 'Hero tagline'], ['description', 'Brand description']]
export function Settings() {
  const [v, setV] = useState(null), [msg, setMsg] = useState({ t: '', c: '' }), [busy, setBusy] = useState(false)
  useEffect(() => { api.get('/admin/settings').then(setV).catch(e => setMsg({ t: e.message, c: 'err' })) }, [])
  const save = async (e) => { e.preventDefault(); setBusy(true); setMsg({ t: '', c: '' }); try { setV(await api.put('/admin/settings', v)); setMsg({ t: 'Saved. The website now uses these values.', c: 'ok' }) } catch (x) { setMsg({ t: x.message, c: 'err' }) } finally { setBusy(false) } }
  if (!v) return <p className={msg.c || 'mut'}>{msg.t || 'Loading…'}</p>
  return (<div><header className="ad-h"><div><h1>Settings</h1><p className="mut">Site-wide details.</p></div></header>
    <form className="adform wide" onSubmit={save} noValidate>{SET.map(([k, l, h]) => <div className="fld" key={k}><label htmlFor={'s_' + k}>{l}</label>
      {k === 'description' ? <textarea id={'s_' + k} rows={3} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /> : <input id={'s_' + k} type="text" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />}{h && <small className="mut">{h}</small>}</div>)}
      {msg.t && <p className={msg.c} role="status">{msg.t}</p>}<button className="btn p" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></form></div>)
}
