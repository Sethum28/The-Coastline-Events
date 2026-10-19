import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TicketLink from '../components/TicketLink.jsx'
import { EVENTS, SERIES, ARTISTS } from '../data/site.js'
import { fmtDate, isPast } from '../utils.js'
export default function EventDetail() {
  const { slug } = useParams(), e = EVENTS.find(x => x.slug === slug), [cp, setCp] = useState('')
  if (!e) return <section className="pg"><div className="wrap"><h1 className="h2">Event not found</h1><Link className="btn p" to="/events">Back to events</Link></div></section>
  const s = SERIES[e.series], past = isPast(e.date), off = e.status === 'Sold out' || past, rel = EVENTS.filter(x => x.series === e.series && x.slug !== e.slug)
  const share = async () => { const u = location.href; if (navigator.share) { try { await navigator.share({ title: e.title, url: u }) } catch {} } else { try { await navigator.clipboard.writeText(u); setCp('Link copied') } catch { setCp(u) } } }
  return (<section className="pg" style={{ '--lime': s.color }}><div className="wrap">
    <div className="hero-card" style={e.img ? { backgroundImage: `linear-gradient(180deg,#0000 40%,#000b),url(${e.img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: s.bg }}><span className="tag" style={{ '--c': s.color }}>{s.name}</span></div>
    <h1 className="h2">{e.title}</h1><p className="lead">{fmtDate(e.date)} · {e.time} · {e.venue}</p><span className="st">{past ? 'Past event' : e.status}</span>
    <p style={{ margin: '20px 0' }}>{e.desc}</p>
    {e.artists.length > 0 && <><h3>Lineup</h3><p>{e.artists.map(a => <Link key={a} className="lk" to={`/artists/${a}`}>{ARTISTS.find(x => x.slug === a)?.name}</Link>)}</p><br /></>}
    <p className="mut">Tickets are sold on our ticketing site.</p><br />
    <div className="cta">{off ? <button className="btn p" disabled>{past ? 'Event ended' : 'Sold out'}</button> : <TicketLink url={e.ticketUrl} />}<button className="btn s" onClick={share}>Share</button></div><p className="ok" role="status">{cp}</p>
    {rel.length > 0 && <><br /><h3>Related events</h3><p>{rel.map(r => <Link key={r.slug} className="lk" to={`/events/${r.slug}`}>{r.title}</Link>)}</p></>}</div></section>)
}
