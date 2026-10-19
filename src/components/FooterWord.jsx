import { useRef } from 'react'
// Full-width "THE COASTLINE EVENTS" wordmark. textLength guarantees it always fits the width (never cropped).
// A lime spotlight follows the cursor/finger and the word tilts in 3D.
export default function FooterWord() {
  const svg = useRef(null), c = useRef(null)
  const move = (e) => {
    const r = svg.current.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    c.current.setAttribute('cx', px * 1400); c.current.setAttribute('cy', py * 140)
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) svg.current.style.transform = `perspective(900px) rotateY(${(px - .5) * 10}deg) rotateX(${(.5 - py) * 16}deg)`
  }
  const enter = () => c.current.setAttribute('r', 240)
  const leave = () => { c.current.setAttribute('r', 0); svg.current.style.transform = '' }
  const T = (p) => <text x="0" y="112" textLength="1400" lengthAdjust="spacingAndGlyphs" {...p}>THE COASTLINE EVENTS</text>
  return (<svg ref={svg} className="fw" viewBox="0 0 1400 140" role="img" aria-label="THE COASTLINE EVENTS" onPointerMove={move} onPointerEnter={enter} onPointerLeave={leave}>
    <defs><radialGradient id="fwg"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
      <mask id="fwm" maskUnits="userSpaceOnUse" x="0" y="0" width="1400" height="140"><circle ref={c} cx="700" cy="70" r="0" fill="url(#fwg)" /></mask></defs>
    {T({ className: 'fw-o' })}{T({ className: 'fw-f', mask: 'url(#fwm)' })}</svg>)
}
