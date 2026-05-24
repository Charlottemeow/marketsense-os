'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NoteEntry {
  date: string
  id: string
}

interface NoteHistoryCalendarProps {
  notes: NoteEntry[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  currentMonth?: Date
  onMonthChange?: (date: Date) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function NoteHistoryCalendar({
  notes,
  selectedDate,
  onSelectDate,
  currentMonth: externalMonth,
  onMonthChange,
}: NoteHistoryCalendarProps) {
  const { t } = useLanguage()
  const [internalMonth, setInternalMonth] = useState(new Date())
  const currentMonth = externalMonth ?? internalMonth

  const noteDates = useMemo(() => {
    const set = new Set(notes.map(n => n.date))
    return set
  }, [notes])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()

    const days: { date: Date | null }[] = []
    for (let i = 0; i < startPad; i++) {
      days.push({ date: null })
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d) })
    }
    return days
  }, [currentMonth])

  const formatDate = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const prevMonth = () => {
    const d = new Date(currentMonth)
    d.setMonth(d.getMonth() - 1)
    if (onMonthChange) onMonthChange(d)
    else setInternalMonth(d)
  }

  const nextMonth = () => {
    const d = new Date(currentMonth)
    d.setMonth(d.getMonth() + 1)
    if (onMonthChange) onMonthChange(d)
    else setInternalMonth(d)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-card-hover rounded transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted" />
        </button>
        <span className="text-sm font-medium text-foreground">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-card-hover rounded transition-colors">
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(day => (
          <div key={day} className="text-center text-xs text-muted font-medium py-1">
            {day}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          if (!day.date) {
            return <div key={`empty-${i}`} />
          }
          const dateStr = formatDate(day.date)
          const hasNote = noteDates.has(dateStr)
          const isSelected = selectedDate === dateStr
          const isToday = formatDate(new Date()) === dateStr

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'text-center text-xs py-1.5 rounded transition-colors relative',
                isSelected
                  ? 'bg-accent text-accent-foreground'
                  : hasNote
                    ? 'bg-accent/10 text-foreground hover:bg-accent/20'
                    : 'text-muted hover:bg-card-hover',
                isToday && !isSelected && 'ring-1 ring-border',
              )}
            >
              {day.date.getDate()}
              {hasNote && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-muted">
        {notes.length} {t('notes.history')}
      </div>
    </div>
  )
}
