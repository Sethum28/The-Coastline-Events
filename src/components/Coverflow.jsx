import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ARTISTS } from '../data/site.js'
// 3D coverflow carousel: arrows, swipe/drag, click a side card, ← → keys. Infinite loop.
export default function Coverflow({ items = ARTISTS }) {
  const n = items.length, [a, setA] = useState(Math.min(2, n - 1)), d = useRef({ x: 0, moved: false })
  const step = (k) => setA(x => (x + k + n) % n), last = useRef(0), go = (k) => { last.current = Date.now(); step(k) }, cur = items[a]
  const [play, setPlay] = useState(true), [vis, setVis] = useState(true), root = useRef(null)
  useEffect(() => { const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { threshold: .2 }); io.observe(root.current); return () => io.disconnect() }, [])
  useEffect(() => { if (!play || !vis) return; const t = setInterval(() => { if (Date.now() - last.current > 5000) step(1) }, 3000); return () => clearInterval(t) }, [play, vis])
  const up = (e) => { const dx = e.clientX - d.current.x; if (Math.abs(dx) > 50) { d.current.moved = true; go(dx < 0 ? 1 : -1) } }
  return (<div className="cf" ref={root}>
    <div className="cf-info" aria-live="polite"><span className="eyebrow">Artist {a + 1} / {n}</span><h3>{cur.name}</h3><p className="mut">{cur.bio}</p><Link className="lk" to={`/artists/${cur.slug}`}>View profile →</Link></div>
    <div className="cf-stage" tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Artists"
      onPointerDown={(e) => { d.current = { x: e.clientX, moved: false } }} onPointerUp={up}
      onClickCapture={(e) => { if (d.current.moved) { e.preventDefault(); e.stopPropagation(); d.current.moved = false } }}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}>
      {items.map((it, i) => {
        let off = i - a; if (off > n / 2) off -= n; if (off < -n / 2) off += n
        const abs = Math.abs(off), style = { transform: `translate(-50%,-50%) translateX(calc(var(--sp) * ${off})) translateZ(calc(var(--zd) * ${-abs})) rotateY(${-Math.sign(off) * Math.min(abs, 2) * 30}deg) scale(${off === 0 ? 1.1 : 1})`, zIndex: 10 - abs, opacity: abs >= 3 ? 0 : 1, pointerEvents: abs >= 3 ? 'none' : 'auto', filter: off === 0 ? 'none' : 'brightness(.5)' }
        const inner = <><img src={it.img} alt={`${it.name} — DJ portrait`} loading="lazy" draggable="false" style={{ '--pos': it.pos }} /><span className="cf-n">{it.name}</span></>
        return off === 0 ? <Link key={it.slug} to={`/artists/${it.slug}`} className="cf-card on" style={style} aria-label={`${it.name} — view profile`}>{inner}</Link>
          : <button key={it.slug} className="cf-card" style={style} onClick={() => { last.current = Date.now(); setA(i) }} aria-label={`Show ${it.name}`} tabIndex={abs >= 3 ? -1 : 0}>{inner}</button>
      })}
    </div>
    <div className="cf-arrows"><button className="chip" aria-label="Previous artist" onClick={() => go(-1)}>←</button><button className="chip" aria-label="Next artist" onClick={() => go(1)}>→</button><button className="chip" aria-pressed={!play} aria-label={play ? "Pause autoplay" : "Play autoplay"} onClick={() => setPlay(!play)}>{play ? "❚❚" : "▶"}</button></div>
  </div>)
}
