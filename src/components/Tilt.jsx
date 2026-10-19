import { useRef } from 'react'
export default function Tilt({ max = 10, className = '', style, children, as: T = 'div' }) {
  const ref = useRef(null)
  const move = (e) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
    ref.current.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(10px)`
  }
  return <T ref={ref} className={`tilt ${className}`} style={style} onPointerMove={move} onPointerLeave={() => (ref.current.style.transform = '')}>{children}</T>
}
