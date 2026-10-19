import { Link } from 'react-router-dom'
import Tilt from './Tilt.jsx'
import TicketLink from './TicketLink.jsx'
import { SERIES } from '../data/site.js'
import { fmtDate, isPast } from '../utils.js'
export default function EventCard({ e }) {
  const s = SERIES[e.series], past = isPast(e.date), off = e.status === 'Sold out' || past, d = new Date(e.date)
  return (<Tilt as="article" max={8} className="card" style={{ '--c': s.color, '--bgc': s.bg }}>
    <div className={'art' + (e.img ? ' has-img' : '')} style={e.img ? { backgroundImage: `linear-gradient(180deg,#0000 35%,#000b),url(${e.img})` } : undefined}><span className="tag">{s.name}</span>
      <span className="date"><b>{d.getDate()}</b><i>{d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</i></span></div>
    <div className="cb"><span className="st">{past ? 'Past event' : e.status}</span>
      <h3>{e.title}</h3><small className="mut">{fmtDate(e.date)} · {e.venue}</small>
      <div className="row"><Link className="btn s sm" to={`/events/${e.slug}`}>Explore</Link>
        {off ? <button className="btn p sm" disabled>{past ? 'Ended' : 'Sold out'}</button> : <TicketLink url={e.ticketUrl} className="btn p sm" />}</div></div>
  </Tilt>)
}
