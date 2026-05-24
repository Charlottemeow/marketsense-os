'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
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
  const { t } = useLanguage()
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
    { key: 'asset', labelKey: 'whymove.asset', placeholderKey: 'whymove.placeholderAsset', rows: 1 },
    { key: 'priceMove', labelKey: 'whymove.priceMove', placeholderKey: 'whymove.placeholderDesc', rows: 2 },
    { key: 'trigger', labelKey: 'whymove.trigger', placeholderKey: 'whymove.placeholderDesc', rows: 2 },
    { key: 'fundamentalImpact', labelKey: 'whymove.fundamental', placeholderKey: 'whymove.placeholderDesc', rows: 3 },
    { key: 'sentimentImpact', labelKey: 'whymove.sentiment', placeholderKey: 'whymove.placeholderDesc', rows: 2 },
    { key: 'positioningImpact', labelKey: 'whymove.positioning', placeholderKey: 'whymove.placeholderDesc', rows: 2 },
    { key: 'myView', labelKey: 'whymove.myView', placeholderKey: 'whymove.placeholderDesc', rows: 3 },
    { key: 'watchNext', labelKey: 'whymove.watchNext', placeholderKey: 'whymove.placeholderDesc', rows: 2 },
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
            {t(f.labelKey)}
          </label>
          {f.key === 'wasPricedIn' ? null : (
            <textarea
              value={form[f.key as keyof typeof form] as string}
              onChange={e => handleChange(f.key, e.target.value)}
              placeholder={t(f.placeholderKey)}
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
          {t('whymove.wasPricedIn')}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaving ? t('common.loading') : t('whymove.save')}
      </button>
    </form>
  )
}
