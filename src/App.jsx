import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import { Artists, ArtistDetail } from './pages/Artists.jsx'
import { About, Contact } from './pages/Static.jsx'
import Gallery from './pages/Gallery.jsx'
import { Faq, Privacy, Terms } from './pages/Info.jsx'
import { hydrate } from './services/hydrate.js'
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
export default function App() {
  const { pathname } = useLocation(), [ready, setReady] = useState(false), admin = pathname.startsWith('/admin')
  useEffect(() => { if (!admin) hydrate().finally(() => setReady(true)) }, [admin])
  if (admin) return <Suspense fallback={<div className="boot" />}><Routes><Route path="admin/*" element={<AdminApp />} /></Routes></Suspense>
  if (!ready) return <div className="boot"><img src="/logo.jpg" alt="Loading" /></div>
  return (<Routes><Route element={<Layout />}>
    <Route index element={<Home />} /><Route path="events" element={<Events />} />
    <Route path="events/soiree" element={<Events concept="soiree" />} /><Route path="events/one-love" element={<Events concept="one-love" />} /><Route path="events/exclusive" element={<Events concept="exclusive" />} />
    <Route path="events/:slug" element={<EventDetail />} /><Route path="artists" element={<Artists />} /><Route path="artists/:slug" element={<ArtistDetail />} />
    <Route path="gallery" element={<Gallery />} /><Route path="faq" element={<Faq />} /><Route path="privacy-policy" element={<Privacy />} /><Route path="terms" element={<Terms />} />
    <Route path="about" element={<About />} /><Route path="contact" element={<Contact />} /><Route path="*" element={<div className="pg wrap"><h1 className="h2">404</h1></div>} />
  </Route></Routes>)
}
