'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
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

const stepFields: { key: keyof PitchData; label: string; type: 'text' | 'textarea' | 'select'; placeholder?: string; options?: { value: string; label: string }[] }[][] = [
  [
    { key: 'companyName', label: 'Company name', type: 'text', placeholder: 'e.g., Apple Inc.' },
    { key: 'ticker', label: 'Ticker', type: 'text', placeholder: 'e.g., AAPL' },
    { key: 'sector', label: 'Sector', type: 'text', placeholder: 'e.g., Technology' },
    { key: 'currentPrice', label: 'Current price', type: 'text', placeholder: 'e.g., $185.50' },
  ],
  [
    { key: 'recommendation', label: 'Recommendation', type: 'select', options: [
      { value: 'Long', label: 'Long / Buy' },
      { value: 'Short', label: 'Short / Sell' },
      { value: 'Hold', label: 'Hold / Neutral' },
    ]},
    { key: 'targetPrice', label: 'Target price', type: 'text', placeholder: 'e.g., $220.00' },
    { key: 'timeHorizon', label: 'Time horizon', type: 'text', placeholder: 'e.g., 6-12 months' },
  ],
  [
    { key: 'marketNarrative', label: 'Market narrative', type: 'textarea', placeholder: 'e.g., The market is underestimating the company\'s margin expansion potential...' },
  ],
  [
    { key: 'variantViewBull', label: 'Variant view — Bull case', type: 'textarea', placeholder: 'e.g., AI adoption drives upside to estimates...' },
    { key: 'variantViewBear', label: 'Variant view — Bear case', type: 'textarea', placeholder: 'e.g., Competition erodes market share faster than expected...' },
  ],
  [
    { key: 'investmentThesis', label: 'Investment thesis', type: 'textarea', placeholder: 'e.g., We believe the company is well-positioned to benefit from...' },
  ],
  [
    { key: 'valuationMethodology', label: 'Valuation methodology', type: 'select', options: [
      { value: 'DCF', label: 'DCF Analysis' },
      { value: 'Comps', label: 'Comparable Company Analysis' },
      { value: 'LBO', label: 'LBO Analysis' },
      { value: 'SOTP', label: 'Sum of the Parts' },
      { value: 'Other', label: 'Other' },
    ]},
    { key: 'valuationAnalysis', label: 'Valuation analysis', type: 'textarea', placeholder: 'e.g., DCF implies 20% upside assuming 10% CAGR...' },
  ],
  [
    { key: 'catalysts', label: 'Catalysts', type: 'textarea', placeholder: 'e.g., Upcoming product launch, earnings beat, buyback authorization...' },
  ],
  [
    { key: 'risks', label: 'Risks', type: 'textarea', placeholder: 'e.g., Regulatory risk, macroeconomic headwinds, competitive pressure...' },
  ],
]

export default function PitchWizard({ existingPitch, onSave, isSaving }: PitchWizardProps) {
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
          Step {step}: {fields[0]?.label.replace(/ *—.*$/, '')}
        </h2>

        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={form[f.key] as string}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
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
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form[f.key] as string}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
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
          Previous
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
            {step === totalSteps - 1 ? (isSaving ? 'Saving...' : 'Save Pitch') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
