import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE, SERIES } from '../data/site.js'
import { validEmail } from '../utils.js'
import { submitContact } from '../services/api.js'
export function About() {
  return (<section className="pg"><div className="wrap"><div className="eyebrow">About</div><h1 className="h2">THE COASTLINE EVENTS</h1>
    <p className="lead">{SITE.description}</p><p>Beyond the beats, we create experiences that bring music, people, and the coastline together. Based in {SITE.location}.</p><br />
    <div className="con">{Object.entries(SERIES).map(([k, s]) => <div key={k} className="cc c1" style={{ minHeight: 0 }}><h3 style={{ color: s.color }}>{s.name}</h3><p>{s.blurb}</p><Link className="btn s" to={`/events/${k}`}>Explore</Link></div>)}</div></div></section>)
}
export function Contact() {
  const [f, setF] = useState({ name: '', email: '', type: 'Event booking', message: '' }), [m, setM] = useState({ t: '', c: '' })
  const go = async (e) => { e.preventDefault(); if (!f.name.trim() || !validEmail(f.email) || f.message.trim().length < 5) return setM({ t: 'Please enter your name, a valid email and a message.', c: 'err' }); setM({ t: 'Sending…', c: '' }); try { await submitContact(f); setM({ t: 'Thanks — we will get back to you soon.', c: 'ok' }); setF({ ...f, name: '', email: '', message: '' }) } catch (err) { setM({ t: err.message, c: 'err' }) } }
  return (<section className="pg"><div className="wrap two"><div><div className="eyebrow">Contact</div><h1 className="h2">Let's talk.</h1><p>{SITE.email}<br />{SITE.phone}<br />{SITE.location}</p><br /><a className="btn s" href={SITE.instagram} target="_blank" rel="noopener noreferrer">@thecoastlineevents</a></div>
    <form onSubmit={go} noValidate><label>Name<input value={f.name} autoComplete="name" onChange={e => setF({ ...f, name: e.target.value })} /></label><label>Email<input type="email" value={f.email} autoComplete="email" onChange={e => setF({ ...f, email: e.target.value })} /></label>
      <label>Enquiry type<select value={f.type} onChange={e => setF({ ...f, type: e.target.value })}><option>Event booking</option><option>Private event</option><option>Artist / brand collaboration</option></select></label>
      <label>Message<textarea rows="4" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} /></label><p className={m.c} role="status">{m.t}</p><button className="btn p">Send message</button></form></div></section>)
}
