'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

interface WhyMoveEntry {
  id: string
  date: string
  asset: string
  priceMove: string
  trigger: string
  fundamentalImpact: string
  sentimentImpact: string
  positioningImpact: string
  wasPricedIn: boolean
  myView: string
  watchNext: string
}

interface WhyMoveFormProps {
  existingEntry?: WhyMoveEntry | null
  onSave: (entry: Omit<WhyMoveEntry, 'id'> & { id?: string }) => void
  isSaving?: boolean
}

export default function WhyMoveForm({ existingEntry, onSave, isSaving }: WhyMoveFormProps) {
  const [form, setForm] = useState({
    asset: existingEntry?.asset ?? '',
    priceMove: existingEntry?.priceMove ?? '',
    trigger: existingEntry?.trigger ?? '',
    fundamentalImpact: existingEntry?.fundamentalImpact ?? '',
    sentimentImpact: existingEntry?.sentimentImpact ?? '',
    positioningImpact: existingEntry?.positioningImpact ?? '',
    wasPricedIn: existingEntry?.wasPricedIn ?? false,
    myView: existingEntry?.myView ?? '',
    watchNext: existingEntry?.watchNext ?? '',
  })

  const fields = [
    { key: 'asset', label: 'Asset / Stock / Index', rows: 1, placeholder: 'e.g., SPY, TLT, EUR/USD' },
    { key: 'priceMove', label: 'Price move', rows: 2, placeholder: 'e.g., -1.5% on the session' },
    { key: 'trigger', label: 'Trigger', rows: 2, placeholder: 'e.g., CPI print came in hot at 3.2% vs 3.0% expected' },
    { key: 'fundamentalImpact', label: 'Fundamental impact', rows: 3, placeholder: 'e.g., Higher rates mean lower present value of future cash flows...' },
    { key: 'sentimentImpact', label: 'Sentiment impact', rows: 2, placeholder: 'e.g., Fear index spiked, put volume surged...' },
    { key: 'positioningImpact', label: 'Positioning impact', rows: 2, placeholder: 'e.g., Stop losses triggered, forced selling into the close...' },
    { key: 'myView', label: 'My view', rows: 3, placeholder: 'e.g., This is an overreaction, looking to add risk...' },
    { key: 'watchNext', label: 'What to watch next', rows: 2, placeholder: 'e.g., Fed speakers tomorrow, PCE data Friday...' },
  ]

  const handleChange = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...form, date: existingEntry?.date ?? new Date().toISOString().split('T')[0], id: existingEntry?.id })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {f.label}
          </label>
          {f.key === 'wasPricedIn' ? null : (
            <textarea
              value={form[f.key as keyof typeof form] as string}
              onChange={e => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={f.rows}
              className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="wasPricedIn"
          checked={form.wasPricedIn}
          onChange={e => handleChange('wasPricedIn', e.target.checked)}
          className="accent-accent w-4 h-4"
        />
        <label htmlFor="wasPricedIn" className="text-sm text-foreground">
          Was it priced in?
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaving ? 'Saving...' : 'Save Entry'}
      </button>
    </form>
  )
}
