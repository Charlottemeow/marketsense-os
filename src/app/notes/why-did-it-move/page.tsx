'use client'

import { useState } from 'react'
import Link from 'next/link'
import WhyMoveForm from '@/components/notes/why-move-form'
import { ArrowLeft } from 'lucide-react'

const MOCK_ENTRIES = [
  {
    id: '1',
    date: '2025-05-14',
    asset: 'SPY',
    priceMove: '-1.2%',
    trigger: 'CPI print 3.2% vs 3.0% expected',
    fundamentalImpact: 'Higher inflation delays Fed cut timeline, raising discount rates across risk assets',
    sentimentImpact: 'VIX spiked 18% to 22, put/call ratio surged to 1.4',
    positioningImpact: 'Long positions liquidated, 2Y yield up 15bps triggering stop losses in rate-sensitive shorts',
    wasPricedIn: false,
    myView: 'Overreaction — core services inflation was in line. Looking to add duration.',
    watchNext: 'Fed speaker Brainard at 2pm, PPI tomorrow',
  },
  {
    id: '2',
    date: '2025-05-12',
    asset: 'TLT',
    priceMove: '+1.8%',
    trigger: 'Weak 10Y auction tailed, then reversed on flight-to-safety',
    fundamentalImpact: 'Growth concerns outweigh inflation worries, real rates falling',
    sentimentImpact: 'Safe-haven bid across rates, equity selling abated',
    positioningImpact: 'Short covering in TLT futures, leveraged accounts reducing duration shorts',
    wasPricedIn: true,
    myView: 'Bond rally has room to run if data continues to soften.',
    watchNext: 'Weekly jobless claims, 30Y auction tomorrow',
  },
]

export default function WhyDidItMovePage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (entry: any) => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 600))
    console.log('Why-did-it-move entry saved:', entry)
    setIsSaving(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notes
        </Link>
        <h1 className="text-2xl font-display text-foreground mt-2">Why Did It Move</h1>
        <p className="text-sm text-muted mt-1">Deconstruct individual asset price moves</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">New Entry</h2>
          <WhyMoveForm onSave={handleSave} isSaving={isSaving} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Entries</h2>
          <div className="space-y-3">
            {MOCK_ENTRIES.map(entry => (
              <div key={entry.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-foreground">{entry.asset}</span>
                    <span className="text-sm text-muted">{entry.date}</span>
                  </div>
                  <span className={`text-sm font-mono tabular-nums ${entry.priceMove.startsWith('+') ? 'text-positive' : entry.priceMove.startsWith('-') ? 'text-negative' : 'text-foreground'}`}>
                    {entry.priceMove}
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-2">
                  <span className="font-medium text-foreground">Trigger:</span> {entry.trigger}
                </p>
                <p className="text-sm text-muted line-clamp-2 mt-1">
                  <span className="font-medium text-foreground">View:</span> {entry.myView}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
