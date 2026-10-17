import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import Lenis from "lenis"
import App from "./App"
import "./index.css"

// smooth, cinematic scroll - disabled for reduced-motion
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  ;(window as unknown as { lenis: Lenis }).lenis = lenis
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
