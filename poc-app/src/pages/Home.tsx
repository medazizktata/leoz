import { Link } from "react-router-dom"
import { ArrowRight, Crown, Scissors, Sparkles, Clock } from "lucide-react"
import { Hero, Feature, Ritual, Proof, SectionHead, Reveal, img } from "../sections"

// a cross-category taste of the menu — the full list lives on /services
const SIGNATURE: [string, string][] = [
  ["Haircut", "145"],
  ["Head shave", "110"],
  ["Hyaluronic facial", "385"],
  ["Relaxing massage", "275"],
]

const STATS: [string, string][] = [
  ["Since 2012", "A decade of craft"],
  ["Two homes", "Palm Jumeirah & Sky Gardens"],
  ["5.0 ★", "211 reviews on Fresha"],
  ["10 – 24h", "Open daily · walk-ins welcome"],
]

const PILLARS: [typeof Crown, string, string][] = [
  [Scissors, "Master barbers", "A trained team and a consultation first — every cut shaped to your face and your life."],
  [Crown, "The royal shave", "Hot towel, pre-shave oil and the slow glide of a single blade. The oldest ritual, restored."],
  [Sparkles, "Skin, body & care", "Facials, massage and mani-pedi — a full gentleman's salon, not only a barber's chair."],
  [Clock, "Open till midnight", "Two homes in Dubai, every day from 10:00 to 24:00. Book ahead, or simply walk in."],
]

// a few atmospheric frames as a teaser → the full gallery lives on /salon
const GAL = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" })
const pick = (name: string) => Object.entries(GAL).find(([p]) => p.includes(name))?.[1] as string | undefined
const TEASER = ["main-09", "main-10", "jum-21", "main-02", "main-06"].map(pick).filter(Boolean) as string[]

export default function Home() {
  return (
    <>
      <Hero />

      {/* trust / stats band */}
      <section className="border-y border-line bg-char">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4 lg:px-14">
          {STATS.map(([big, label], i) => (
            <Reveal key={label} delay={i * 0.05} className={`px-4 py-9 text-center ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""} ${i === 3 ? "md:border-l" : ""}`}>
              <div className="gold-grad text-[clamp(22px,3vw,34px)] font-light leading-none">{big}</div>
              <div className="mt-2.5 text-[10.5px] uppercase tracking-[0.18em] text-mut">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <Feature id="experience" eyebrow="The Salon"
        title={<>More than a cut.<br /><em className="font-normal italic">A ritual.</em></>}
        body="Leoz redefines men's grooming with an unwavering focus on luxury, precision and individualized care — for the modern gentleman who demands excellence. Traditional technique, modern craft, premium tools, in a room built to make routine grooming something you look forward to."
        cta="Step inside the salon" image={img("lounge.jpg")} to="/salon" />

      {/* why Leoz — pillars */}
      <section className="mx-auto max-w-[1320px] px-5 py-[clamp(50px,9vw,110px)] sm:px-8 lg:px-14">
        <SectionHead eyebrow="Why Leoz" title="Grooming, elevated." sub="Barbering at its best, the full range of a gentleman's salon, and a standard held since 2012." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(([Icon, title, body], i) => (
            <Reveal key={title} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-sm border border-line2 bg-char/40 p-7">
                <Icon size={24} className="text-gold" strokeWidth={1.4} />
                <h3 className="mt-5 text-[18px] font-light tracking-[0.01em]">{title}</h3>
                <p className="mt-2.5 text-[13.5px] font-light leading-relaxed text-mut">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Ritual />

      {/* signature services preview → full menu */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(60px,10vw,120px)] sm:px-8 lg:px-14">
        <SectionHead eyebrow="The Menu" title="Signature services." sub="A taste of the list — grooming, skin and body. The full menu and prices live on the services page." />
        <div className="mx-auto grid max-w-2xl gap-x-16 gap-y-1 sm:grid-cols-2">
          {SIGNATURE.map(([n, p], i) => (
            <Reveal key={n} delay={(i % 2) * 0.05}>
              <div className="flex items-baseline gap-3 border-b border-line/60 py-3">
                <span className="text-[14.5px] font-light text-ink">{n}</span>
                <span className="flex-1 translate-y-[-3px] border-b border-dotted border-[#443c27]" />
                <span className="text-[14px] font-medium text-gold-lite">{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link to="/services" className="group inline-flex items-center gap-2 rounded-sm border border-line2 px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold-lite">
            View full menu &amp; prices<ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* gallery teaser → the full gallery on /salon */}
      {TEASER.length >= 4 && (
        <section className="mx-auto max-w-[1320px] px-5 py-[clamp(50px,9vw,110px)] sm:px-8 lg:px-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">The Space</p>
              <h2 className="mt-4 text-[clamp(26px,3.6vw,42px)] font-light leading-[1.1] tracking-[-0.02em]">A room worth the visit.</h2>
            </div>
            <Link to="/salon#gallery" className="group inline-flex items-center gap-2 border-b border-brass pb-1.5 text-[12px] uppercase tracking-[0.14em] text-gold-lite">
              See the salon<ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TEASER.map((src, i) => (
              <Reveal key={i} delay={i * 0.05} className={i >= 3 ? "hidden sm:block" : ""}>
                <div className="overflow-hidden rounded-sm border border-line2/60">
                  <img src={src} alt="Inside Leoz Gents Salon" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Proof />
    </>
  )
}
