import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

// auto-includes every image in src/assets/gallery (fresh shoots only — nothing reused elsewhere on the page)
const IMAGES = Object.entries(import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url as string)

export default function Gallery() {
  const [idx, setIdx] = useState<number | null>(null)
  const close = useCallback(() => setIdx(null), [])
  const go = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + IMAGES.length) % IMAGES.length)), [])

  useEffect(() => {
    if (idx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      else if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev }
  }, [idx, close, go])

  return (
    <section id="gallery" className="py-[clamp(72px,11vw,130px)]">
      <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">The Space</p>
          <h2 className="mt-4 text-[clamp(28px,4.2vw,48px)] font-light leading-[1.1] tracking-[-0.02em]">Inside Leoz.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[14.5px] font-light text-mut">Marble, warm light, the gold lion — and the craft beneath it. Step inside.</p>
        </div>

        {/* uniform grid — big equal tiles, staggered reveal, click to open */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {IMAGES.map((src, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-line2/50 outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`Open photo ${i + 1} of ${IMAGES.length}`}
            >
              <img src={src} alt={`Inside Leoz Gents Salon — ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {idx !== null && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close} role="dialog" aria-modal="true" aria-label="Gallery image"
          >
            <button className="absolute right-5 top-5 text-mut transition-colors hover:text-ink" aria-label="Close" onClick={close}><X size={26} /></button>
            <button className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-line2 p-2 text-mut transition-colors hover:border-gold hover:text-gold-lite sm:left-6" aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1) }}><ChevronLeft size={22} /></button>
            <motion.img key={idx} src={IMAGES[idx]} alt="" className="max-h-[86vh] max-w-[92vw] rounded-sm object-contain shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)]" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-line2 p-2 text-mut transition-colors hover:border-gold hover:text-gold-lite sm:right-6" aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1) }}><ChevronRight size={22} /></button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.1em] text-mut2">{idx + 1} / {IMAGES.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
