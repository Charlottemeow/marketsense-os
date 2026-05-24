'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import DailyNoteForm from '@/components/notes/daily-note-form'
import NoteHistoryCalendar from '@/components/notes/note-history-calendar'
import { ArrowUpRight } from 'lucide-react'

const MOCK_NOTES = [
  { id: '1', date: '2025-05-14' },
  { id: '2', date: '2025-05-13' },
  { id: '3', date: '2025-05-10' },
  { id: '4', date: '2025-05-08' },
  { id: '5', date: '2025-05-05' },
]

export default function NotesPage() {
  const { t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (note: any) => {
    setIsSaving(true)
    // Mock: simulate API call
    await new Promise(r => setTimeout(r, 600))
    console.log('Note saved:', note)
    setIsSaving(false)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-foreground">{t('notes.title')}</h1>
          <p className="text-sm text-muted mt-1">Structured market journal</p>
        </div>
        <Link
          href="/notes/why-did-it-move"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm text-foreground hover:bg-card-hover transition-colors"
        >
          {t('notes.whyMove')}
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {selectedDate ? `Note for ${selectedDate}` : 'New Note'}
          </h2>
          <DailyNoteForm onSave={handleSave} isSaving={isSaving} />
        </div>

        <div className="space-y-4">
          <NoteHistoryCalendar
            notes={MOCK_NOTES}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Total notes</span>
                <span className="text-foreground font-mono tabular-nums">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">This month</span>
                <span className="text-foreground font-mono tabular-nums">{MOCK_NOTES.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Avg confidence</span>
                <span className="text-foreground font-mono tabular-nums">3.4 / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Streak (days)</span>
                <span className="text-foreground font-mono tabular-nums">7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
