'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

interface DeepDiveData {
  id: string
  title: string
  date: string
  eventDescription: string
  firstOrderCause: string
  secondOrderCause: string
  crossAssetReaction: string
  marketPriceIn: string
  baseCase: string
  bullCase: string
  bearCase: string
  verificationPlan: string
}

interface DeepDiveFormProps {
  existingDive?: DeepDiveData | null
  onSave: (data: Omit<DeepDiveData, 'id'> & { id?: string }) => void
  isSaving?: boolean
}

const fields = [
  { key: 'title', label: 'Title', rows: 1, placeholder: 'e.g., Deconstructing the Aug 2024 Sell-off' },
  { key: 'eventDescription', label: 'Event description', rows: 3, placeholder: 'e.g., Broad market sell-off triggered by weaker-than-expected ISM manufacturing data...' },
  { key: 'firstOrderCause', label: 'First-order cause', rows: 2, placeholder: 'e.g., ISM Manufacturing PMI printed 46.8 vs 48.5 expected, triggering growth scare...' },
  { key: 'secondOrderCause', label: 'Second-order cause', rows: 2, placeholder: 'e.g., Stop losses in systematic strategies cascaded, VIX spiked above 30...' },
  { key: 'crossAssetReaction', label: 'Cross-asset reaction', rows: 3, placeholder: 'e.g., SPX -2.1%, 10Y yield -12bps, DXY -0.5%, Gold +1.2%...' },
  { key: 'marketPriceIn', label: 'Market price-in', rows: 2, placeholder: 'e.g., Market now pricing 60% chance of 50bp cut in September...' },
  { key: 'baseCase', label: 'Base case', rows: 3, placeholder: 'e.g., This is a growth scare, not a recession. Fed delivers 25bp cut...' },
  { key: 'bullCase', label: 'Bull case', rows: 2, placeholder: 'e.g., Soft landing intact, dip buying opportunity, V-shaped recovery...' },
  { key: 'bearCase', label: 'Bear case', rows: 2, placeholder: 'e.g., This is the start of a recession, more downside to come...' },
  { key: 'verificationPlan', label: 'Verification plan', rows: 2, placeholder: 'e.g., Watch jobless claims Thursday, if they spike above 250k, bear case gains credibility...' },
]

export default function DeepDiveForm({ existingDive, onSave, isSaving }: DeepDiveFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    title: existingDive?.title ?? '',
    date: existingDive?.date ?? today,
    eventDescription: existingDive?.eventDescription ?? '',
    firstOrderCause: existingDive?.firstOrderCause ?? '',
    secondOrderCause: existingDive?.secondOrderCause ?? '',
    crossAssetReaction: existingDive?.crossAssetReaction ?? '',
    marketPriceIn: existingDive?.marketPriceIn ?? '',
    baseCase: existingDive?.baseCase ?? '',
    bullCase: existingDive?.bullCase ?? '',
    bearCase: existingDive?.bearCase ?? '',
    verificationPlan: existingDive?.verificationPlan ?? '',
  })

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...form, id: existingDive?.id })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="e.g., Deconstructing the Aug 2024 Sell-off"
          className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={e => handleChange('date', e.target.value)}
          className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {fields.slice(2).map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
          <textarea
            value={form[f.key as keyof typeof form] as string}
            onChange={e => handleChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            rows={f.rows}
            className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaving ? 'Saving...' : 'Save Deep Dive'}
      </button>
    </form>
  )
}
