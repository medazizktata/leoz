import { useEffect, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ArrowUp, ArrowUpRight, Clock, MapPin, Menu as MenuIcon, X } from "lucide-react"
import { BookingProvider, useBooking, type Prefill } from "./components/Booking"
import { Loader } from "./components/Loader"
import Gallery from "./components/Gallery"

const FRESHA = "https://www.fresha.com/book-now/leo-barbershop-gh2f7o6x"
const img = (n: string) => `/img/${n}`

// smooth-scroll in-page anchors via Lenis (offset for the fixed header), with a native fallback
function smoothScroll(e: { preventDefault(): void }, href: string) {
  if (!href.startsWith("#")) return
  e.preventDefault()
  const el = href === "#top" ? null : document.querySelector(href)
  const y = href === "#top" ? 0 : el ? el.getBoundingClientRect().top + window.scrollY - 80 : 0 // 80 = fixed header
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis
  if (lenis) lenis.scrollTo(y, { duration: 1.2 })
  else window.scrollTo({ top: y, behavior: "smooth" })
}

function Reveal({ children, delay = 0, y = 28, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}>
      {children}
    </motion.div>
  )
}

function BookBtn({ children = "Book your chair", className = "", prefill }: { children?: ReactNode; className?: string; prefill?: Prefill }) {
  const { open } = useBooking()
  return (
    <button type="button" onClick={() => open(prefill)}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1a1205] transition-[background-position] duration-300 ${className}`}
      style={{ backgroundImage: "linear-gradient(104deg,#8a6a12,#d9a93f 32%,#fcca6e 50%,#d9a93f 68%,#8a6a12)", backgroundSize: "180% 100%", backgroundPosition: "0 0" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "0 0")}>
      {children}
    </button>
  )
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h2 className="mt-4 text-[clamp(28px,4.2vw,48px)] font-light leading-[1.1] tracking-[-0.02em]">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-[14.5px] font-light text-mut">{sub}</p>}
    </Reveal>
  )
}

/* ============================ HEADER ============================ */
function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  const links = [["#experience", "The Salon"], ["#services", "Services"], ["#ritual", "The Ritual"], ["#gallery", "Gallery"], ["#locations", "Locations"]]
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "border-b border-line bg-night/90 backdrop-blur-md" : "border-b border-transparent"}`}>
        <div className="mx-auto flex h-20 max-w-[1320px] items-center gap-6 px-5 sm:px-8 lg:px-14">
          <a href="#top" onClick={(e) => smoothScroll(e, "#top")} aria-label="Leoz Gents Salon — home" className="flex shrink-0 items-center">
            <img src={img("lion-gold.png")} alt="Leoz Gents Salon" className="h-12 w-auto" />
          </a>
          <nav className="ml-auto hidden items-center gap-9 lg:flex">
            {links.map(([h, t]) => (<a key={h} href={h} onClick={(e) => smoothScroll(e, h)} className="text-[12.5px] tracking-wide text-mut transition-colors hover:text-gold-lite">{t}</a>))}
          </nav>
          <div className="ml-auto lg:ml-9"><BookBtn className="hidden lg:inline-flex">Book</BookBtn></div>
          <button className="ml-auto inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon size={24} /></button>
        </div>
      </header>
      <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-2 bg-[#060504]/98 backdrop-blur transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button className="absolute right-6 top-6 h-11 w-11 text-ink" aria-label="Close menu" onClick={() => setOpen(false)}><X size={26} /></button>
        {links.map(([h, t]) => (<a key={h} href={h} onClick={(e) => { smoothScroll(e, h); setOpen(false) }} className="p-3 text-2xl font-light tracking-wide text-ink hover:text-gold-lite">{t}</a>))}
        <div className="mt-5"><BookBtn>Book your chair</BookBtn></div>
      </div>
    </>
  )
}

/* ============================= HERO ============================= */
function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center">
      <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}>
        <img src={img("hero.jpg")} alt="" className="h-full w-full object-cover object-[center_38%]" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(135% 100% at 50% 34%,rgba(10,9,8,.5),rgba(10,9,8,.84) 60%,rgba(10,9,8,.97)),linear-gradient(0deg,#0a0908,rgba(10,9,8,.2) 44%,transparent 66%)" }} />
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-28">
        <motion.img src={img("logo-lockup-gold.png")} alt="Leoz Gents Salon" className="mx-auto w-[clamp(190px,34vw,300px)]"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
        <motion.p className="mx-auto mt-9 text-[11px] uppercase tracking-[0.42em] text-gold-lite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>Est. 2012 · Dubai</motion.p>
        <motion.p className="mx-auto mt-5 max-w-xl text-[clamp(16px,1.6vw,19px)] font-light leading-relaxed text-[#ddd8cf]"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.85 }}>
          A king's grooming. Precise cuts, the <span className="font-medium text-gold-lite">royal shave</span>, and care worthy of a gentleman — in the heart of Dubai.
        </motion.p>
        <motion.div className="mt-9 flex flex-wrap items-center justify-center gap-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>
          <BookBtn>Book your chair</BookBtn>
          <span className="text-[12.5px] text-mut">or <span className="font-medium text-ink">walk in</span> — open till midnight, daily.</span>
        </motion.div>
      </div>
      <a href="#experience" onClick={(e) => smoothScroll(e, "#experience")} className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-mut2" aria-label="Scroll">
        <motion.svg width="15" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.4" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.4, repeat: Infinity }}><path d="M8 2v18M3 15l5 5 5-5" /></motion.svg>
      </a>
    </section>
  )
}

/* ===================== ALTERNATING FEATURE (Ruffians) ===================== */
function Feature({ eyebrow, title, body, cta, image, flip, id, service }: { eyebrow: string; title: ReactNode; body: string; cta: string; image: string; flip?: boolean; id?: string; service?: string }) {
  const { open } = useBooking()
  return (
    <section id={id} className="mx-auto max-w-[1320px] px-5 py-[clamp(60px,10vw,120px)] sm:px-8 lg:px-14">
      <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal className={flip ? "lg:pl-6" : "lg:pr-6"}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <h2 className="mt-5 text-[clamp(28px,4vw,46px)] font-light leading-[1.08] tracking-[-0.02em]">{title}</h2>
          <p className="mt-6 max-w-md text-[15px] font-light text-mut">{body}</p>
          <button type="button" onClick={() => open(service ? { service } : undefined)} className="group mt-8 inline-flex items-center gap-2 border-b border-brass pb-1.5 text-[12px] uppercase tracking-[0.14em] text-gold-lite">
            {cta}<ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>
        <Reveal y={36} delay={0.05}>
          <div className="overflow-hidden rounded-sm border border-line">
            <img src={image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ========================= RITUAL (Louis XIII) ========================= */
function Ritual() {
  const { open } = useBooking()
  return (
    <section id="ritual" className="relative flex min-h-[86vh] items-center overflow-hidden">
      <div className="absolute inset-0"><img src={img("lionsign.jpg")} alt="" className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 50%,rgba(9,8,5,.42),rgba(9,8,5,.8) 72%)" }} />
      <Reveal className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold-lite">The Royal Shave</p>
        <h2 className="mt-5 text-[clamp(30px,5.4vw,58px)] font-light leading-[1.08] tracking-[-0.02em]">A rite,<br /><em className="font-normal italic">not a routine.</em></h2>
        <p className="mx-auto mt-7 max-w-lg text-[15px] font-light text-[#d6d1c7]">Hot towel. Pre-shave oil. The slow glide of a single blade. The oldest ritual a man keeps, restored to the ceremony it deserves — crowned, unhurried, entirely yours.</p>
        <div className="mt-9">
          <button type="button" onClick={() => open({ service: "The Royal Shave" })} className="inline-flex items-center gap-2 rounded-sm border border-line2 px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold-lite">Reserve the ritual<ArrowUpRight size={15} /></button>
        </div>
      </Reveal>
    </section>
  )
}

/* ============================= MENU ============================= */
const MENU: [string, [string, string][]][] = [
  ["Haircuts & Shaving", [["Haircut", "145"], ["Beard", "90"], ["Head shave", "110"], ["Hot oil treatment", "220"], ["Hair treatment blow out", "385"]]],
  ["Facial & Skin", [["Express facial", "165"], ["Facial — hyaluronic", "385"], ["Facial — power C", "495"], ["Threading", "35"], ["Face wax", "65"]]],
  ["Massage & Body", [["Relaxing massage", "275"], ["Deep tissue", "385"], ["Hot stone", "495"], ["Foot massage · 60 min", "220"]]],
  ["Manicure & Pedicure", [["Manicure", "110"], ["Pedicure", "130"], ["Paraffin hands", "165"], ["Callus removal", "65"]]],
]
function MenuSection() {
  return (
    <section id="services" className="border-y border-line bg-char py-[clamp(72px,11vw,130px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <SectionHead eyebrow="Services & Prices" title="A full gents salon." sub="Grooming, skin, body and care — the gentleman's essentials and the indulgences. Prices in AED." />
        <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
          {MENU.map(([cat, rows], i) => (
            <Reveal key={cat} delay={i * 0.05}>
              <h3 className="mb-2 border-b border-line2 pb-3 text-[14px] font-medium tracking-[0.02em] text-gold-lite">{cat}</h3>
              {rows.map(([n, p]) => (
                <div key={n} className="flex items-baseline gap-3 border-b border-line/60 py-2.5">
                  <span className="text-[14px] font-light text-ink">{n}</span>
                  <span className="flex-1 translate-y-[-3px] border-b border-dotted border-[#443c27]" />
                  <span className="text-[14px] font-medium text-gold-lite">{p}</span>
                </div>
              ))}
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 text-center"><BookBtn>Book your service</BookBtn></Reveal>
      </div>
    </section>
  )
}

/* =========================== GALLERY =========================== */
// Gallery lives in ./components/Gallery — uniform big grid + lightbox, fresh photos only

/* ========================= REVIEWS ========================= */
// real reviews — Alaa Taifor (Google) + Fresha (5.0 from 211); quotes used verbatim
const REVIEWS: { quote: string; name: string; src: string }[] = [
  { quote: "Very calm and very attentive. Great attention to detail.", name: "Reece T.", src: "Fresha review" },
  { quote: "It's an every Friday tidy up for me — and always a great cut.", name: "Shaun B.", src: "Fresha review" },
  { quote: "Barely had to tell him what to do — he knew exactly what I wanted the second I got on the chair.", name: "Salman", src: "Fresha review" },
]

function Proof() {
  return (
    <section id="reviews" className="border-y border-line bg-char py-[clamp(70px,12vw,140px)]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Reviews</p>
          <h2 className="mt-4 text-[clamp(28px,4.2vw,48px)] font-light leading-[1.1] tracking-[-0.02em]">Loved across Dubai.</h2>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-mut">
            <span className="text-[15px] tracking-[0.2em] text-gold-lite">★★★★★</span>
            <span><b className="font-medium text-ink">5.0</b> · 211 reviews on Fresha · trusted since 2012</span>
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-3xl text-center">
          <blockquote className="mx-auto max-w-[26ch] text-[clamp(20px,3vw,32px)] font-light italic leading-[1.42] tracking-[-0.01em]">
            “Very professional service and a well-trained team. If you want the best treatment, this is the right place for you.”
          </blockquote>
          <cite className="mt-6 block text-[12px] not-italic tracking-[0.04em] text-mut"><b className="font-semibold text-gold-lite">Alaa Taifor</b> · Google review</cite>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06} className="h-full">
              <figure className="flex h-full flex-col rounded-sm border border-line2 bg-night p-6">
                <div className="mb-4 text-[13px] tracking-[0.22em] text-gold-lite">★★★★★</div>
                <blockquote className="flex-1 text-[14px] font-light leading-relaxed text-ink">“{r.quote}”</blockquote>
                <figcaption className="mt-5 text-[11.5px] tracking-[0.03em] text-mut"><b className="font-semibold text-gold-lite">{r.name}</b> · {r.src}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================= LOCATIONS ========================= */
const BRANCHES: [string, string, string, string][] = [["Palm Jumeirah", "reception.jpg", "+971 4 575 8377", "tel:+97145758377"], ["Sky Gardens", "lounge.jpg", "+971 4 288 5059", "tel:+97142885059"]]
function Locations() {
  return (
    <section id="locations" className="py-[clamp(72px,11vw,130px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <SectionHead eyebrow="Visit" title="Two homes in Dubai." sub="Both open 10:00 – 24:00, every day. Book your branch, or walk in." />
        <div className="grid gap-4 md:grid-cols-2">
          {BRANCHES.map(([name, f, tel, href], i) => (
            <Reveal key={name} delay={i * 0.06}>
              <article className="group relative flex min-h-[440px] items-end overflow-hidden rounded-sm border border-line2">
                <img src={img(f)} alt={`Leoz ${name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(9,8,5,.96) 8%,rgba(9,8,5,.2) 58%,rgba(9,8,5,.5))" }} />
                <div className="relative z-10 w-full p-8">
                  <h3 className="text-[25px] font-light tracking-[0.01em]">{name}</h3>
                  <div className="mt-2 text-[12.5px] tracking-[0.04em] text-mut">Open daily · 10:00 – 24:00</div>
                  <a href={href} className="text-[13.5px] text-ink hover:text-gold-lite">{tel}</a>
                  <div className="mt-5"><BookBtn prefill={{ branch: name }}>Book this branch</BookBtn></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
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
              {[["#experience", "The Salon"], ["#services", "Services"], ["#ritual", "The Ritual"], ["#gallery", "Gallery"], ["#locations", "Locations"]].map(([h, t]) => (
                <li key={h}><a href={h} onClick={(e) => smoothScroll(e, h)} className="transition-colors hover:text-gold-lite">{t}</a></li>
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

export default function App() {
  const [showLoader, setShowLoader] = useState(() => {
    try { return sessionStorage.getItem("leoz:loader") !== "1" } catch { return true }
  })
  useEffect(() => { try { sessionStorage.setItem("leoz:loader", "1") } catch { /* private mode: replays next load */ } }, [])
  return (
    <BookingProvider>
      <AnimatePresence>
        {showLoader && <Loader onDone={() => setShowLoader(false)} />}
      </AnimatePresence>
      <Header />
      <main>
        <Hero />
        <Feature id="experience" eyebrow="The Salon" title={<>More than a cut.<br /><em className="font-normal italic">A ritual.</em></>}
          body="Leoz redefines men's grooming with an unwavering focus on luxury, precision and individualized care — for the modern gentleman who demands excellence. Traditional technique, modern craft, premium tools, in a room built to make routine grooming something you look forward to."
          cta="Discover the salon" image={img("lounge.jpg")} />
        <Feature eyebrow="The Craft" title={<>Shaped to you,<br /><em className="font-normal italic">to the last detail.</em></>}
          body="A consultation first, then a cut and finish shaped to your face and your life. Beard sculpting, hot-oil treatments, and the quiet confidence of a precise line — with tools and products from the world's top houses."
          cta="Book a cut" image={img("craft.jpg")} service="Haircut" flip />
        <Ritual />
        <MenuSection />
        <Gallery />
        <Proof />
        <Locations />
      </main>
      <Footer />
      <BookFab />
    </BookingProvider>
  )
}
