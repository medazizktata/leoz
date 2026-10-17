import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Hero, Feature, Ritual, Proof, SectionHead, Reveal, img } from "../sections"

// a cross-category taste of the menu — the full list lives on /services
const SIGNATURE: [string, string][] = [
  ["Haircut", "145"],
  ["Head shave", "110"],
  ["Hyaluronic facial", "385"],
  ["Relaxing massage", "275"],
]

export default function Home() {
  return (
    <>
      <Hero />
      <Feature id="experience" eyebrow="The Salon"
        title={<>More than a cut.<br /><em className="font-normal italic">A ritual.</em></>}
        body="Leoz redefines men's grooming with an unwavering focus on luxury, precision and individualized care — for the modern gentleman who demands excellence. Traditional technique, modern craft, premium tools, in a room built to make routine grooming something you look forward to."
        cta="Step inside the salon" image={img("lounge.jpg")} to="/salon" />
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

      <Proof />
    </>
  )
}
