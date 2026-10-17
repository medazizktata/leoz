import { useEffect } from "react"
import { motion, useReducedMotion } from "motion/react"

/* First-mount intro loader, in the character of the P2P site loader (micdrop
   lineage): the mark reveals on a near-black screen with a gold accent, holds,
   then zooms up toward the viewer while the whole overlay fades to show the
   page. P2P writes its vector mark on stroke by stroke and blooms offset
   contour rings; the Leoz logo is a raster lockup, so the reveal is a
   scale/fade-in with a drawn-on gold hairline instead — same beats
   (reveal -> gold accent -> zoom + fade reveal), ~2.2s total.

   Mounted phase runs the intro; the zoom + fade is the AnimatePresence exit,
   triggered when onDone flips the gate in App. Reduced motion: logo held
   briefly, then a short fade, no zoom. Scroll (Lenis + native) is locked while
   it is up. */

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1] // the app's own reveal ease
const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

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

  const lockup = (
    <img
      src="/img/logo-lockup-gold.png"
      alt="Leoz Gents Salon"
      draggable={false}
      className="w-[min(68vw,340px)] select-none"
    />
  )

  if (reduce) {
    return (
      <motion.div
        aria-label="Loading"
        className="fixed inset-0 z-[9999] grid place-items-center bg-night"
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
      >
        {lockup}
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
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.75, ease: EXPO_OUT }}
        exit={{ scale: 4.8, transition: { duration: 0.9, ease: EASE_INOUT } }}
      >
        {/* gold bloom behind the mark — the restrained echo of P2P's contour rings */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute h-[120%] w-[120%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,180,90,0.22), transparent 62%)" }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: EXPO_OUT }}
        />
        <div className="relative grid justify-items-center gap-6">
          {lockup}
          {/* gold accent: a hairline that draws across, echoing the .brk motif */}
          <motion.span
            aria-hidden
            className="block h-px w-40 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-gold-lite), transparent)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.55, ease: EXPO_OUT }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
