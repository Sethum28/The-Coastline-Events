import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import FooterWord from './FooterWord.jsx'
import TicketLink from './TicketLink.jsx'
import { ScrollProgress, CursorGlow, Magnetic, SmoothScroll, lenis } from './Effects.jsx'
import Intro, { introSeen } from './Intro.jsx'
import { SITE } from '../data/site.js'
const LINKS = [['/', 'Home'], ['/events', 'Events'], ['/events/soiree', 'Soirée'], ['/events/one-love', 'One Love'], ['/events/exclusive', 'Exclusive'], ['/artists', 'Artists'], ['/gallery', 'Gallery'], ['/about', 'About'], ['/contact', 'Contact'], ['/faq', 'FAQ']]
export default function Layout() {
  const first = useRef(true), { pathname } = useLocation(), outlet = useOutlet(), rm = useReducedMotion(), [sc, setSc] = useState(false), [open, setOpen] = useState(false)
  const [intro, setIntro] = useState(() => pathname === '/' && !introSeen() && !matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { const f = () => setSc(scrollY > 40); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  useEffect(() => { setOpen(false); lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0) }, [pathname])
  useEffect(() => { first.current = false }, [])
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(false); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  return (<>
    {intro && <Intro onDone={() => setIntro(false)} />}
    <SmoothScroll /><ScrollProgress /><CursorGlow /><Magnetic />
    
    <nav className={sc || pathname !== '/' ? 'sc' : ''}><div className="wrap nv">
      <Link to="/" className="logo" aria-label="THE COASTLINE EVENTS home"><img src="/logo.jpg" alt="" /><span>THE COASTLINE EVENTS</span></Link>
      <div className="nr"><TicketLink className="btn p sm hide-s">Get Tickets</TicketLink><button className="menubtn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button></div>
    </div></nav>
    <div id="menu" data-lenis-prevent className={'menu' + (open ? ' o' : '')} aria-hidden={!open}><div className="wrap mg">
      <ol>{LINKS.map(([to, l], i) => <li key={l} style={{ '--i': i }}><Link to={to} tabIndex={open ? 0 : -1}><small>0{i + 1}</small>{l}</Link></li>)}</ol>
      <div className="mi"><p className="eyebrow">Contact</p><a href={`mailto:${SITE.email}`}>{SITE.email}</a><a href="tel:+94777137266">{SITE.phone}</a><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">@thecoastlineevents</a><TicketLink className="btn p" tabIndex={open ? 0 : -1}>Get Tickets</TicketLink></div></div></div>
    <TicketLink className="btn p tkfab">Get Tickets</TicketLink>
    <motion.div key={"c" + pathname} className="curtain" aria-hidden="true" initial={{ scaleY: first.current ? 0 : 1 }} animate={{ scaleY: 0 }} transition={{ duration: rm ? 0 : .8, ease: [.7, 0, .2, 1] }} />
    <AnimatePresence mode="wait"><motion.main key={pathname} initial={rm ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={rm ? undefined : { opacity: 0, y: -16 }} transition={{ duration: rm ? 0 : .35, ease: [.2, .7, .2, 1] }}>{outlet}</motion.main></AnimatePresence>
    <footer><div className="wrap"><div className="fg">
      <div><div className="logo"><img src="/logo.jpg" alt="" /><span>THE COASTLINE EVENTS</span></div><p className="mut" style={{ marginTop: 14, maxWidth: 320 }}>Beyond the beats, conducting the best accompanied coastal events to your shores.</p></div>
      <div><h4>Explore</h4><Link to="/events">Events</Link><Link to="/artists">Artists</Link><Link to="/gallery">Gallery</Link><Link to="/about">About</Link><Link to="/faq">FAQ</Link></div>
      <div><h4>Concepts</h4><Link to="/events/soiree">Soirée</Link><Link to="/events/one-love">One Love</Link><Link to="/events/exclusive">Exclusive</Link></div>
      <div><h4>Contact</h4><a href={`mailto:${SITE.email}`}>{SITE.email}</a><a href="tel:+94777137266">{SITE.phone}</a><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">@thecoastlineevents</a></div>
    </div><FooterWord />
    <p className="mut c">© 2026 THE COASTLINE EVENTS · <Link className="lk" to="/privacy-policy">Privacy Policy</Link><Link className="lk" to="/terms">Terms</Link> Tickets are sold on our ticketing site. Event details are demo content until confirmed.</p></div></footer></>)
}
