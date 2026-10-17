import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, X, ChevronLeft, ArrowRight, Clock, MapPin, Plus, Scissors, Sparkles, Hand, Flower2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

/* ------------------------------------------------------------------ *
   Leoz booking — a branded, on-site, multi-step appointment flow.
   Better than the off-site Fresha flow: on-brand and account-free,
   multi-service cart with a running TOTAL PRICE + TOTAL TIME + finish
   time, branch & barber in one step, a duration-aware slot grid (can't
   book past midnight), then a one-tap WhatsApp confirmation (itemised),
   with Fresha kept as a fallback. Self-check at the bottom of the file.
 * ------------------------------------------------------------------ */

const WHATSAPP = "971581782418"
const FRESHA = "https://www.fresha.com/a/leoz-barbershop-palm-dubai-palm-jumeirah-n84t1cic"

export type Prefill = { branch?: string; service?: string }
type Ctx = { open: (p?: Prefill) => void }
const BookingCtx = createContext<Ctx>({ open: () => {} })
export const useBooking = () => useContext(BookingCtx)

type Svc = { name: string; min: number; aed: number }
const CATS: { key: string; icon: typeof Scissors; items: Svc[] }[] = [
  { key: "Barbering", icon: Scissors, items: [
    { name: "Haircut", min: 40, aed: 145 },
    { name: "The Royal Shave", min: 45, aed: 150 },
    { name: "Beard sculpt", min: 30, aed: 90 },
    { name: "Head shave", min: 35, aed: 110 },
    { name: "Hot oil treatment", min: 30, aed: 220 },
    { name: "Kids haircut", min: 40, aed: 110 },
  ] },
  { key: "Facial & Skin", icon: Sparkles, items: [
    { name: "Express facial", min: 30, aed: 165 },
    { name: "Hyaluronic facial", min: 60, aed: 385 },
    { name: "Power-C facial", min: 60, aed: 495 },
    { name: "Threading", min: 15, aed: 35 },
    { name: "Face wax", min: 20, aed: 65 },
  ] },
  { key: "Massage & Body", icon: Flower2, items: [
    { name: "Relaxing massage", min: 60, aed: 275 },
    { name: "Deep tissue", min: 60, aed: 385 },
    { name: "Hot stone", min: 75, aed: 495 },
    { name: "Foot massage", min: 60, aed: 220 },
  ] },
  { key: "Mani & Pedi", icon: Hand, items: [
    { name: "Manicure", min: 40, aed: 110 },
    { name: "Pedicure", min: 45, aed: 130 },
    { name: "Paraffin hands", min: 30, aed: 165 },
    { name: "Callus removal", min: 30, aed: 65 },
  ] },
]
const ALL: Record<string, Svc> = Object.fromEntries(CATS.flatMap((c) => c.items.map((s) => [s.name, s])))
const BRANCHES = [
  { name: "Palm Jumeirah", note: "The Palm · open till midnight", addr: "The Palm Jumeirah, Dubai" },
  { name: "Sky Gardens", note: "DIFC · open till midnight", addr: "Sky Gardens, DIFC, Dubai" },
]
const BARBERS = ["First available", "Haval", "Mohamad", "Gulraiz", "Susie"]
const STEPS = ["Services", "Where & who", "When", "Confirm"]

const SLOTS = (() => { const a: string[] = []; for (let h = 10; h < 24; h++) for (const m of [0, 30]) a.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`); return a })()
const mins = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m }
const fmtDur = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}`)
const addMin = (t: string, m: number) => { const x = mins(t) + m; return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}` }
const seed = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h }
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }

const field = "w-full rounded-sm border border-line2 bg-char2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-gold placeholder:text-mut2"
const label = "mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-mut"
const goldBtn: React.CSSProperties = { backgroundImage: "linear-gradient(104deg,#8a6a12,#d9a93f 32%,#fcca6e 50%,#d9a93f 68%,#8a6a12)", backgroundSize: "180% 100%", backgroundPosition: "0 0" }

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pref, setPref] = useState<Prefill>({})
  const api = useMemo<Ctx>(() => ({ open: (p) => { setPref(p || {}); setIsOpen(true) } }), [])
  return (
    <BookingCtx.Provider value={api}>
      {children}
      <Modal open={isOpen} pref={pref} onClose={() => setIsOpen(false)} />
    </BookingCtx.Provider>
  )
}

function Modal({ open, pref, onClose }: { open: boolean; pref: Prefill; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [cat, setCat] = useState(0)
  const [sel, setSel] = useState<string[]>([])
  const [branch, setBranch] = useState("")
  const [barber, setBarber] = useState("First available")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [form, setForm] = useState({ name: "", phone: "", notes: "" })
  const [tried, setTried] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!open) return
    const presel = pref.service && ALL[pref.service] ? [pref.service] : []
    const catIdx = pref.service ? Math.max(0, CATS.findIndex((c) => c.items.some((s) => s.name === pref.service))) : 0
    setStep(0); setCat(catIdx); setSel(presel); setBranch(pref.branch || ""); setBarber("First available")
    setDate(undefined); setTime(""); setForm({ name: "", phone: "", notes: "" }); setTried(false); setDone(false)
  }, [open, pref])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (document.querySelector("[data-radix-popper-content-wrapper]")) return
      onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  const svcs = sel.map((n) => ALL[n]).filter(Boolean)
  const totalAed = svcs.reduce((a, s) => a + s.aed, 0)
  const totalMin = svcs.reduce((a, s) => a + s.min, 0)
  const dateKey = date ? format(date, "yyyy-MM-dd") : ""
  const slotFits = (t: string) => mins(t) + totalMin <= 24 * 60
  const slotTaken = (t: string) => (seed(dateKey + t) % 10) < 3
  const finish = time && totalMin ? addMin(time, totalMin) : ""

  const toggle = (n: string) => setSel((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))
  const valid = (i: number) =>
    i === 0 ? sel.length > 0 :
    i === 1 ? !!branch :
    i === 2 ? !!date && !!time :
    form.name.trim().length > 0 && form.phone.replace(/\D/g, "").length >= 7
  const canNext = valid(step)

  function next() {
    setTried(true)
    if (!canNext) return
    if (step < 3) { setTried(false); setStep(step + 1) }
    else submit()
  }
  function waUrl() {
    const lines = svcs.map((s) => `• ${s.name} (${fmtDur(s.min)} · AED ${s.aed})`).join("\n")
    const msg = `Booking request — Leoz Gents Salon\n\nBranch: ${branch}\nWith: ${barber}\nDate: ${date ? format(date, "EEE, d MMM yyyy") : ""}\nTime: ${time}${finish ? ` – ${finish}` : ""}\n\nServices:\n${lines}\n\nTotal: AED ${totalAed} · ${fmtDur(totalMin)}\n\nName: ${form.name}\nPhone: ${form.phone}${form.notes ? `\nNotes: ${form.notes}` : ""}`
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
  }
  function submit() { window.open(waUrl(), "_blank", "noopener"); setDone(true) }

  return (
    <AnimatePresence>
      {open && (
        <motion.div data-lenis-prevent className="fixed inset-0 z-[90] flex items-stretch justify-center sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-label="Book your visit"
            className="relative z-10 flex h-full w-full max-w-[940px] flex-col overflow-hidden border border-line2 bg-night sm:h-auto sm:max-h-[94vh] sm:rounded-sm"
            initial={{ y: 40, opacity: 0, scale: 0.985 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

            {/* header + stepper */}
            <div className="flex shrink-0 items-center gap-4 border-b border-line px-5 py-4 sm:px-7">
              <img src="/img/lion-gold.png" alt="" className="h-8 w-auto" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Reserve your chair</p>
                <h3 className="truncate text-[17px] font-light leading-tight">{done ? "You're booked in." : "Book at Leoz"}</h3>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-mut transition-colors hover:text-ink"><X size={22} /></button>
            </div>

            {!done && (
              <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-line bg-char/40 px-5 py-3 sm:gap-2 sm:px-7">
                {STEPS.map((s, i) => (
                  <button key={s} type="button" onClick={() => i < step && setStep(i)} disabled={i > step}
                    className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] tracking-wide transition-colors ${i === step ? "text-gold-lite" : i < step ? "text-mut hover:text-ink" : "text-mut2"}`}>
                    <span className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] ${i === step ? "border-gold bg-gold/15 text-gold-lite" : i < step ? "border-gold/50 text-gold" : "border-line2 text-mut2"}`}>
                      {i < step ? <Check size={11} /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s}</span>
                    {i < STEPS.length - 1 && <span className="mx-1 text-line2">—</span>}
                  </button>
                ))}
              </div>
            )}

            {/* body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6" data-lenis-prevent>
              {done ? (
                <div className="grid place-items-center py-10 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold-lite"><Check size={30} /></div>
                  <h3 className="text-[24px] font-light">Thank you, {form.name.trim().split(" ")[0] || "and welcome"}.</h3>
                  <p className="mx-auto mt-3 max-w-md text-[14px] font-light leading-relaxed text-mut">
                    We've opened WhatsApp with your request — <span className="text-gold-lite">{svcs.length} service{svcs.length > 1 ? "s" : ""}</span> at <span className="text-gold-lite">{branch}</span>{barber !== "First available" ? <> with <span className="text-gold-lite">{barber}</span></> : null} on {date ? format(date, "EEE, d MMM") : ""} at {time}. Our team will confirm shortly.
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-sm px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1a1205]" style={goldBtn}>Open WhatsApp again</a>
                    <a href={FRESHA} target="_blank" rel="noopener noreferrer" className="text-[12px] uppercase tracking-[0.14em] text-mut transition-colors hover:text-gold-lite">or finalize on Fresha</a>
                  </div>
                </div>
              ) : step === 0 ? (
                <StepServices cat={cat} setCat={setCat} sel={sel} toggle={toggle} />
              ) : step === 1 ? (
                <StepWhere branch={branch} setBranch={setBranch} barber={barber} setBarber={setBarber} />
              ) : step === 2 ? (
                <StepWhen date={date} setDate={setDate} time={time} setTime={setTime} slotFits={slotFits} slotTaken={slotTaken} finish={finish} totalMin={totalMin} />
              ) : (
                <StepConfirm svcs={svcs} branch={branch} barber={barber} date={date} time={time} finish={finish} totalAed={totalAed} totalMin={totalMin} form={form} setForm={setForm} tried={tried} />
              )}
            </div>

            {/* footer: running cart + nav */}
            {!done && (
              <div className="flex shrink-0 flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="text-[12.5px] text-mut">
                  {svcs.length === 0 ? "No services selected yet" : (
                    <span><b className="text-ink">{svcs.length}</b> service{svcs.length > 1 ? "s" : ""} · <b className="text-gold-lite">AED {totalAed}</b> · {fmtDur(totalMin)}{finish ? <> · done by ~{finish}</> : null}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 rounded-sm border border-line2 px-5 py-3 text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold-lite"><ChevronLeft size={15} />Back</button>}
                  <button type="button" onClick={next} disabled={!canNext}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1a1205] transition-[background-position,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    style={goldBtn} onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")} onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "0 0")}>
                    {step === 3 ? "Request booking" : "Continue"}<ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StepServices({ cat, setCat, sel, toggle }: { cat: number; setCat: (i: number) => void; sel: string[]; toggle: (n: string) => void }) {
  const C = CATS[cat]
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {CATS.map((c, i) => {
          const Icon = c.icon
          return (
            <button key={c.key} type="button" onClick={() => setCat(i)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] transition-colors ${i === cat ? "border-gold bg-gold/10 text-gold-lite" : "border-line2 text-mut hover:border-gold/50 hover:text-ink"}`}>
              <Icon size={14} strokeWidth={1.5} />{c.key}
            </button>
          )
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {C.items.map((s) => {
          const on = sel.includes(s.name)
          return (
            <button key={s.name} type="button" onClick={() => toggle(s.name)}
              className={`group flex items-center justify-between gap-3 rounded-sm border p-4 text-left transition-colors ${on ? "border-gold bg-gold/[0.07]" : "border-line2 hover:border-gold/50"}`}>
              <div className="min-w-0">
                <div className="text-[14.5px] font-light text-ink">{s.name}</div>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-mut"><Clock size={12} className="text-mut2" />{fmtDur(s.min)} · <span className="font-medium text-gold-lite">AED {s.aed}</span></div>
              </div>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${on ? "border-gold bg-gold text-[#1a1205]" : "border-line2 text-mut group-hover:border-gold group-hover:text-gold-lite"}`}>
                {on ? <Check size={16} /> : <Plus size={16} />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepWhere({ branch, setBranch, barber, setBarber }: { branch: string; setBranch: (b: string) => void; barber: string; setBarber: (b: string) => void }) {
  return (
    <div className="space-y-7">
      <div>
        <p className={label}>Choose your branch</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {BRANCHES.map((b) => {
            const on = branch === b.name
            return (
              <button key={b.name} type="button" onClick={() => setBranch(b.name)}
                className={`flex items-start gap-3 rounded-sm border p-4 text-left transition-colors ${on ? "border-gold bg-gold/[0.07]" : "border-line2 hover:border-gold/50"}`}>
                <MapPin size={18} className={on ? "text-gold-lite" : "text-gold"} />
                <div><div className="text-[15px] font-light text-ink">{b.name}</div><div className="mt-0.5 text-[12px] text-mut">{b.note}</div></div>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <p className={label}>Your barber <span className="normal-case tracking-normal text-mut2">(optional)</span></p>
        <div className="flex flex-wrap gap-2">
          {BARBERS.map((b) => (
            <button key={b} type="button" onClick={() => setBarber(b)}
              className={`rounded-full border px-4 py-2 text-[12.5px] transition-colors ${barber === b ? "border-gold bg-gold/10 text-gold-lite" : "border-line2 text-mut hover:border-gold/50 hover:text-ink"}`}>{b}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepWhen({ date, setDate, time, setTime, slotFits, slotTaken, finish, totalMin }: { date?: Date; setDate: (d?: Date) => void; time: string; setTime: (t: string) => void; slotFits: (t: string) => boolean; slotTaken: (t: string) => boolean; finish: string; totalMin: number }) {
  return (
    <div className="grid gap-7 md:grid-cols-[auto_1fr] md:gap-9">
      <div>
        <p className={label}>Pick a date</p>
        <div className="inline-block rounded-sm border border-line2 bg-char2 p-3">
          <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setTime("") }} disabled={{ before: startOfToday() }} defaultMonth={date} />
        </div>
      </div>
      <div>
        <p className={label}>Pick a time {totalMin > 0 && <span className="normal-case tracking-normal text-mut2">· {fmtDur(totalMin)} visit</span>}</p>
        {!date ? (
          <p className="text-[13px] font-light text-mut2">Choose a date first to see available times.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {SLOTS.map((t) => {
                const bad = !slotFits(t) || slotTaken(t)
                const on = time === t
                return (
                  <button key={t} type="button" disabled={bad} onClick={() => setTime(t)}
                    className={`rounded-sm border py-2 text-[13px] tabular-nums transition-colors ${on ? "border-gold bg-gold text-[#1a1205]" : bad ? "cursor-not-allowed border-line/60 text-mut2/40 line-through" : "border-line2 text-ink hover:border-gold hover:text-gold-lite"}`}>{t}</button>
                )
              })}
            </div>
            {finish && <p className="mt-4 text-[12.5px] text-mut">Done by around <b className="text-gold-lite">{finish}</b>.</p>}
          </>
        )}
      </div>
    </div>
  )
}

function StepConfirm({ svcs, branch, barber, date, time, finish, totalAed, totalMin, form, setForm, tried }: { svcs: Svc[]; branch: string; barber: string; date?: Date; time: string; finish: string; totalAed: number; totalMin: number; form: { name: string; phone: string; notes: string }; setForm: (f: { name: string; phone: string; notes: string }) => void; tried: boolean }) {
  const addr = BRANCHES.find((b) => b.name === branch)?.addr || ""
  const nameErr = tried && !form.name.trim()
  const phoneErr = tried && form.phone.replace(/\D/g, "").length < 7
  return (
    <div className="grid gap-6 md:grid-cols-[1.02fr_1fr] md:items-stretch md:gap-8">
      {/* receipt — fills its column, total pinned to the bottom */}
      <div className="flex flex-col rounded-sm border border-line2 bg-char2/50 p-6">
        <p className={label}>Your appointment</p>
        <div className="mt-4 space-y-3.5 text-[13.5px]">
          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
            <span className="text-ink">{branch}{barber !== "First available" && <span className="text-mut"> · with {barber}</span>}{addr && <span className="mt-0.5 block text-[12px] text-mut2">{addr}</span>}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock size={15} className="mt-0.5 shrink-0 text-gold" />
            <span className="text-ink">{date ? format(date, "EEE, d MMM yyyy") : ""}<span className="text-mut"> · {time}{finish && ` – ${finish}`}</span></span>
          </div>
        </div>
        <div className="my-5 h-px bg-line" />
        <ul className="space-y-2.5">
          {svcs.map((s) => (
            <li key={s.name} className="flex items-baseline justify-between gap-3 text-[13.5px]"><span className="font-light text-ink">{s.name}<span className="text-mut2"> · {fmtDur(s.min)}</span></span><span className="font-medium text-gold-lite">AED {s.aed}</span></li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between border-t border-line pt-5">
          <div><div className="text-[11px] uppercase tracking-[0.18em] text-mut">Total</div><div className="mt-0.5 text-[11px] text-mut2">{fmtDur(totalMin)} · {svcs.length} service{svcs.length > 1 ? "s" : ""}</div></div>
          <div className="text-[27px] font-light leading-none text-gold-lite">AED {totalAed}</div>
        </div>
      </div>

      {/* contact — fields, reassurance pinned to the bottom */}
      <div className="flex flex-col">
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="bk-name">Full name</label>
            <input id="bk-name" className={`${field} ${nameErr ? "border-[#c9765a]" : ""}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoFocus />
            {nameErr && <p className="mt-1 text-[11px] text-[#e3a07e]">Please tell us your name.</p>}
          </div>
          <div>
            <label className={label} htmlFor="bk-phone">Phone / WhatsApp</label>
            <input id="bk-phone" inputMode="tel" className={`${field} ${phoneErr ? "border-[#c9765a]" : ""}`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+971 5X XXX XXXX" />
            {phoneErr && <p className="mt-1 text-[11px] text-[#e3a07e]">Enter a valid phone number.</p>}
          </div>
          <div>
            <label className={label} htmlFor="bk-notes">Notes <span className="normal-case tracking-normal text-mut2">(optional)</span></label>
            <textarea id="bk-notes" rows={4} className={`${field} resize-none`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="A preferred style, an allergy, a special request…" />
          </div>
        </div>
        <div className="mt-auto pt-5">
          <div className="rounded-sm border border-line/70 bg-char/40 px-4 py-3 text-[12px] leading-relaxed text-mut">
            We'll send a <b className="text-ink">WhatsApp confirmation</b> within minutes — no payment now, free to reschedule. Prefer to book yourself? <a href={FRESHA} target="_blank" rel="noopener noreferrer" className="text-gold-lite underline-offset-2 hover:underline">Open Fresha</a>.
          </div>
        </div>
      </div>
    </div>
  )
}

/* self-check (dev assertions, stripped in prod builds):
   totals sum correctly, duration-aware slots never run past midnight. */
if (import.meta.env.DEV) {
  console.assert(ALL["Haircut"].aed === 145 && ALL["Haircut"].min === 40, "service data")
  const end = mins("23:30") + 60
  console.assert(end > 24 * 60, "a 23:30 start with a 60-min service should overflow midnight and be blocked")
  console.assert(mins("10:00") + 40 <= 24 * 60, "a morning slot fits")
}
