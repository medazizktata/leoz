import { useEffect, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { ArrowUp, ArrowUpRight, Clock, MapPin, Menu as MenuIcon, X } from "lucide-react"
import { BookingProvider, useBooking } from "./components/Booking"
import { Loader } from "./components/Loader"
import { img, FRESHA, smoothScroll, BookBtn, BRANCHES } from "./sections"
import Home from "./pages/Home"
import Services from "./pages/Services"
import Salon from "./pages/Salon"

const lenisWin = () => (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis

// top nav + footer "Explore" share these routes (anchors resolve on the target page)
const NAV: [string, string][] = [
  ["/salon", "The Salon"],
  ["/services", "Services"],
  ["/#ritual", "The Ritual"],
  ["/salon#gallery", "Gallery"],
  ["/salon#locations", "Locations"],
]

/* ============================ HEADER ============================ */
function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  const isActive = (to: string) => {
    const full = loc.pathname + (loc.hash || "")
    return to.includes("#") ? full === to : loc.pathname === to && !loc.hash
  }
  const onLogo = (e: React.MouseEvent) => { if (loc.pathname === "/") { e.preventDefault(); smoothScroll(e, "#top") } }
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "border-b border-line bg-night/90 backdrop-blur-md" : "border-b border-transparent"}`}>
        <div className="mx-auto flex h-20 max-w-[1320px] items-center gap-6 px-5 sm:px-8 lg:px-14">
          <Link to="/" onClick={onLogo} aria-label="Leoz Gents Salon — home" className="flex shrink-0 items-center">
            <img src={img("lion-gold.png")} alt="Leoz Gents Salon" className="h-12 w-auto" />
          </Link>
          <nav className="ml-auto hidden items-center gap-9 lg:flex">
            {NAV.map(([to, t]) => (
              <Link key={to} to={to} className={`text-[12.5px] tracking-wide transition-colors hover:text-gold-lite ${isActive(to) ? "text-gold-lite" : "text-mut"}`}>{t}</Link>
            ))}
          </nav>
          <div className="ml-auto lg:ml-9"><BookBtn className="hidden lg:inline-flex">Book</BookBtn></div>
          <button className="ml-auto inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon size={24} /></button>
        </div>
      </header>
      <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-2 bg-[#060504]/98 backdrop-blur transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button className="absolute right-6 top-6 h-11 w-11 text-ink" aria-label="Close menu" onClick={() => setOpen(false)}><X size={26} /></button>
        {NAV.map(([to, t]) => (
          <Link key={to} to={to} onClick={() => setOpen(false)} className={`p-3 text-2xl font-light tracking-wide hover:text-gold-lite ${isActive(to) ? "text-gold-lite" : "text-ink"}`}>{t}</Link>
        ))}
        <div className="mt-5"><BookBtn>Book your chair</BookBtn></div>
      </div>
    </>
  )
}

/* =========================== FOOTER =========================== */
function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (<div><h4 className="mb-5 text-[11px] uppercase tracking-[0.2em] text-gold">{title}</h4>{children}</div>)
}
const SOCIALS: [string, string, ReactNode][] = [
  ["Instagram", "https://www.instagram.com/leoz_saloon",
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.3" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>],
  ["Snapchat", "https://www.snapchat.com/add/leozsaloon",
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.02 2c2.65.01 4.86 2.02 5.01 4.66.03.57.01 1.15.02 1.72 0 .2.08.35.3.33.38-.03.74-.22 1.12-.26.3-.03.64.05.73.37.1.37-.22.55-.5.68-.34.16-.72.25-1.06.4-.23.1-.36.28-.26.54.42 1.13 1.25 1.96 2.35 2.44.2.09.42.14.62.24.32.16.3.5.02.68-.5.33-1.1.36-1.66.5-.25.06-.38.2-.44.45-.05.21-.1.42-.18.62-.1.28-.32.37-.6.33-.47-.06-.93-.18-1.4-.2-.65-.03-1.2.27-1.7.64-.62.46-1.27.8-2.07.78-.76-.02-1.38-.37-1.97-.8-.48-.36-1-.65-1.63-.63-.48.02-.95.14-1.43.2-.28.04-.5-.05-.6-.33-.08-.2-.13-.41-.18-.62-.06-.25-.2-.39-.44-.45-.56-.14-1.16-.17-1.66-.5-.28-.18-.3-.52.02-.68.2-.1.42-.15.62-.24 1.1-.48 1.93-1.31 2.35-2.44.1-.26-.03-.44-.26-.54-.34-.15-.72-.24-1.06-.4-.28-.13-.6-.31-.5-.68.09-.32.43-.4.73-.37.38.04.74.23 1.12.26.22.02.3-.13.3-.33.01-.57-.01-1.15.02-1.72C7.16 4.02 9.37 2.01 12.02 2z" /></svg>],
  ["WhatsApp", "https://wa.me/971581782418",
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 13.02c-.26.73-1.3 1.29-1.76 1.36-.46.07-1.03.1-1.66-.1-.38-.12-.87-.28-1.5-.55-2.63-1.14-4.35-3.79-4.48-3.96-.13-.17-1.07-1.42-1.07-2.72 0-1.3.68-1.94.92-2.2.24-.26.53-.32.7-.32l.5.01c.16.01.38-.06.59.45.22.52.74 1.81.81 1.94.06.14.11.29.02.46-.09.17-.13.28-.26.43-.13.16-.27.34-.39.46-.13.13-.26.27-.11.53.15.26.67 1.12 1.45 1.81 1 .89 1.84 1.16 2.1 1.29.26.13.41.1.56-.07.15-.17.65-.76.82-1.02.17-.26.34-.22.59-.13.24.09 1.52.72 1.78.85.26.13.44.19.5.3.07.11.07.63-.19 1.25z" /></svg>],
]
function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#060504]">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-deep to-transparent opacity-70" />
      <img src={img("lion-gold.png")} alt="" aria-hidden className="pointer-events-none absolute -right-10 bottom-0 w-72 opacity-[0.04]" />
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col items-center gap-7 border-b border-line py-14 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Your chair is waiting</p>
            <h3 className="mt-3 text-[clamp(26px,3.6vw,40px)] font-light leading-tight tracking-[-0.02em]">Ready when you are.</h3>
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <BookBtn>Book your chair</BookBtn>
            <span className="text-[12px] text-mut">or walk in — open till midnight, daily.</span>
          </div>
        </div>
        <div className="grid gap-10 py-16 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <img src={img("logo-lockup-gold.png")} alt="Leoz Gents Salon" className="h-24 w-auto" />
            <p className="mt-5 max-w-[30ch] text-[13px] font-light leading-relaxed text-mut">A king's grooming. Dubai's premium gents salon since 2012 — haircuts, the royal shave, skin, body and care.</p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(([name, href, icon]) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="flex h-10 w-10 items-center justify-center rounded-full border border-line2 text-mut transition-colors hover:border-gold hover:text-gold-lite">{icon}</a>
              ))}
            </div>
          </div>
          <FooterCol title="Visit">
            {BRANCHES.map(([name, , tel, href]) => (
              <div key={name} className="mb-4">
                <div className="flex items-center gap-2 text-[13.5px] text-ink"><MapPin size={13} className="text-gold" />{name}</div>
                <a href={href} className="ml-[21px] block text-[13px] text-mut transition-colors hover:text-gold-lite">{tel}</a>
              </div>
            ))}
          </FooterCol>
          <FooterCol title="Hours">
            <div className="flex items-start gap-2 text-[13.5px] text-ink"><Clock size={13} className="mt-1 shrink-0 text-gold" /><div>Monday – Sunday<div className="text-mut">10:00 – 24:00</div></div></div>
            <p className="mt-4 text-[13px] font-light leading-relaxed text-mut">Walk-ins welcome.<br />Open till midnight, every day.</p>
          </FooterCol>
          <FooterCol title="Explore">
            <ul className="space-y-2.5 text-[13.5px] text-mut">
              {NAV.map(([to, t]) => (
                <li key={to}><Link to={to} className="transition-colors hover:text-gold-lite">{t}</Link></li>
              ))}
              <li className="pt-1"><a href={FRESHA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-lite hover:underline">Book on Fresha<ArrowUpRight size={13} /></a></li>
            </ul>
          </FooterCol>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-7 text-[11px] tracking-[0.04em] text-mut2 sm:flex-row">
          <span>© 2026 Leoz Gents Salon · Dubai</span>
          <span>Concept by Propagenda</span>
          <a href="#top" onClick={(e) => smoothScroll(e, "#top")} className="inline-flex items-center gap-1 transition-colors hover:text-gold-lite">Back to top<ArrowUp size={12} /></a>
        </div>
      </div>
    </footer>
  )
}

/* ====================== FLOATING BOOK (Ruffians) ====================== */
function BookFab() {
  const { open } = useBooking()
  return (
    <button type="button" onClick={() => open()}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-sm border border-gold-deep px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-lite shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md"
      style={{ background: "rgba(16,13,8,0.82)" }}>
      Book now<ArrowUpRight size={14} />
    </button>
  )
}

/* scroll to top on page change, or to the hash target once the new page has rendered */
function ScrollManager() {
  const loc = useLocation()
  useEffect(() => {
    const lenis = lenisWin()
    if (loc.hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(loc.hash)
        if (!el) return
        const y = el.getBoundingClientRect().top + window.scrollY - 80
        if (lenis) lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: "smooth" })
      }, 90)
      return () => clearTimeout(t)
    }
    if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash, loc.key])
  return null
}

export default function App() {
  const [showLoader, setShowLoader] = useState(() => {
    try { return sessionStorage.getItem("leoz:loader") !== "1" } catch { return true }
  })
  useEffect(() => { try { sessionStorage.setItem("leoz:loader", "1") } catch { /* private mode: replays next load */ } }, [])
  const loc = useLocation()
  return (
    <BookingProvider>
      <AnimatePresence>
        {showLoader && <Loader onDone={() => setShowLoader(false)} />}
      </AnimatePresence>
      <ScrollManager />
      <Header />
      <motion.main key={loc.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/salon" element={<Salon />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
      <Footer />
      <BookFab />
    </BookingProvider>
  )
}
