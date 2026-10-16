import { useEffect, useState, type ReactNode } from "react"
import { motion } from "motion/react"
import { ArrowRight, ArrowUpRight, Menu as MenuIcon, X } from "lucide-react"
import { BookingProvider, useBooking, type Prefill } from "./components/Booking"

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
const SHOTS: [string, string][] = [["lionsign.jpg", "The lion"], ["reception.jpg", "Reception"], ["crown.jpg", "The crown"], ["craft.jpg", "The craft"], ["lounge.jpg", "The lounge"], ["coffee.jpg", "The welcome"]]
function Gallery() {
  return (
    <section id="gallery" className="py-[clamp(72px,11vw,130px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <SectionHead eyebrow="The Space" title="Inside Leoz." sub="Marble, warm light, the gold lion — and the craft beneath it." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {SHOTS.map(([f, cap], i) => (
            <Reveal key={f} delay={(i % 3) * 0.05} className={i === 0 ? "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2" : ""}>
              <figure className="group relative h-full min-h-[180px] overflow-hidden rounded-sm border border-line2">
                <img src={img(f)} alt={cap} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/55 to-transparent" />
                <figcaption className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.22em] text-white/90">{cap}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================= TESTIMONIAL ========================= */
function Proof() {
  return (
    <section className="border-y border-line bg-char py-[clamp(70px,12vw,140px)] text-center">
      <Reveal className="mx-auto max-w-3xl px-6">
        <div className="mb-6 text-[18px] tracking-[0.28em] text-gold-lite">★★★★★</div>
        <blockquote className="mx-auto max-w-[24ch] text-[clamp(20px,3vw,33px)] font-light italic leading-[1.42] tracking-[-0.01em]">
          “Very professional service and a well-trained team. If you want the best treatment, this is the right place for you.”
        </blockquote>
        <cite className="mt-7 block text-[12px] not-italic tracking-[0.04em] text-mut"><b className="font-semibold text-gold-lite">Alaa Taifor</b> · Google review · serving Dubai since 2012</cite>
      </Reveal>
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
function Footer() {
  return (
    <footer className="border-t border-line bg-[#060504] pb-11 pt-[clamp(60px,9vw,100px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-9 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <img src={img("logo-lockup-gold.png")} alt="Leoz Gents Salon" className="mb-5 h-28 w-auto" />
            <p className="max-w-[34ch] text-[13px] font-light text-mut">A king's grooming. Dubai's premium gents salon since 2012: haircuts, the royal shave, skin, body and care.</p>
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-medium tracking-[0.04em] text-gold">Opening hours</h4>
            {[["Monday – Sunday", "10:00 – 24:00"], ["Palm Jumeirah", "+971 4 575 8377"], ["Sky Gardens", "+971 4 288 5059"]].map(([a, b]) => (
              <div key={a} className="flex justify-between gap-3 border-b border-line py-1.5 text-[13px] text-mut"><span>{a}</span><b className="font-medium text-ink">{b}</b></div>
            ))}
          </div>
          <div>
            <h4 className="mb-4 text-[13px] font-medium tracking-[0.04em] text-gold">Connect</h4>
            <ul className="space-y-1.5 text-[13.5px] text-mut">
              <li><a href="https://www.instagram.com/leoz_saloon" target="_blank" rel="noopener noreferrer" className="hover:text-gold-lite">Instagram · @leoz_saloon</a></li>
              <li><a href="https://wa.me/971581782418" target="_blank" rel="noopener noreferrer" className="hover:text-gold-lite">WhatsApp</a></li>
              <li><a href={FRESHA} target="_blank" rel="noopener noreferrer" className="hover:text-gold-lite">Book on Fresha</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[11px] tracking-[0.04em] text-mut2">
          <span>© 2026 Leoz Gents Salon · Dubai</span><span>Concept by Propagenda</span>
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
  return (
    <BookingProvider>
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
