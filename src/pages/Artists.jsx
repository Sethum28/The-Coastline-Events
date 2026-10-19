import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Coverflow from '../components/Coverflow.jsx'
import Tilt from '../components/Tilt.jsx'
import { ARTISTS, EVENTS } from '../data/site.js'
export function Artists() {
  const [q, setQ] = useState(''), l = ARTISTS.filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
  return (<section className="pg"><div className="wrap"><div className="eyebrow">Lineups</div><h1 className="h2">Artists</h1><Coverflow />
    <div className="tools" style={{ marginTop: 56 }}><label className="srch">Search artists<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" /></label></div>
    <div className="ag persp">{l.map(a => <Link key={a.slug} to={`/artists/${a.slug}`}><Tilt max={10} className="pt"><img src={a.img} alt={`${a.name} — DJ portrait`} loading="lazy" style={{ '--pos': a.pos }} /><h3>{a.name}</h3></Tilt></Link>)}</div>
    {!l.length && <p className="mut">No artists found.</p>}</div></section>)
}
export function ArtistDetail() {
  const { slug } = useParams(), a = ARTISTS.find(x => x.slug === slug)
  if (!a) return <section className="pg"><div className="wrap"><h1 className="h2">Artist not found</h1><Link className="btn p" to="/artists">All artists</Link></div></section>
  const ev = EVENTS.filter(e => e.artists.includes(a.slug))
  return (<section className="pg"><div className="wrap two"><div className="persp"><Tilt max={8} className="apic"><img src={a.img} alt={`${a.name} — DJ portrait`} style={{ '--pos': a.pos }} /></Tilt></div>
    <div><div className="eyebrow">Artist</div><h1 className="h2">{a.name}</h1><p className="lead">{a.bio}</p><h3>Events</h3>
      {ev.length ? <ul className="plain">{ev.map(e => <li key={e.slug}><Link className="lk" to={`/events/${e.slug}`}>{e.title}</Link></li>)}</ul> : <p className="mut">No events announced yet.</p>}
      <br /><Link className="btn s" to="/artists">← All artists</Link></div></div></section>)
}
