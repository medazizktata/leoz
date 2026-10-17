import { useEffect } from "react"
import { motion, useReducedMotion } from "motion/react"

/* First-mount intro loader: the mark reveals on a near-black screen, holds,
   then zooms up toward the viewer while concentric gold outlines bloom outward
   around it and the overlay fades to show the page.

   The Leoz lion is a raster icon, so the "leading lines" are concentric gold
   rings that bloom outward from the icon, innermost first (reveal -> rings
   bloom -> zoom + fade), ~2.2s total. The zoom + fade is the AnimatePresence
   exit, fired when onDone flips the gate in App. Reduced motion: the icon held
   briefly, then a short fade. Scroll (Lenis + native) is locked while it is up. */

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1] // the app's own reveal ease
const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

// concentric "leading lines" around the icon - [size (× icon), border opacity]
const RINGS: [number, number][] = [
  [1.28, 0.55],
  [1.68, 0.4],
  [2.14, 0.28],
  [2.66, 0.18],
  [3.24, 0.1],
]

const Icon = ({ className = "" }: { className?: string }) => (
  <img src={`${import.meta.env.BASE_URL}img/lion-gold.png`} alt="Leoz" draggable={false} className={`relative select-none w-[clamp(78px,13vw,124px)] ${className}`} />
)

export function Loader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const t = window.setTimeout(onDone, reduce ? 550 : 1300) // intro + hold; exit adds ~0.9s
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
      lenis?.start()
    }
  }, [onDone, reduce])

  if (reduce) {
    return (
      <motion.div
        aria-label="Loading"
        className="fixed inset-0 z-[9999] grid place-items-center bg-night"
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
      >
        <div className="relative grid place-items-center">
          <div aria-hidden className="pointer-events-none absolute aspect-square w-[160%] rounded-full border border-gold/25" />
          <Icon />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      aria-label="Loading"
      className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-night will-change-[opacity]"
      exit={{ opacity: 0, transition: { duration: 0.85, ease: "linear" } }}
    >
      <motion.div
        className="relative grid place-items-center will-change-transform"
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        exit={{ scale: 4.8, transition: { duration: 0.9, ease: EASE_INOUT } }}
      >
        {/* faint gold warmth behind the mark */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute aspect-square w-[150%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,180,90,0.2), transparent 64%)" }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: EXPO_OUT }}
        />

        {/* the leading lines: concentric gold rings blooming outward, innermost first */}
        {RINGS.map(([size, op], i) => (
          <motion.div
            key={i}
            aria-hidden
            className="pointer-events-none absolute aspect-square rounded-full border"
            style={{ width: `${size * 100}%`, borderColor: `rgba(224,196,120,${op})` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.38 + i * 0.1, duration: 0.85, ease: EXPO_OUT }}
          />
        ))}

        {/* icon only - no wordmark */}
        <motion.div
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.75, ease: EXPO_OUT }}
          className="relative grid place-items-center"
        >
          <Icon />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
