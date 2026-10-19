import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GALLERY, SERIES } from '../data/site.js'
function Media({ g, eager }) {
  const [ok, setOk] = useState(!!g.src), [ld, setLd] = useState(false)
  return ok ? <img src={g.src} alt={g.alt} loading={eager ? 'eager' : 'lazy'} className={ld ? 'ld' : ''} onLoad={() => setLd(true)} onError={() => setOk(false)} />
    : <span className="ph" role="img" aria-label={g.alt}>{SERIES[g.cat].name}<small>Demo asset — replace with client photo</small></span>
}
function Lightbox({ list, i, setI, onClose }) {
  const btn = useRef(null), n = list.length, g = list[i]
  useEffect(() => {
    btn.current?.focus(); document.body.style.overflow = 'hidden'
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') setI((i + 1) % n); if (e.key === 'ArrowLeft') setI((i - 1 + n) % n) }
    addEventListener('keydown', k); return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [i, n, onClose, setI])
  return (<motion.div data-lenis-prevent className="lb" role="dialog" aria-modal="true" aria-label="Gallery viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <button ref={btn} className="lbx" onClick={onClose} aria-label="Close">✕</button>
    <button className="lbn l" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous image">←</button>
    <motion.figure key={g.id} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ aspectRatio: g.ar }}><Media g={g} eager /><figcaption>{g.alt} · {i + 1} / {n}</figcaption></motion.figure>
    <button className="lbn r" onClick={() => setI((i + 1) % n)} aria-label="Next image">→</button></motion.div>)
}
export default function Gallery() {
  const [cat, setCat] = useState('all'), [open, setOpen] = useState(null)
  const list = GALLERY.filter(g => cat === 'all' || g.cat === cat)
  return (<section className="pg"><div className="wrap"><div className="eyebrow">Experience</div><h1 className="h2">Gallery</h1>
    <div className="filters" role="group" aria-label="Gallery category" style={{ marginBottom: 30 }}>{['all', ...Object.keys(SERIES)].map(k => <button key={k} className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{k === 'all' ? 'All' : SERIES[k].name}</button>)}</div>
    <div className="masonry">{list.map((g, i) => <button key={g.id} className="gt" style={{ '--bgc': SERIES[g.cat].bg, aspectRatio: g.ar }} onClick={() => setOpen(i)} aria-label={`Open image: ${g.alt}`}><Media g={g} /></button>)}</div>
    <p className="mut sm-t">Stills come from client-supplied videos. Placeholders mark where licensed photos should go (public/images/gallery, src/data/site.js).</p></div>
    <AnimatePresence>{open !== null && list[open] && <Lightbox list={list} i={open} setI={setOpen} onClose={() => setOpen(null)} />}</AnimatePresence></section>)
}
