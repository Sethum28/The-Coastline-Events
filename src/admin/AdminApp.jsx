import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './admin.css'
import { api } from './api.js'
import Resource from './Resource.jsx'
import { Dashboard, Messages, Subscribers, Settings } from './Pages.jsx'

const SERIES = [['soiree', 'SOIRÉE'], ['one-love', 'ONE LOVE'], ['exclusive', 'THE COASTLINE EXCLUSIVE']]
const yes = (v) => <span className={'pill ' + (v ? 'on' : '')}>{v ? 'Published' : 'Hidden'}</span>
const thumb = (v) => (v ? <img className="th" src={v} alt="" loading="lazy" /> : <span className="mut">—</span>)

const EVENTS = { title: 'Events', path: '/admin/events', intro: 'Add, edit or hide events. Published events appear on the website automatically.',
  columns: [['img', '', thumb], ['title', 'Title'], ['series', 'Concept', (v) => (SERIES.find(s => s[0] === v) || [])[1]], ['event_date', 'Date'], ['status', 'Status'], ['published', 'Visible', yes]],
  blank: { status: 'Announced', series: 'soiree' },
  fields: [
    { key: 'title', label: 'Title', required: true, max: 190 },
    { key: 'series', label: 'Concept', type: 'select', options: SERIES, required: true },
    { key: 'event_date', label: 'Date', type: 'date', required: true },
    { key: 'event_time', label: 'Time', help: 'e.g. 8:00 PM – 4:00 AM, or leave empty for “Time to be announced”.' },
    { key: 'venue', label: 'Venue', help: 'Leave empty for “Venue to be announced”.' },
    { key: 'status', label: 'Status label', required: true, help: 'Shown on the card, e.g. Announced, On sale, Limited, Sold out. “Sold out” disables the ticket button.' },
    { key: 'img', label: 'Cover image', type: 'image' },
    { key: 'description', label: 'Description', type: 'textarea', max: 5000 },
    { key: 'artist_ids', label: 'Lineup', type: 'artists', help: 'Only tick artists who are confirmed.' },
    { key: 'ticket_url', label: 'Ticket link (optional)', help: 'Overrides the site-wide ticket URL for this event.' },
    { key: 'slug', label: 'URL slug (optional)', help: 'Auto-generated from the title if empty. Changing it changes the event’s web address.' },
    { key: 'published', label: 'Visible on website', type: 'checkbox', checkLabel: 'Published' },
  ] }
const ARTISTS = { title: 'Artists', path: '/admin/artists', intro: 'Order is set by “Sort order” (lowest first).',
  columns: [['img', '', thumb], ['name', 'Name'], ['sort_order', 'Order'], ['published', 'Visible', yes]], blank: { pos: '50% 50%', sort_order: 0 },
  fields: [
    { key: 'name', label: 'Name', required: true, max: 120 },
    { key: 'img', label: 'Photo', type: 'image' },
    { key: 'pos', label: 'Photo focus', help: 'Which part of the photo stays visible in the card, as “x% y%” — e.g. 50% 20% keeps the top centre.' },
    { key: 'bio', label: 'Bio', type: 'textarea', max: 3000 },
    { key: 'instagram', label: 'Instagram URL' }, { key: 'soundcloud', label: 'SoundCloud URL' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'slug', label: 'URL slug (optional)', help: 'Auto-generated from the name if empty.' },
    { key: 'published', label: 'Visible on website', type: 'checkbox', checkLabel: 'Published' },
  ] }
const GALLERY = { title: 'Gallery', path: '/admin/gallery', intro: 'Upload photos and assign them to a concept.',
  columns: [['src', '', thumb], ['alt', 'Description'], ['cat', 'Concept', (v) => (SERIES.find(s => s[0] === v) || [])[1]], ['sort_order', 'Order'], ['published', 'Visible', yes]], blank: { cat: 'soiree', ar: '3/2', sort_order: 0 },
  fields: [
    { key: 'src', label: 'Image', type: 'image', required: true },
    { key: 'alt', label: 'Description (alt text)', required: true, max: 255, help: 'Describe the photo — used by screen readers.' },
    { key: 'cat', label: 'Concept', type: 'select', options: SERIES, required: true },
    { key: 'ar', label: 'Shape', type: 'select', options: [['3/2', 'Landscape 3:2'], ['16/9', 'Wide 16:9'], ['4/5', 'Portrait 4:5'], ['1/1', 'Square']] },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'published', label: 'Visible on website', type: 'checkbox', checkLabel: 'Published' },
  ] }
const FAQS = { title: 'FAQs', path: '/admin/faqs', intro: 'Questions shown on the FAQ page.',
  columns: [['question', 'Question'], ['sort_order', 'Order'], ['published', 'Visible', yes]], blank: { sort_order: 0 },
  fields: [
    { key: 'question', label: 'Question', required: true, max: 190 }, { key: 'answer', label: 'Answer', type: 'textarea', required: true, max: 3000 },
    { key: 'sort_order', label: 'Sort order', type: 'number' }, { key: 'published', label: 'Visible on website', type: 'checkbox', checkLabel: 'Published' },
  ] }

function Login({ onDone }) {
  const [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const go = async (e) => { e.preventDefault(); setBusy(true); setErr(''); try { onDone(await api.post('/auth/login', f)) } catch (x) { setErr(x.message) } finally { setBusy(false) } }
  return (<div className="login"><form className="box" onSubmit={go} noValidate>
    <img src="/logo.jpg" alt="" /><h1>Admin</h1><p className="mut">THE COASTLINE EVENTS</p>
    <div className="fld"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
    <div className="fld"><label htmlFor="pw">Password</label><input id="pw" type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
    {err && <p className="err" role="alert">{err}</p>}<button className="btn p full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form></div>)
}

export default function AdminApp() {
  const [me, setMe] = useState(undefined), [nav, setNav] = useState(false)
  useEffect(() => { document.title = 'Admin — THE COASTLINE EVENTS'; api.get('/auth/me').then(setMe).catch(() => setMe(null)) }, [])
  const out = async () => { try { await api.post('/auth/logout') } finally { setMe(null) } }
  if (me === undefined) return <div className="boot" />
  if (!me) return <Login onDone={setMe} />
  const links = [['/admin', 'Dashboard', true], ['/admin/events', 'Events'], ['/admin/artists', 'Artists'], ['/admin/gallery', 'Gallery'], ['/admin/faqs', 'FAQs'], ['/admin/messages', 'Messages'], ['/admin/subscribers', 'Subscribers'], ['/admin/settings', 'Settings']]
  return (<div className="ad">
    <aside className={nav ? 'o' : ''}><div className="brand"><img src="/logo.jpg" alt="" /><span>COASTLINE<small>Admin</small></span></div>
      <div className="sidenav" role="navigation" aria-label="Admin">{links.map(([to, l, end]) => <NavLink key={to} to={to} end={end} onClick={() => setNav(false)}>{l}</NavLink>)}</div>
      <div className="foot"><a href="/" target="_blank" rel="noopener noreferrer">View website ↗</a><span className="mut">{me.email}</span><button className="btn s sm" onClick={out}>Sign out</button></div></aside>
    <main><button className="mnav" aria-expanded={nav} onClick={() => setNav(!nav)}>{nav ? 'Close' : 'Menu'}</button>
      <Routes><Route index element={<Dashboard />} />
        <Route path="events" element={<Resource {...EVENTS} />} /><Route path="artists" element={<Resource {...ARTISTS} />} /><Route path="gallery" element={<Resource {...GALLERY} />} /><Route path="faqs" element={<Resource {...FAQS} />} />
        <Route path="messages" element={<Messages />} /><Route path="subscribers" element={<Subscribers />} /><Route path="settings" element={<Settings />} /><Route path="*" element={<Navigate to="/admin" replace />} /></Routes></main></div>)
}
