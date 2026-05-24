'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
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

const textareaFields = [
  { key: 'eventDescription', labelKey: 'dive.eventDesc', placeholderKey: 'dive.placeholderEvent', rows: 3 },
  { key: 'firstOrderCause', labelKey: 'dive.firstOrder', placeholderKey: 'dive.placeholderFirst', rows: 2 },
  { key: 'secondOrderCause', labelKey: 'dive.secondOrder', placeholderKey: 'dive.placeholderSecond', rows: 2 },
  { key: 'crossAssetReaction', labelKey: 'dive.crossAsset', placeholderKey: 'dive.placeholderEvent', rows: 3 },
  { key: 'marketPriceIn', labelKey: 'dive.marketPriceIn', placeholderKey: 'dive.placeholderEvent', rows: 2 },
  { key: 'baseCase', labelKey: 'dive.baseCase', placeholderKey: 'dive.placeholderEvent', rows: 3 },
  { key: 'bullCase', labelKey: 'dive.bullCase', placeholderKey: 'dive.placeholderEvent', rows: 2 },
  { key: 'bearCase', labelKey: 'dive.bearCase', placeholderKey: 'dive.placeholderEvent', rows: 2 },
  { key: 'verificationPlan', labelKey: 'dive.verification', placeholderKey: 'dive.placeholderEvent', rows: 2 },
]

export default function DeepDiveForm({ existingDive, onSave, isSaving }: DeepDiveFormProps) {
  const { t } = useLanguage()
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
        <label className="block text-sm font-medium text-foreground mb-1.5">{t('dive.topicTitle')}</label>
        <input
          type="text"
          value={form.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder={t('dive.placeholderTitle')}
          className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t('dive.date')}</label>
        <input
          type="date"
          value={form.date}
          onChange={e => handleChange('date', e.target.value)}
          className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {textareaFields.map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t(f.labelKey)}</label>
          <textarea
            value={form[f.key as keyof typeof form] as string}
            onChange={e => handleChange(f.key, e.target.value)}
            placeholder={t(f.placeholderKey)}
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
        {isSaving ? t('common.loading') : t('dive.save')}
      </button>
    </form>
  )
}
