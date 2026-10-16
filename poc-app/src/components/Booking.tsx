import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, X, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const WHATSAPP = "971581782418"
const FRESHA = "https://www.fresha.com/book-now/leo-barbershop-gh2f7o6x"

export type Prefill = { branch?: string; service?: string }
type Ctx = { open: (p?: Prefill) => void }
const BookingCtx = createContext<Ctx>({ open: () => {} })
export const useBooking = () => useContext(BookingCtx)

const BRANCHES = ["Palm Jumeirah", "Sky Gardens"]
const SERVICES: [string, string[]][] = [
  ["Barbering", ["The Royal Shave", "Haircut", "Beard Sculpt", "Head shave", "Hot oil treatment"]],
  ["Facial & Skin", ["Express facial", "Facial — hyaluronic", "Facial — power C"]],
  ["Massage & Body", ["Relaxing massage", "Deep tissue", "Hot stone"]],
  ["Manicure & Pedicure", ["Manicure", "Pedicure"]],
]
const TIMES = (() => { const t: string[] = []; for (let h = 10; h < 24; h++) for (const m of ["00", "30"]) t.push(`${String(h).padStart(2, "0")}:${m}`); return t })()
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }

const field = "w-full rounded-sm border border-line2 bg-char2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-gold placeholder:text-mut2"
const label = "mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-mut"
const errCls = "mt-1 text-[11px] text-[#e3a07e]"
const errBorder = "border-[#c9765a]"
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
  const empty = { name: "", phone: "", branch: "", service: "", time: "", notes: "" }
  const [form, setForm] = useState(empty)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateOpen, setDateOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) { setForm({ ...empty, branch: pref.branch || "", service: pref.service || "" }); setDate(undefined); setDateOpen(false); setErrors({}); setDone(false) }
  }, [open, pref]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (document.querySelector("[data-radix-popper-content-wrapper]")) return // let an open Select/Popover handle Esc first
      onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })) }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Please tell us your name."
    if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number."
    if (!form.branch) e.branch = "Choose a branch."
    if (!form.service) e.service = "Choose a service."
    if (!date) e.date = "Pick a date."
    if (!form.time) e.time = "Pick a time."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const dateLabel = date ? format(date, "EEE, d MMM yyyy") : ""
  function waUrl() {
    const msg = `Booking request — Leoz Gents Salon\n\nName: ${form.name}\nPhone: ${form.phone}\nBranch: ${form.branch}\nService: ${form.service}\nDate: ${dateLabel}\nTime: ${form.time}${form.notes ? `\nNotes: ${form.notes}` : ""}`
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
  }
  function submit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    window.open(waUrl(), "_blank", "noopener")
    setDone(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-label="Book your chair"
            className="relative z-10 max-h-[94vh] w-full max-w-lg overflow-y-auto border border-line2 bg-night sm:rounded-sm"
            initial={{ y: 48, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 text-mut transition-colors hover:text-ink"><X size={22} /></button>

            {done ? (
              <div className="px-7 py-14 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold-lite"><Check size={30} /></div>
                <h3 className="text-[25px] font-light">Thank you, {form.name.trim().split(" ")[0]}.</h3>
                <p className="mx-auto mt-3 max-w-sm text-[14px] font-light leading-relaxed text-mut">
                  We've opened WhatsApp to confirm your <span className="text-gold-lite">{form.service}</span> at <span className="text-gold-lite">{form.branch}</span> on {dateLabel} at {form.time}. Our team will reply shortly.
                </p>
                <div className="mt-8 flex flex-col items-center gap-4">
                  <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-sm px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1a1205]" style={goldBtn}>Open WhatsApp again</a>
                  <a href={FRESHA} target="_blank" rel="noopener noreferrer" className="text-[12px] uppercase tracking-[0.14em] text-mut transition-colors hover:text-gold-lite">or finalize on Fresha</a>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="px-6 py-8 sm:px-8">
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Reserve your chair</p>
                <h3 className="mt-2 text-[24px] font-light leading-tight">Book at Leoz</h3>
                <p className="mt-1.5 text-[13px] font-light text-mut">Tell us the details — we'll confirm on WhatsApp.</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className={label} htmlFor="bk-name">Full name</label>
                    <input id="bk-name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" autoFocus />
                    {errors.name && <p className={errCls}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-phone">Phone / WhatsApp</label>
                    <input id="bk-phone" inputMode="tel" className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+971 5X XXX XXXX" />
                    {errors.phone && <p className={errCls}>{errors.phone}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={label}>Branch</label>
                      <Select value={form.branch} onValueChange={(v) => set("branch", v)}>
                        <SelectTrigger className={errors.branch ? errBorder : ""} aria-label="Branch"><SelectValue placeholder="Select a branch" /></SelectTrigger>
                        <SelectContent>{BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                      {errors.branch && <p className={errCls}>{errors.branch}</p>}
                    </div>
                    <div>
                      <label className={label}>Service</label>
                      <Select value={form.service} onValueChange={(v) => set("service", v)}>
                        <SelectTrigger className={errors.service ? errBorder : ""} aria-label="Service"><SelectValue placeholder="Select a service" /></SelectTrigger>
                        <SelectContent>
                          {SERVICES.map(([g, items]) => (
                            <SelectGroup key={g}><SelectLabel>{g}</SelectLabel>{items.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service && <p className={errCls}>{errors.service}</p>}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={label}>Date</label>
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                          <button type="button" className={`${field} flex items-center justify-between text-left ${errors.date ? errBorder : ""} ${!date ? "text-mut2" : ""}`}>
                            {date ? dateLabel : "Pick a date"}
                            <CalendarIcon className="h-4 w-4 shrink-0 text-mut opacity-80" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto">
                          <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setErrors((e) => ({ ...e, date: "" })); if (d) setDateOpen(false) }} disabled={{ before: startOfToday() }} defaultMonth={date} initialFocus />
                        </PopoverContent>
                      </Popover>
                      {errors.date && <p className={errCls}>{errors.date}</p>}
                    </div>
                    <div>
                      <label className={label}>Time</label>
                      <Select value={form.time} onValueChange={(v) => set("time", v)}>
                        <SelectTrigger className={errors.time ? errBorder : ""} aria-label="Time"><SelectValue placeholder="Select a time" /></SelectTrigger>
                        <SelectContent>{TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                      {errors.time && <p className={errCls}>{errors.time}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-notes">Notes <span className="text-mut2">(optional)</span></label>
                    <textarea id="bk-notes" rows={2} className={`${field} resize-none`} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="A preferred barber, a special request…" />
                  </div>
                </div>

                <button type="submit" className="mt-7 w-full rounded-sm px-7 py-4 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[#1a1205] transition-[background-position] duration-300"
                  style={goldBtn} onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")} onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "0 0")}>
                  Request booking
                </button>
                <p className="mt-3 text-center text-[11px] text-mut2">Prefer to book yourself? <a href={FRESHA} target="_blank" rel="noopener noreferrer" className="text-gold-lite underline-offset-2 hover:underline">Open Fresha</a> · open till midnight, walk-ins welcome.</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
