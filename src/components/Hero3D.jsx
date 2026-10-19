import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// Neon wave terrain + particle field + wireframe orb, reacting to the pointer.
export default function Hero3D() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, host = cv.parentElement
    const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2))
    const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(60, 1, .1, 100); C.position.set(0, 2.2, 6); S.fog = new THREE.Fog(0x050706, 6, 20)
    const G = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 56, 56), new THREE.MeshBasicMaterial({ color: 0xB7FF00, wireframe: true, transparent: true, opacity: .2 }))
    G.rotation.x = -Math.PI / 2.15; G.position.y = -2.6; S.add(G)
    const pos = G.geometry.attributes.position, base = Float32Array.from(pos.array)
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), new THREE.MeshBasicMaterial({ color: 0xB7FF00, wireframe: true, transparent: true, opacity: .35 })); orb.position.set(4.6, 2.4, -4); S.add(orb)
    const N = 450, pa = new Float32Array(N * 3).map(() => (Math.random() - .5) * 22), pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pa, 3))
    const P = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xB7FF00, size: .04, transparent: true, opacity: .7 })); S.add(P)
    let mx = 0, my = 0, t = 0, raf
    const pm = (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5 }
    const rs = () => { R.setSize(host.clientWidth, host.clientHeight, false); C.aspect = host.clientWidth / host.clientHeight; C.updateProjectionMatrix() }
    addEventListener('pointermove', pm); addEventListener('resize', rs); rs()
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = () => {
      t += .012; const a = pos.array
      for (let i = 0; i < a.length; i += 3) a[i + 2] = base[i + 2] + Math.sin(base[i] * .6 + t) * .35 + Math.cos(base[i + 1] * .5 + t * .8) * .3
      pos.needsUpdate = true; orb.rotation.x = t * .4; orb.rotation.y = t * .6; P.rotation.y = t * .05
      C.position.x += (mx * 1.4 - C.position.x) * .04; C.position.y += (2.2 - my * .9 - C.position.y) * .04; C.position.z += (6 - Math.min(scrollY, 900) / 150 - C.position.z) * .06; C.lookAt(0, 0, 0)
      R.render(S, C); if (!still) raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', pm); removeEventListener('resize', rs); R.dispose(); [G, orb].forEach(m => { m.geometry.dispose(); m.material.dispose() }); pg.dispose() }
  }, [])
  return <canvas ref={ref} className="gl" aria-hidden="true" />
}
