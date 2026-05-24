'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { Save, Loader2 } from 'lucide-react'

interface DailyNote {
  id: string
  date: string
  marketTrading: string
  assetClassMoved: string
  changedVsYesterday: string
  alreadyPricedIn: string
  myView: string
  confidenceLevel: number
  watchTomorrow: string
}

interface DailyNoteFormProps {
  existingNote?: DailyNote | null
  onSave: (note: Omit<DailyNote, 'id'> & { id?: string }) => void
  isSaving?: boolean
}

const prompts = [
  { key: 'marketTrading', labelKey: 'notes.prompt1', placeholderKey: 'notes.placeholder1' },
  { key: 'assetClassMoved', labelKey: 'notes.prompt2', placeholderKey: 'notes.placeholder2' },
  { key: 'changedVsYesterday', labelKey: 'notes.prompt3', placeholderKey: 'notes.placeholder3' },
  { key: 'alreadyPricedIn', labelKey: 'notes.prompt4', placeholderKey: 'notes.placeholder4' },
  { key: 'myView', labelKey: 'notes.prompt5', placeholderKey: 'notes.placeholder5' },
  { key: 'watchTomorrow', labelKey: 'notes.prompt7', placeholderKey: 'notes.placeholder7' },
]

export default function DailyNoteForm({ existingNote, onSave, isSaving }: DailyNoteFormProps) {
  const { t } = useLanguage()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    date: existingNote?.date ?? today,
    marketTrading: existingNote?.marketTrading ?? '',
    assetClassMoved: existingNote?.assetClassMoved ?? '',
    changedVsYesterday: existingNote?.changedVsYesterday ?? '',
    alreadyPricedIn: existingNote?.alreadyPricedIn ?? '',
    myView: existingNote?.myView ?? '',
    confidenceLevel: existingNote?.confidenceLevel ?? 3,
    watchTomorrow: existingNote?.watchTomorrow ?? '',
  })

  const handleChange = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...form, id: existingNote?.id })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {prompts.map(p => (
        <div key={p.key}>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t(p.labelKey)}
          </label>
          <textarea
            value={form[p.key as keyof typeof form] as string}
            onChange={e => handleChange(p.key, e.target.value)}
            placeholder={t(p.placeholderKey)}
            rows={3}
            className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {t('notes.prompt6')} (1-5)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={form.confidenceLevel}
            onChange={e => handleChange('confidenceLevel', parseInt(e.target.value))}
            className="w-48 accent-accent"
          />
          <span className={cn(
            'text-sm font-mono tabular-nums',
            form.confidenceLevel >= 4 ? 'text-positive' : form.confidenceLevel <= 2 ? 'text-negative' : 'text-warning'
          )}>
            {form.confidenceLevel} / 5
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaving ? t('common.loading') : t('notes.save')}
      </button>
    </form>
  )
}
