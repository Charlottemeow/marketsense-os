'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import StepIndicator from './step-indicator'
import PitchExport from './pitch-export'
import { Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface PitchData {
  id?: string
  companyName: string
  ticker: string
  sector: string
  currentPrice: string
  recommendation: string
  targetPrice: string
  timeHorizon: string
  marketNarrative: string
  variantViewBull: string
  variantViewBear: string
  investmentThesis: string
  valuationMethodology: string
  valuationAnalysis: string
  catalysts: string
  risks: string
}

interface PitchWizardProps {
  existingPitch?: PitchData | null
  onSave: (data: Omit<PitchData, 'id'> & { id?: string }) => void
  isSaving?: boolean
}

const stepFields: { key: keyof PitchData; labelKey: string; type: 'text' | 'textarea' | 'select'; placeholderKey?: string; options?: { value: string; labelKey: string }[] }[][] = [
  [
    { key: 'companyName', labelKey: 'pitch.companyName', type: 'text' },
    { key: 'ticker', labelKey: 'pitch.ticker', type: 'text' },
    { key: 'sector', labelKey: 'pitch.sector', type: 'text' },
    { key: 'currentPrice', labelKey: 'pitch.currentPrice', type: 'text' },
  ],
  [
    { key: 'recommendation', labelKey: 'pitch.recommendation', type: 'select', options: [
      { value: 'Long', labelKey: 'pitch.long' },
      { value: 'Short', labelKey: 'pitch.short' },
      { value: 'Hold', labelKey: 'pitch.neutral' },
    ]},
    { key: 'targetPrice', labelKey: 'pitch.targetPrice', type: 'text' },
    { key: 'timeHorizon', labelKey: 'pitch.timeHorizon', type: 'text' },
  ],
  [
    { key: 'marketNarrative', labelKey: 'pitch.consensusView', type: 'textarea' },
  ],
  [
    { key: 'variantViewBull', labelKey: 'pitch.iBelieve', type: 'textarea' },
    { key: 'variantViewBear', labelKey: 'pitch.evidence', type: 'textarea' },
  ],
  [
    { key: 'investmentThesis', labelKey: 'pitch.oneLineThesis', type: 'textarea' },
  ],
  [
    { key: 'valuationMethodology', labelKey: 'pitch.tradingComps', type: 'select', options: [
      { value: 'DCF', labelKey: 'pitch.dcfSummary' },
      { value: 'Comps', labelKey: 'pitch.tradingComps' },
      { value: 'LBO', labelKey: 'pitch.dcfSummary' },
      { value: 'SOTP', labelKey: 'pitch.targetPriceLogic' },
      { value: 'Other', labelKey: 'pitch.targetPriceLogic' },
    ]},
    { key: 'valuationAnalysis', labelKey: 'pitch.targetPriceLogic', type: 'textarea' },
  ],
  [
    { key: 'catalysts', labelKey: 'pitch.catalysts', type: 'textarea' },
  ],
  [
    { key: 'risks', labelKey: 'pitch.risks', type: 'textarea' },
  ],
]

export default function PitchWizard({ existingPitch, onSave, isSaving }: PitchWizardProps) {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<PitchData>({
    companyName: existingPitch?.companyName ?? '',
    ticker: existingPitch?.ticker ?? '',
    sector: existingPitch?.sector ?? '',
    currentPrice: existingPitch?.currentPrice ?? '',
    recommendation: existingPitch?.recommendation ?? 'Long',
    targetPrice: existingPitch?.targetPrice ?? '',
    timeHorizon: existingPitch?.timeHorizon ?? '',
    marketNarrative: existingPitch?.marketNarrative ?? '',
    variantViewBull: existingPitch?.variantViewBull ?? '',
    variantViewBear: existingPitch?.variantViewBear ?? '',
    investmentThesis: existingPitch?.investmentThesis ?? '',
    valuationMethodology: existingPitch?.valuationMethodology ?? 'DCF',
    valuationAnalysis: existingPitch?.valuationAnalysis ?? '',
    catalysts: existingPitch?.catalysts ?? '',
    risks: existingPitch?.risks ?? '',
  })

  const handleChange = (key: keyof PitchData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave({ ...form, id: existingPitch?.id })
  }

  const totalSteps = stepFields.length + 1

  if (step === totalSteps) {
    return <PitchExport data={form} onBack={() => setStep(totalSteps - 1)} />
  }

  const fields = stepFields[step - 1]

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} onStepClick={setStep} />

      <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground">
          {t('pitch.step')} {step}: {t(fields[0]?.labelKey.replace(/ —.*$/, ''))}
        </h2>

        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t(f.labelKey)}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={form[f.key] as string}
                onChange={e => handleChange(f.key, e.target.value)}
                rows={5}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
            ) : f.type === 'select' ? (
              <select
                value={form[f.key] as string}
                onChange={e => handleChange(f.key, e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {f.options?.map(o => (
                  <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form[f.key] as string}
                onChange={e => handleChange(f.key, e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground bg-card border border-border rounded-md hover:bg-card-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('pitch.prev')}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (step === totalSteps - 1) {
                onSave({ ...form, id: existingPitch?.id })
              } else {
                setStep(step + 1)
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {step === totalSteps - 1 ? (
              isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {step === totalSteps - 1 ? (isSaving ? t('common.loading') : t('pitch.save')) : t('pitch.next')}
          </button>
        </div>
      </div>
    </div>
  )
}
