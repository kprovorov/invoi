"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function toDate(value: string): Date | undefined {
  if (!value) return undefined
  return new Date(value + 'T00:00:00')
}

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-9 w-full border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] px-3 text-[13px] text-left flex items-center justify-between gap-2 focus:outline-none focus:border-[#111111] transition-colors",
            value ? "text-[#111111]" : "text-[#BBBBBB]",
            className
          )}
        >
          <span>{value ? formatDate(value) : placeholder}</span>
          <CalendarIcon size={13} className="text-[#888888] shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={toDate(value)}
          onSelect={(date) => {
            if (date) {
              const y = date.getFullYear()
              const m = String(date.getMonth() + 1).padStart(2, '0')
              const d = String(date.getDate()).padStart(2, '0')
              onChange(`${y}-${m}-${d}`)
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
