import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("select-none", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-3",
        caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-[13px] font-medium text-ink",
        nav: "flex items-center",
        nav_button:
          "inline-flex h-7 w-7 items-center justify-center rounded-sm border border-line2 text-mut transition-colors hover:border-gold hover:text-gold-lite",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "flex h-8 w-9 items-center justify-center text-[10px] uppercase tracking-wide text-mut2",
        row: "mt-0.5 flex w-full",
        cell: "relative h-9 w-9 p-0 text-center",
        day: "inline-flex h-9 w-9 items-center justify-center rounded-sm text-[13px] font-light text-ink transition-colors hover:bg-char2 aria-selected:opacity-100",
        day_selected: "!bg-gold !font-medium !text-[#1a1205] hover:!bg-gold-lite",
        day_today: "text-gold-lite",
        day_outside: "text-mut2 opacity-40",
        day_disabled: "cursor-not-allowed text-mut2 opacity-25 hover:bg-transparent",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
