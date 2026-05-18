'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import DeepDiveForm from '@/components/deep-dives/deep-dive-form'
import { ArrowLeft } from 'lucide-react'

const MOCK_DEEP_DIVE = {
  id: '1',
  title: 'Deconstructing the Aug 2024 Sell-off',
  date: '2024-08-05',
  eventDescription: 'Broad market sell-off triggered by weaker-than-expected ISM manufacturing data and a spike in the Japanese Yen carry trade unwind. The S&P 500 fell 3.5% in a single session, with technology stocks bearing the brunt of the selling.',
  firstOrderCause: 'ISM Manufacturing PMI printed 46.8 vs 48.5 expected, triggering growth scare',
  secondOrderCause: 'Stop losses in systematic strategies cascaded, VIX spiked above 30, and the Yen carry trade unwind accelerated as the BOJ surprised with a hawkish hold',
  crossAssetReaction: 'SPX -3.5%, NDX -5.2%, 10Y yield -18bps, DXY -0.8%, USDJPY -2.1%, Gold +1.8%',
  marketPriceIn: 'Market repriced 50bp of Fed cuts by year-end, up from 25bp pre-sell-off',
  baseCase: 'Growth scare, not recession. Fed delivers 25bp cut in September. Market recovers within 2-4 weeks.',
  bullCase: 'Soft landing narrative reasserts as data stabilizes. V-shaped recovery. Best opportunity to add risk in 2024.',
  bearCase: 'This is the start of a recession triggered by lagged effects of restrictive Fed policy. More 10%+ downside ahead.',
  verificationPlan: 'Watch jobless claims — if they spike above 250k, bear case gains credibility. Watch ISM services for confirmation. Monitor high-yield credit spreads for stress.',
}

export default function DeepDivePage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: any) => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    console.log('Deep dive updated:', data)
    setIsSaving(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/deep-dives"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to deep dives
        </Link>
        <h1 className="text-2xl font-display text-foreground mt-2">Deep Dive: {MOCK_DEEP_DIVE.title}</h1>
        <p className="text-sm text-muted mt-1">ID: {resolved.id}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <DeepDiveForm existingDive={MOCK_DEEP_DIVE} onSave={handleSave} isSaving={isSaving} />
      </div>
    </div>
  )
}
