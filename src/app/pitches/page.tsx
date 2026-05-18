'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Plus, ArrowUpRight } from 'lucide-react'

const MOCK_PITCHES = [
  {
    id: '1',
    companyName: 'NVIDIA Corporation',
    ticker: 'NVDA',
    recommendation: 'Long',
    targetPrice: '$180.00',
    currentPrice: '$95.50',
    sector: 'Semiconductors',
    timeHorizon: '12 months',
    updatedAt: '2025-05-14',
    thesis: 'AI GPU demand structurally underappreciated. Enterprise AI adoption still in early innings.',
  },
  {
    id: '2',
    companyName: 'iShares 20+ Year Treasury Bond ETF',
    ticker: 'TLT',
    recommendation: 'Long',
    targetPrice: '$105.00',
    currentPrice: '$92.30',
    sector: 'Fixed Income',
    timeHorizon: '6 months',
    updatedAt: '2025-05-12',
    thesis: 'Growth slowdown and Fed pivot will drive rates lower. Position for duration rally.',
  },
  {
    id: '3',
    companyName: 'Palantir Technologies',
    ticker: 'PLTR',
    recommendation: 'Short',
    targetPrice: '$35.00',
    currentPrice: '$52.80',
    sector: 'Software',
    timeHorizon: '3-6 months',
    updatedAt: '2025-05-10',
    thesis: 'Valuation disconnected from fundamentals. Government revenue concentration risk. Insider selling.',
  },
  {
    id: '4',
    companyName: 'Freeport-McMoRan',
    ticker: 'FCX',
    recommendation: 'Long',
    targetPrice: '$65.00',
    currentPrice: '$48.20',
    sector: 'Materials',
    timeHorizon: '18 months',
    updatedAt: '2025-05-08',
    thesis: 'Copper supply deficit structural. AI data center + green energy demand creating multi-year tailwind.',
  },
]

const badgeColors: Record<string, string> = {
  Long: 'bg-positive/10 text-positive',
  Short: 'bg-negative/10 text-negative',
  Hold: 'bg-warning/10 text-warning',
}

export default function PitchesPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-foreground">Stock Pitches</h1>
          <p className="text-sm text-muted mt-1">Formal investment theses with variant views</p>
        </div>
        <Link
          href="/pitches/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Pitch
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PITCHES.map(pitch => (
          <Link
            key={pitch.id}
            href={`/pitches/${pitch.id}`}
            className="block bg-card border border-border rounded-lg p-5 card-glow hover:bg-card-hover transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground truncate">{pitch.companyName}</h3>
                  <span className="text-sm font-mono text-muted">{pitch.ticker}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    badgeColors[pitch.recommendation] || 'bg-card text-muted border border-border',
                  )}>
                    {pitch.recommendation}
                  </span>
                  <span className="text-xs text-muted">{pitch.sector}</span>
                  <span className="text-xs text-muted font-mono tabular-nums">{pitch.currentPrice}</span>
                </div>
                <p className="mt-3 text-sm text-muted line-clamp-2">{pitch.thesis}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted">
                  <span>Target: <span className="text-foreground font-mono tabular-nums">{pitch.targetPrice}</span></span>
                  <span>·</span>
                  <span>Horizon: {pitch.timeHorizon}</span>
                  <span>·</span>
                  <span>Updated: {pitch.updatedAt}</span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
