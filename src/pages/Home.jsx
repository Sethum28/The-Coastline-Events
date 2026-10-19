import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero3D from '../components/Hero3D.jsx'
import Cube3D from '../components/Cube3D.jsx'
import Tilt from '../components/Tilt.jsx'
import EventCard from '../components/EventCard.jsx'
import { HeroParallax } from '../components/Effects.jsx'
import Coverflow from '../components/Coverflow.jsx'
import TicketLink from '../components/TicketLink.jsx'
import { SITE, SERIES, EVENTS, ARTISTS } from '../data/site.js'
import { isPast, validEmail, daysUntil } from '../utils.js'
import { subscribe } from '../services/api.js'
const WORDS = ['BEATS.', 'COAST.', 'NIGHT.', 'SUNSET.']
function Rail({ children }) {
  const r = useRef(null), d = useRef({ on: false, x: 0, s: 0 })
  const by = (n) => r.current.scrollBy({ left: n, behavior: 'smooth' })
  return (<div><div className="rail" ref={r}
    onPointerDown={(e) => { if (e.pointerType === 'mouse') d.current = { on: true, x: e.clientX, s: r.current.scrollLeft } }}
    onPointerMove={(e) => { if (d.current.on) r.current.scrollLeft = d.current.s - (e.clientX - d.current.x) }}
    onPointerUp={() => (d.current.on = false)} onPointerLeave={() => (d.current.on = false)}>{children}</div>
    <div className="arrows"><button className="chip" aria-label="Previous" onClick={() => by(-360)}>←</button><button className="chip" aria-label="Next" onClick={() => by(360)}>→</button></div></div>)
}
// Words light up one by one as you scroll through this tall sticky section.
function Manifesto() {
  const ref = useRef(null), words = 'Beyond the beats, we create experiences that bring music, people, and the coastline together.'.split(' ')
  useEffect(() => {
    const el = ref.current, sp = [...el.querySelectorAll('.mw')]
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { sp.forEach(s => (s.style.opacity = 1)); return }
    const f = () => { const r = el.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); sp.forEach((s, i) => { s.style.opacity = Math.min(1, Math.max(.14, p * 1.2 * sp.length - i)) }) }
    f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])
  return <section className="manifesto" ref={ref} aria-label="Manifesto"><div className="mstick"><div className="sn">MANIFESTO</div><p>{words.map((w, i) => <span className="mw" key={i}>{w} </span>)}</p></div></section>
}
function CountUp({ to, dec = 0, suf = '' }) {
  const [v, setV] = useState(0), r = useRef(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); const t0 = performance.now(); const f = (t) => { const p = Math.min(1, (t - t0) / 1400); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f) }; requestAnimationFrame(f) }, { threshold: .4 })
    io.observe(r.current); return () => io.disconnect()
  }, [to])
  return <b ref={r}>{v.toFixed(dec)}{suf}</b>
}
// Only facts we can stand behind: concepts, Facebook followers (from the client's page), artists and events listed.
function Stats({ events }) {
  const items = [[3, 0, '', 'Event concepts'], [7.5, 1, 'K+', 'Facebook followers'], [ARTISTS.length, 0, '', 'Featured artists'], [events, 0, '', events === 1 ? 'Upcoming event' : 'Upcoming events']]
  return <section className="stats"><div className="wrap">{items.map(([to, dec, suf, l]) => <div key={l}><CountUp to={to} dec={dec} suf={suf} /><span>{l}</span></div>)}</div></section>
}
function Featured({ e }) {
  const s = SERIES[e.series], dd = daysUntil(e.date), [y, m, d] = e.date.split('-').map(Number), mon = new Date(y, m - 1, d).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  return (<div className="feat persp" style={{ '--c': s.color }}>
    <Tilt max={6} className="fposter" style={{ backgroundImage: `linear-gradient(180deg,#0000 30%,#000c),url(${e.img})` }}><span className="tag" style={{ '--c': s.color }}>{s.name}</span></Tilt>
    <div className="finfo"><div className="fdate"><b>{String(d).padStart(2, '0')}</b><span>{mon} {y}</span></div><h3>{e.title}</h3><p className="mut">{e.time} · {e.venue}</p>
      {dd >= 0 && <p className="fcd"><b>{dd}</b> {dd === 1 ? 'day' : 'days'} to go</p>}
      <div className="cta"><TicketLink url={e.ticketUrl} /><Link className="btn s" to={`/events/${e.slug}`}>Event details</Link></div></div></div>)
}
export default function Home() {
  const [em, setEm] = useState(''), [msg, setMsg] = useState({ t: '', c: '' }), [w, setW] = useState(0)
  const up = EVENTS.filter(e => !isPast(e.date))
  useEffect(() => { const i = setInterval(() => setW(x => (x + 1) % WORDS.length), 2400); return () => clearInterval(i) }, [])
  useEffect(() => { const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 }); document.querySelectorAll('.rv').forEach(x => io.observe(x)); return () => io.disconnect() }, [])
  const sub = async (e) => { e.preventDefault(); if (!validEmail(em)) return setMsg({ t: 'Please enter a valid email.', c: 'err' }); setMsg({ t: 'Subscribing…', c: '' }); try { await subscribe(em); setMsg({ t: 'Thanks — you are on the list.', c: 'ok' }); setEm('') } catch (err) { setMsg({ t: err.message, c: 'err' }) } }
  const hv = (e, on) => { const v = e.currentTarget.querySelector('video'); if (v) on ? v.play().catch(() => {}) : v.pause() }
  return (<>
    <HeroParallax />
    <header className="hero">
      <video autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src="/videos/hero.mp4" type="video/mp4" /></video>
      <div className="shade" /><Hero3D />
      <div className="wrap hg"><div>
        <div className="eyebrow">Sri Lanka · Music · Coastal Experiences</div>
        <Tilt max={6} className="brand3d"><h1 aria-label={SITE.name}><span className="l1">THE</span><span className="l2">COASTLINE</span><span className="l3">EVENTS</span></h1></Tilt>
        <p className="tl" aria-label="Beyond the beats">BEYOND THE <span className="wf"><span key={w} className="wd">{WORDS[w]}</span></span></p>
        <div className="cta"><Link className="btn p" to="/events">Explore Events</Link><a className="btn s" href="#chapters">Discover Our World</a></div></div>
        <div className="persp lg-wrap"><div className="ring" aria-hidden="true" /><Tilt max={16} className="logo3d"><img src="/logo.jpg" alt="SOIRÉE — Open to Close — by The Coastline Events" /></Tilt><span className="lg-cap" aria-hidden="true">OPEN — CLOSE</span></div></div>
      <div className="hmeta">{up[0] ? <Link className="nxt" to={`/events/${up[0].slug}`}><i />NEXT · {up[0].title} · {new Date(up[0].date.split("-")[0], up[0].date.split("-")[1] - 1, up[0].date.split("-")[2]).toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase()}</Link> : <span>MUSIC · COAST · STORY</span>}<span className="scroll" aria-hidden="true" /></div>
    </header>
    <div className="mq" aria-hidden="true"><div>{Array(4).fill(['Every night is a shoreline', 'Open — Close', 'Soirée', 'One Love', 'The Coastline Exclusive']).flat().map((x, i) => <span key={i}>{x}</span>)}</div></div>

    <Manifesto />
    <Stats events={up.length} />

    <section id="chapters"><div className="wrap rv"><div className="sn">01 /</div><h2 className="h2">Next <em className="ac">chapters</em></h2>{up[0] ? <Featured e={up[0]} /> : <p className="mut">New dates announced soon.</p>}{up.length > 1 && <Rail>{up.slice(1).map(e => <div className="slot" key={e.slug}><EventCard e={e} /></div>)}</Rail>}
      <p className="mut sm-t">More dates announced soon. <Link to="/events" className="lk">All events →</Link></p></div></section>

    <section className="alt"><div className="wrap rv"><div className="sn">02 /</div><h2 className="h2">Three <em className="ac">formats</em></h2><p className="lead">Same lineup, same room, same night? Not here. Each concept has its own sound, light and space.</p>
      <div className="fms">{Object.entries(SERIES).map(([k, s], i) => <Link key={k} to={`/events/${k}`} className={'fm f' + (i + 1)} style={{ '--c': s.color, '--bgc': s.bg }} onMouseEnter={e => hv(e, true)} onMouseLeave={e => hv(e, false)}>
        <video muted loop playsInline preload="none" poster={s.img} aria-hidden="true"><source src={s.video} type="video/mp4" /></video>
        <span className="fn">0{i + 1}</span><span className="ft"><b>{s.name}</b><small>{s.line}</small><em>{s.blurb}</em></span><span className="fa">↗</span></Link>)}</div></div></section>

    <section><div className="wrap two rv"><div><div className="sn">03 /</div><h2 className="h2">Step inside the <em className="ac">brand</em></h2><p className="lead">Our signature mark, in 3D. Grab it and turn it around.</p><p className="mut">3D · DRAG TO ROTATE</p></div>
      <div className="cubebox"><Cube3D /></div></div></section>

    <section className="alt"><div className="wrap story rv"><div><div className="sn">04 /</div><h2 className="h2">Music, people &amp; the <em className="ac">coastline.</em></h2>
      <p className="lead">Every gathering is built around three things: the sound, the shoreline and the people who show up for both.</p>
      <ul>{['Music & culture', 'Coastal experiences', 'Community', 'Curated events', 'Memorable moments'].map(x => <li key={x}>{x}</li>)}</ul></div>
      <div className="persp"><Tilt max={8} className="vid"><video autoPlay muted loop playsInline preload="metadata" aria-label="Event highlights reel"><source src="/videos/story.mp4" type="video/mp4" /></video><span className="vtag">HIGHLIGHTS</span></Tilt></div></div></section>

    <section><div className="wrap rv"><div className="sn">05 /</div><h2 className="h2"><em className="ac">Moments</em></h2><div className="mom persp">{['one-love', 'exclusive'].map(k => <Link key={k} to={`/events/${k}`}><Tilt max={6} className="mp"><img src={SERIES[k].img} alt={SERIES[k].alt} loading="lazy" /><span className="tag" style={{ '--c': SERIES[k].color }}>{SERIES[k].name}</span></Tilt></Link>)}</div></div></section>

    <section className="alt"><div className="wrap rv"><div className="sn">06 /</div><h2 className="h2">The <em className="ac">artists</em></h2><Coverflow /></div></section>

    <section className="band"><div className="wrap rv"><div className="eyebrow">Next stop</div><h2 className="h2">Your night starts <em className="ac">here.</em></h2><TicketLink className="btn p">Get tickets</TicketLink></div></section>

    <section className="alt"><div className="wrap rv"><div className="news"><div className="sn">07 /</div><h2 className="h2">Side A — early announcements</h2>
      <form onSubmit={sub} noValidate className="nf"><label>Email<input type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="you@email.com" aria-invalid={msg.c === 'err'} /></label><button className="btn p">Subscribe</button></form><p className={msg.c} role="status">{msg.t}</p></div></div></section>
    </>)
}
