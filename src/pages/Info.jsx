import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FAQS, SITE } from '../data/site.js'
export function Faq() {
  const [o, setO] = useState(0)
  return (<section className="pg"><div className="wrap narrow"><div className="eyebrow">Help</div><h1 className="h2">FAQ</h1>
    {FAQS.map(([q, a], i) => <div className="fq" key={q}><h2><button aria-expanded={o === i} aria-controls={`fa${i}`} onClick={() => setO(o === i ? -1 : i)}><span>{q}</span><b>{o === i ? '−' : '+'}</b></button></h2>
      <AnimatePresence initial={false}>{o === i && <motion.div id={`fa${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}><p>{a}</p></motion.div>}</AnimatePresence></div>)}
    <p style={{ marginTop: 30 }}>More questions? <Link className="lk" to="/contact">Contact us</Link></p></div></section>)
}
const Legal = ({ title, children }) => <section className="pg"><div className="wrap narrow legal"><div className="eyebrow">Legal</div><h1 className="h2">{title}</h1>
  <p className="dm">Draft template — to be reviewed and finalised (ideally by a legal professional) before launch. Last updated: 13 October 2026.</p>{children}</div></section>
export function Privacy() {
  return (<Legal title="Privacy Policy">
    <h2>Who we are</h2><p>THE COASTLINE EVENTS, {SITE.location}. Contact: {SITE.email}.</p>
    <h2>What we collect</h2><p>Information you submit through the contact form or newsletter (such as your name, email address and message). In this prototype nothing is transmitted or stored; once a backend is connected, this section will be updated.</p>
    <h2>How we use it</h2><p>To reply to enquiries and send event announcements you asked for. We do not sell personal data.</p>
    <h2>Payments</h2><p>Tickets are sold on a separate ticketing website, which has its own privacy policy and payment handling. This website does not process payments or store card details.</p>
    <h2>Your choices</h2><p>You can ask to access, correct or delete your data, or unsubscribe from announcements, by emailing {SITE.email}.</p>
    <h2>Changes</h2><p>We may update this policy and will post the new version on this page.</p></Legal>)
}
export function Terms() {
  return (<Legal title="Terms and Conditions">
    <h2>Use of this website</h2><p>This website is a prototype. Events, artists, prices and availability shown are sample content and are not offers.</p>
    <h2>Tickets</h2><p>Tickets are sold through our separate ticketing website; its prices, availability and purchase conditions apply. Age restrictions and entry conditions will be shown per event once confirmed. Entry may be refused where event rules are not followed.</p>
    <h2>Refunds and changes</h2><p>Refund, transfer and cancellation terms are set per event and shown on the ticketing website before purchase.</p>
    <h2>Conduct</h2><p>Guests are expected to behave safely and respectfully toward others, venue staff and artists.</p>
    <h2>Liability</h2><p>To the extent permitted by law, THE COASTLINE EVENTS is not liable for indirect losses arising from use of this website.</p>
    <h2>Governing law</h2><p>These terms are governed by the laws of Sri Lanka (to be confirmed with legal counsel). Questions: {SITE.email}.</p></Legal>)
}
