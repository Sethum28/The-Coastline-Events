import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// Drag-to-rotate 3D object: the SOIRÉE logo mapped on a cube, wrapped by neon wire rings.
export default function Cube3D() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, host = cv.parentElement
    const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2))
    const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(45, 1, .1, 50); C.position.z = 7
    const tex = new THREE.TextureLoader().load('/logo.jpg'); tex.colorSpace = THREE.SRGBColorSpace
    const g = new THREE.Group(); S.add(g)
    const box = new THREE.BoxGeometry(2.4, 2.4, 2.4)
    g.add(new THREE.Mesh(box, new THREE.MeshBasicMaterial({ map: tex })))
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({ color: 0xB7FF00 })))
    const rings = [2.2, 3, 3.8].map((r, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, .006, 8, 160), new THREE.MeshBasicMaterial({ color: 0xB7FF00, transparent: true, opacity: .55 - i * .12 })); m.rotation.x = i * 1.1; m.rotation.y = i * .7; g.add(m); return m })
    let vx = .004, vy = .006, drag = false, lx = 0, ly = 0, raf
    const down = (e) => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId) }
    const move = (e) => { if (!drag) return; vy = (e.clientX - lx) * .008; vx = (e.clientY - ly) * .008; lx = e.clientX; ly = e.clientY }
    const up = () => { drag = false }
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up)
    const rs = () => { R.setSize(host.clientWidth, host.clientHeight, false); C.aspect = host.clientWidth / host.clientHeight; C.updateProjectionMatrix() }
    addEventListener('resize', rs); rs()
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = () => { g.rotation.y += vy; g.rotation.x += vx; if (!drag) { vx += (.002 - vx) * .03; vy += (.005 - vy) * .03 } rings.forEach((m, i) => { m.rotation.z += .002 * (i + 1) }); R.render(S, C); if (!still) raf = requestAnimationFrame(loop) }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); R.dispose(); tex.dispose(); box.dispose(); rings.forEach(m => { m.geometry.dispose(); m.material.dispose() }) }
  }, [])
  return <canvas ref={ref} className="cube" aria-label="3D logo cube — drag to rotate" role="img" />
}
