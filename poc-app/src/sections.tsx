import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Link } from "react-router-dom"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useBooking, type Prefill } from "./components/Booking"

export const FRESHA = "https://www.fresha.com/a/leoz-barbershop-palm-dubai-palm-jumeirah-n84t1cic"
export const img = (n: string) => `${import.meta.env.BASE_URL}img/${n}` // BASE_URL = /leoz/ on Pages, / in dev

// smooth-scroll in-page anchors via Lenis (offset for the fixed header), with a native fallback
export function smoothScroll(e: { preventDefault(): void }, href: string) {
  if (!href.startsWith("#")) return
  e.preventDefault()
  const el = href === "#top" ? null : document.querySelector(href)
  const y = href === "#top" ? 0 : el ? el.getBoundingClientRect().top + window.scrollY - 80 : 0 // 80 = fixed header
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis
  if (lenis) lenis.scrollTo(y, { duration: 1.2 })
  else window.scrollTo({ top: y, behavior: "smooth" })
}

export function Reveal({ children, delay = 0, y = 28, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}>
      {children}
    </motion.div>
  )
}

export function BookBtn({ children = "Book your chair", className = "", prefill }: { children?: ReactNode; className?: string; prefill?: Prefill }) {
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

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h2 className="mt-4 text-[clamp(28px,4.2vw,48px)] font-light leading-[1.1] tracking-[-0.02em]">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-[14.5px] font-light text-mut">{sub}</p>}
    </Reveal>
  )
}

/* compact page header for the inner pages (Hero stays full-screen, these are header bands) */
export function PageHero({ eyebrow, title, sub, image }: { eyebrow: string; title: ReactNode; sub?: string; image: string }) {
  return (
    <section className="relative flex min-h-[54vh] items-center justify-center overflow-hidden pt-20 text-center">
      <motion.div className="absolute inset-0" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}>
        <img src={img(image)} alt="" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 40%,rgba(10,9,8,.5),rgba(10,9,8,.9) 72%),linear-gradient(0deg,#0a0908,transparent 72%)" }} />
      <Reveal className="relative z-10 mx-auto max-w-2xl px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold-lite">{eyebrow}</p>
        <h1 className="mt-5 text-[clamp(32px,5.6vw,62px)] font-light leading-[1.05] tracking-[-0.02em]">{title}</h1>
        {sub && <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-[#d6d1c7]">{sub}</p>}
      </Reveal>
    </section>
  )
}

/* ============================= HERO ============================= */

// where the real lion sign sits inside hero.jpg (2400x1600), measured from the photo:
// center as a fraction of the image, and the lion's width as a fraction of image width.
// hero.jpg object-position is pinned to this center so the wall lion always lands at
// (WALL.x*vw, WALL.y*vh) on screen, whatever the viewport - the anchor the crest flies from.
// wall lion's centre and width in hero.jpg, as fractions (measured against the rendered photo).
const WALL = { x: 0.482, y: 0.355, lionW: 0.124, imgAspect: 2400 / 1600 }
// both the lion icon and the wordmark are cropped from logo-lockup-gold.png (1775x1994, H/W 1.123)
// so they share the exact same gold. the lion is the top slice; the wordmark the bottom slice.
// crop fractions and the lion's box within the crop are measured from the PNG's alpha channel.
const LOCKUP_AR = 1994 / 1775
const LION_FRAC = 0.627 // lion band spans y 0..0.625 of the lockup
const WORD_TOP = 0.6776 // wordmark band starts here
const LION = { fillW: 0.6338, cx: 0.4994, cy: 0.4998 } // lion bbox within the lion-crop box
// the sign sits on a wall only slightly angled from the camera; the embedded icon takes that
// tilt and straightens as it stands up off the wall. degrees, matched to the photo.
const TILT = { rotateX: 0, rotateY: 0, skewX: 0 }
// EMBEDDED matches the warm backlit cream of the metal sign; LIFTED is the clean gold logo with a
// soft gold glow. both share the same filter functions in order so motion interpolates them.
const EMBEDDED = "brightness(1.2) saturate(0.58) sepia(0.32) hue-rotate(-6deg) blur(1.1px) drop-shadow(0px 0px 0px rgba(0,0,0,0)) drop-shadow(0px 0px 0px rgba(252,202,110,0))"
const LIFTED = "brightness(1) saturate(1) sepia(0) hue-rotate(0deg) blur(0px) drop-shadow(0px 24px 40px rgba(0,0,0,0.55)) drop-shadow(0px 0px 26px rgba(252,202,110,0.45))"

export function Hero() {
  const reduce = useReducedMotion()
  const crestRef = useRef<HTMLDivElement>(null)
  // the "crest lifts off the wall" intro plays on every load, never on reduced motion.
  // `?intro` (or #intro) in the URL forces it even under reduced motion, for review.
  const forced = (() => { try { return /[?&#]intro\b/.test(location.search + location.hash) } catch { return false } })()
  const [intro] = useState(() => forced || !reduce)
  const [start, setStart] = useState<{ x: number; y: number; scale: number } | null>(null)
  const [lifted, setLifted] = useState(!intro) // no intro -> straight to the resting crest

  // derive the embedded (on-wall) transform from the crest's RESTING box. crestRef is the OUTER
  // wrapper, which is never transformed (the transform lives on an inner element), so its rect is
  // always the clean resting layout - safe to read on mount, after the web font swaps in (which
  // shifts the vertically-centred column a few px), and on resize, with no self-contamination.
  useLayoutEffect(() => {
    if (!intro) return
    let cancelled = false
    const compute = () => {
      const el = crestRef.current
      if (cancelled || !el) return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth, vh = window.innerHeight
      const restLionCx = r.left + r.width * LION.cx // lion centre within the lion-crop box
      const restLionCy = r.top + r.height * LION.cy
      const restLionW = r.width * LION.fillW        // visible lion width within the crop box
      const renderedImgW = Math.max(vw, vh * WALL.imgAspect) // object-cover scaled width
      const wallLionW = WALL.lionW * renderedImgW
      setStart({
        x: WALL.x * vw - restLionCx,
        y: WALL.y * vh - restLionCy,
        scale: wallLionW / restLionW, // embed at the wall lion's exact size (may be larger than rest on wide/narrow viewports)
      })
    }
    compute()
    // the centred column keeps shifting as the web font reflows and later resources settle, which
    // moves the crest's resting box. recompute on resize, on font-ready, and at a few points over
    // the first ~650ms (before the lift) to catch late settles. crestRef is never transformed, so
    // every read is a clean resting rect and the embedded lion stays locked to the wall sign.
    window.addEventListener("resize", compute)
    const timers = [120, 350, 650].map((t) => window.setTimeout(() => { if (!cancelled) compute() }, t))
    try { (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(() => { if (!cancelled) compute() }) } catch { /* no font API */ }
    return () => { cancelled = true; window.removeEventListener("resize", compute); timers.forEach(clearTimeout) }
  }, [intro])

  // lift once the loader has handed off (or shortly after mount when no loader will play)
  useEffect(() => {
    if (!intro) return
    let hold = 0
    // delay past the loader's exit (~0.9s after onDone) so the lift is seen on the bare wall, not behind the fade
    const lift = () => { hold = window.setTimeout(() => setLifted(true), 1000) }
    let loaderWillPlay = false
    try { loaderWillPlay = !forced && sessionStorage.getItem("leoz:loader") !== "1" } catch { /* ignore */ }
    if (loaderWillPlay) {
      window.addEventListener("leoz:loaderdone", lift, { once: true })
      const fb = window.setTimeout(() => setLifted(true), 3600) // safety if the event is missed
      return () => { window.removeEventListener("leoz:loaderdone", lift); clearTimeout(hold); clearTimeout(fb) }
    }
    hold = window.setTimeout(() => setLifted(true), 760) // no loader (e.g. ?intro review): a beat on the wall, then lift
    return () => clearTimeout(hold)
  }, [intro])

  const text = (delay: number) => ({
    initial: false as const,
    animate: lifted ? { opacity: 1, y: 0 } : { opacity: intro ? 0 : 1, y: intro ? 14 : 0 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: lifted && intro ? delay : 0 },
  })

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center">
      <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}>
        <img src={img("hero.jpg")} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${WALL.x * 100}% ${WALL.y * 100}%` }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(135% 100% at 50% 34%,rgba(10,9,8,.5),rgba(10,9,8,.84) 60%,rgba(10,9,8,.97)),linear-gradient(0deg,#0a0908,rgba(10,9,8,.2) 44%,transparent 66%)" }} />

      {/* the sign's own glow at the wall-lion anchor: lit while the crest is embedded, dies as it lifts away */}
      {intro && (
        <motion.div aria-hidden className="pointer-events-none absolute z-[6] rounded-full"
          style={{ left: `${WALL.x * 100}%`, top: `${WALL.y * 100}%`, translate: "-50% -50%", width: "min(52vw,560px)", aspectRatio: "1", background: "radial-gradient(circle,rgba(252,202,110,.32),transparent 60%)" }}
          initial={false} animate={{ opacity: lifted ? 0 : 1 }} transition={{ duration: lifted ? 1.2 : 0 }} />
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-24">
        {/* the ICON: top slice of the lockup. fades in quickly on the wall sign, then lifts off, brightens, glows and floats.
            crestRef is the OUTER box (never transformed, so it measures as the clean resting layout); the inner div carries the transform. */}
        <div ref={crestRef} className="mx-auto w-[clamp(210px,36vw,340px)]">
          <motion.div className="will-change-transform" style={{ transformOrigin: "50% 50%", transformPerspective: 1100 }}
            initial={false}
            animate={!start && intro ? { opacity: 0 } : lifted
              ? { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0, skewX: 0, filter: LIFTED }
              : { opacity: 1, x: start!.x, y: start!.y, scale: start!.scale, rotateX: TILT.rotateX, rotateY: TILT.rotateY, skewX: TILT.skewX, filter: EMBEDDED }}
            transition={lifted
              ? { duration: 1.6, ease: [0.16, 1, 0.3, 1], filter: { duration: 1.5 } }
              : { opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, default: { duration: 0 } }}>
            <motion.div className="w-full overflow-hidden" style={{ aspectRatio: `1 / ${LION_FRAC * LOCKUP_AR}` }}
              animate={lifted ? { y: [0, -7, 0] } : { y: 0 }}
              transition={lifted ? { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.9 } : { duration: 0 }}>
              <img src={img("logo-lockup-gold.png")} alt="" aria-hidden className="block w-full" />
            </motion.div>
          </motion.div>
        </div>
        {/* the WORDMARK: bottom slice of the SAME lockup (so the gold matches the icon exactly), fades in mid-transition */}
        <motion.div className="-mt-1" initial={false}
          animate={lifted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: lifted && intro ? 0.6 : 0 }}>
          <div className="mx-auto w-[clamp(210px,36vw,340px)] overflow-hidden" style={{ aspectRatio: `1 / ${(1 - WORD_TOP) * LOCKUP_AR}` }}>
            <img src={img("logo-lockup-gold.png")} alt="Leoz Gents Salon" className="block w-full" style={{ marginTop: `${-WORD_TOP * LOCKUP_AR * 100}%` }} />
          </div>
        </motion.div>
        <motion.p className="mx-auto mt-7 text-[11px] uppercase tracking-[0.42em] text-gold-lite" {...text(0.9)}>Est. 2012 · Dubai</motion.p>
        <motion.p className="mx-auto mt-5 max-w-xl text-[clamp(16px,1.6vw,19px)] font-light leading-relaxed text-[#ddd8cf]" {...text(1.05)}>
          A king's grooming. Precise cuts, the <span className="font-medium text-gold-lite">royal shave</span>, and care worthy of a gentleman, in the heart of Dubai.
        </motion.p>
        <motion.div className="mt-9 flex flex-wrap items-center justify-center gap-5" {...text(1.2)}>
          <BookBtn>Book your chair</BookBtn>
          <span className="text-[12.5px] text-mut">or <span className="font-medium text-ink">walk in</span>, open till midnight, daily.</span>
        </motion.div>
      </div>
      <a href="#experience" onClick={(e) => smoothScroll(e, "#experience")} className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-mut2" aria-label="Scroll">
        <motion.svg width="15" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.4" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.4, repeat: Infinity }}><path d="M8 2v18M3 15l5 5 5-5" /></motion.svg>
      </a>
    </section>
  )
}

/* ===================== ALTERNATING FEATURE (Ruffians) ===================== */
export function Feature({ eyebrow, title, body, cta, image, flip, id, service, to }: { eyebrow: string; title: ReactNode; body: string; cta: string; image: string; flip?: boolean; id?: string; service?: string; to?: string }) {
  const { open } = useBooking()
  const ctaCls = "group mt-8 inline-flex items-center gap-2 border-b border-brass pb-1.5 text-[12px] uppercase tracking-[0.14em] text-gold-lite"
  const ctaInner = <>{cta}<ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" /></>
  return (
    <section id={id} className="mx-auto max-w-[1320px] px-5 py-[clamp(60px,10vw,120px)] sm:px-8 lg:px-14">
      <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal className={flip ? "lg:pl-6" : "lg:pr-6"}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <h2 className="mt-5 text-[clamp(28px,4vw,46px)] font-light leading-[1.08] tracking-[-0.02em]">{title}</h2>
          <p className="mt-6 max-w-md text-[15px] font-light text-mut">{body}</p>
          {to ? (
            <Link to={to} className={ctaCls}>{ctaInner}</Link>
          ) : (
            <button type="button" onClick={() => open(service ? { service } : undefined)} className={ctaCls}>{ctaInner}</button>
          )}
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
export function Ritual() {
  const { open } = useBooking()
  return (
    <section id="ritual" className="relative flex min-h-[86vh] items-center overflow-hidden">
      <div className="absolute inset-0"><img src={img("lionsign.jpg")} alt="" className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 50%,rgba(9,8,5,.42),rgba(9,8,5,.8) 72%)" }} />
      <Reveal className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold-lite">The Royal Shave</p>
        <h2 className="mt-5 text-[clamp(30px,5.4vw,58px)] font-light leading-[1.08] tracking-[-0.02em]">A rite,<br /><em className="font-normal italic">not a routine.</em></h2>
        <p className="mx-auto mt-7 max-w-lg text-[15px] font-light text-[#d6d1c7]">Hot towel. Pre-shave oil. The slow glide of a single blade. The oldest ritual a man keeps, restored to the ceremony it deserves. Crowned, unhurried, entirely yours.</p>
        <div className="mt-9">
          <button type="button" onClick={() => open({ service: "The Royal Shave" })} className="inline-flex items-center gap-2 rounded-sm border border-line2 px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold-lite">Reserve the ritual<ArrowUpRight size={15} /></button>
        </div>
      </Reveal>
    </section>
  )
}

/* ============================= MENU ============================= */
export const MENU: [string, [string, string][]][] = [
  ["Haircuts & Shaving", [["Haircut", "145"], ["Beard", "90"], ["Head shave", "110"], ["Hot oil treatment", "220"], ["Hair treatment blow out", "385"]]],
  ["Facial & Skin", [["Express facial", "165"], ["Hyaluronic facial", "385"], ["Power C facial", "495"], ["Threading", "35"], ["Face wax", "65"]]],
  ["Massage & Body", [["Relaxing massage", "275"], ["Deep tissue", "385"], ["Hot stone", "495"], ["Foot massage · 60 min", "220"]]],
  ["Manicure & Pedicure", [["Manicure", "110"], ["Pedicure", "130"], ["Paraffin hands", "165"], ["Callus removal", "65"]]],
]
export function MenuSection() {
  return (
    <section id="services" className="border-y border-line bg-char py-[clamp(72px,11vw,130px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
        <SectionHead eyebrow="Services & Prices" title="A full gents salon." sub="Grooming, skin, body and care: the gentleman's essentials and the indulgences. Prices in AED." />
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

/* ========================= REVIEWS ========================= */
// real reviews - Alaa Taifor (Google) + Fresha (5.0 from 211); quotes used verbatim
export const REVIEWS: { quote: string; name: string; src: string }[] = [
  { quote: "Very calm and very attentive. Great attention to detail.", name: "Reece T.", src: "Fresha review" },
  { quote: "It's an every Friday tidy up for me, and always a great cut.", name: "Shaun B.", src: "Fresha review" },
  { quote: "Barely had to tell him what to do. He knew exactly what I wanted the second I got on the chair.", name: "Salman", src: "Fresha review" },
]
export function Proof() {
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
export const BRANCHES: [string, string, string, string][] = [["Palm Jumeirah", "reception.jpg", "+971 4 575 8377", "tel:+97145758377"], ["Sky Gardens", "lounge.jpg", "+971 4 288 5059", "tel:+97142885059"]]
export function Locations() {
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
