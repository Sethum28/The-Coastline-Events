import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
export let lenis = null
// Buttery smooth scrolling (Lenis). Skipped for reduced-motion users.
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: .1, anchors: true }); lenis = l; let id
    const raf = (t) => { l.raf(t); id = requestAnimationFrame(raf) }; id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); l.destroy(); lenis = null }
  }, [])
  return null
}
// Thin lime scroll-progress line at the top of the page.
export function ScrollProgress() {
  const r = useRef(null)
  useEffect(() => { const f = () => { const h = document.documentElement.scrollHeight - innerHeight; r.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})` }; f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f); return () => { removeEventListener('scroll', f); removeEventListener('resize', f) } }, [])
  return <div ref={r} className="spb" aria-hidden="true" />
}
// Neon glow + small ring that follow the mouse (ring grows over links/buttons/cards). Desktop only.
export function CursorGlow() {
  const g = useRef(null), c = useRef(null)
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) { g.current.style.display = 'none'; c.current.style.display = 'none'; return }
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, cx = x, cy = y, raf
    const m = (e) => { tx = e.clientX; ty = e.clientY; c.current.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,.tilt,.cf-stage,[role="radio"]'))) }
    const l = () => { x += (tx - x) * .14; y += (ty - y) * .14; cx += (tx - cx) * .3; cy += (ty - cy) * .3; g.current.style.transform = `translate(${x}px,${y}px)`; c.current.style.transform = `translate(${cx}px,${cy}px)`; raf = requestAnimationFrame(l) }
    addEventListener('pointermove', m); l()
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', m) }
  }, [])
  return <><div ref={g} className="cg" aria-hidden="true" /><div ref={c} className="cr" aria-hidden="true" /></>
}
// Primary buttons gently follow the cursor (desktop only, disabled for reduced motion).
export function Magnetic() {
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let el = null
    const m = (e) => {
      const b = e.target.closest ? e.target.closest('.btn.p,.menubtn') : null
      if (el && el !== b) { el.style.transform = ''; el = null }
      if (!b) return
      el = b; const r = b.getBoundingClientRect()
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`
    }
    addEventListener('pointermove', m); return () => removeEventListener('pointermove', m)
  }, [])
  return null
}
// Hero content drifts and fades while the video slowly zooms as you scroll.
export function HeroParallax() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const g = document.querySelector('.hero .hg'), v = document.querySelector('.hero > video'); let raf = 0
    const f = () => { raf = 0; const y = Math.min(scrollY, 900); if (g) { g.style.transform = `translateY(${y * .22}px)`; g.style.opacity = Math.max(0, 1 - y / 650) } if (v) v.style.transform = `scale(${1 + y / 3500})` }
    const s = () => { if (!raf) raf = requestAnimationFrame(f) }
    addEventListener('scroll', s, { passive: true }); return () => removeEventListener('scroll', s)
  }, [])
  return null
}
