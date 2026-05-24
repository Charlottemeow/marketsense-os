'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import PitchWizard from '@/components/pitches/pitch-wizard'
import { ArrowLeft } from 'lucide-react'

const MOCK_PITCH = {
  id: '1',
  companyName: 'NVIDIA Corporation',
  ticker: 'NVDA',
  sector: 'Semiconductors',
  currentPrice: '$95.50',
  recommendation: 'Long',
  targetPrice: '$180.00',
  timeHorizon: '12 months',
  marketNarrative: 'The market is focused on near-term GPU inventory digestion and ignores the structural AI infrastructure buildout that is set to accelerate through 2026. Enterprise AI adoption is still <5% penetrated, and sovereign AI capex is just beginning.',
  variantViewBull: 'AI reasoning models (e.g., OpenAI o3) require 10x more compute per query, extending the GPU demand super-cycle well beyond current expectations. NVIDIA\'s next-gen Rubin architecture extends the moat.',
  variantViewBear: 'Hyperscalers are developing custom ASICs (TPU, Trainium) that erode NVIDIA\'s 95% market share over time. Gross margins compress from 75%+ toward 60%, re-rating the multiple.',
  investmentThesis: 'NVIDIA is the most important company in the AI revolution. Its CUDA ecosystem creates a switching cost moat that ASICs will not overcome in the near-to-medium term. We see 85%+ upside as AI infrastructure spending doubles over the next 18 months.',
  valuationMethodology: 'DCF',
  valuationAnalysis: 'DCF using 30% revenue CAGR through 2028, 65% terminal gross margin, and 3% terminal growth yields $180/share (45x 2026 EPS). Bull case using 40% CAGR yields $240/share.',
  catalysts: 'GTC conference announcements, Q1 earnings (May), Enterprise AI adoption metrics, Blackwell ramp acceleration, Sovereign AI deal flow',
  risks: 'ASIC competition from hyperscalers, US-China chip export restrictions, Inventory correction in gaming, CEO insider selling, Peak AI hype cycle risk',
}

export default function PitchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage()
  const resolved = use(params)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: any) => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    console.log('Pitch updated:', data)
    setIsSaving(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/pitches"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('pitch.back')}
        </Link>
        <h1 className="text-2xl font-display text-foreground mt-2">{t('pitch.edit')}: {MOCK_PITCH.companyName} ({MOCK_PITCH.ticker})</h1>
        <p className="text-sm text-muted mt-1">ID: {resolved.id}</p>
      </div>

      <PitchWizard existingPitch={MOCK_PITCH} onSave={handleSave} isSaving={isSaving} />
    </div>
  )
}
