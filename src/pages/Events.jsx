import { useMemo, useState } from 'react'
import EventCard from '../components/EventCard.jsx'
import { EVENTS, SERIES, ARTISTS } from '../data/site.js'
import { isPast } from '../utils.js'
// Serves /events and the concept pages /events/soiree, /one-love, /exclusive
export default function Events({ concept }) {
  const [q, setQ] = useState(''), [cat, setCat] = useState(concept || 'all'), [view, setView] = useState('upcoming'), [asc, setAsc] = useState(true)
  const s = concept ? SERIES[concept] : null
  const list = useMemo(() => EVENTS.filter(e => (cat === 'all' || e.series === cat) && (view === 'past') === isPast(e.date)
    && (e.title + e.artists.map(a => ARTISTS.find(x => x.slug === a)?.name).join(' ')).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (asc ? 1 : -1) * (new Date(a.date) - new Date(b.date))), [q, cat, view, asc])
  return (<section className="pg" style={s ? { '--lime': s.color } : undefined}><div className="wrap">
    <div className={s ? 'chero' : undefined} style={s ? { '--img': `url(${s.img})` } : undefined}><div className="eyebrow">{s ? s.motif : 'Discover'}</div><h1 className="h2">{s ? s.name : 'Events'}</h1>{s && <p className="lead">{s.line} {s.blurb}</p>}</div>
    <div className="tools">
      {!concept && <div className="filters" role="group" aria-label="Category">{['all', ...Object.keys(SERIES)].map(k => <button key={k} className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{k === 'all' ? 'All Events' : SERIES[k].name}</button>)}</div>}
      <div className="filters"><button className="chip" aria-pressed={view === 'upcoming'} onClick={() => setView('upcoming')}>Upcoming</button><button className="chip" aria-pressed={view === 'past'} onClick={() => setView('past')}>Past</button><button className="chip" onClick={() => setAsc(!asc)}>Date {asc ? '↑' : '↓'}</button></div>
      <label className="srch">Search event or artist<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" /></label></div>
    {list.length ? <div className="grid persp">{list.map(e => <EventCard key={e.slug} e={e} />)}</div> : <p className="mut">{concept ? `No ${SERIES[concept].name} events announced yet — follow @thecoastlineevents for updates.` : 'No events match your search.'}</p>}
    <p className="mut sm-t">More dates announced soon.</p></div></section>)
}
