import { useEffect, useRef, useState } from 'react'
let seen = false
export const introSeen = () => seen
// Preloader: counter 000→100, then the SOIRÉE logo-reveal video plays (muted) and the intro fades out.
export default function Intro({ onDone }) {
  const [p, setP] = useState(0), [playing, setPlaying] = useState(false), [out, setOut] = useState(false), v = useRef(null)
  const finish = () => { setOut(true); setTimeout(() => { seen = true; onDone() }, 800) }
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])
  useEffect(() => {
    let n = 0
    const i = setInterval(() => {
      n = Math.min(100, n + Math.random() * 9 + 2); setP(Math.floor(n))
      if (n >= 100) { clearInterval(i); setPlaying(true); const el = v.current; el.muted = true; el.currentTime = 0; el.play().catch(finish) }
    }, 80)
    return () => clearInterval(i)
  }, [])
  return (<div data-lenis-prevent className={'intro' + (out ? ' out' : '')} role="dialog" aria-label="Intro">
    <video ref={v} className={playing ? 'on' : ''} muted playsInline preload="auto" onEnded={finish}><source src="/videos/logo-reveal.mp4" type="video/mp4" /></video>
    {!playing && <div className="ic"><img src="/logo.jpg" alt="" className="il" /><div className="cnt" aria-live="off">{String(p).padStart(3, '0')}</div><div className="eyebrow">THE COASTLINE EVENTS</div></div>}
    <button className="skip" onClick={finish}>Skip ↗</button></div>)
}
