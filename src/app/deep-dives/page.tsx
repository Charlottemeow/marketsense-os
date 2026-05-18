'use client'

import Link from 'next/link'
import DeepDiveCard from '@/components/deep-dives/deep-dive-card'
import { Plus } from 'lucide-react'

const MOCK_DEEP_DIVES = [
  {
    id: '1',
    title: 'Deconstructing the Aug 2024 Sell-off',
    date: '2024-08-05',
    eventDescription: 'Broad market sell-off triggered by weaker-than-expected ISM manufacturing data and a spike in the Japanese Yen carry trade unwind.',
    firstOrderCause: 'ISM Manufacturing PMI printed 46.8 vs 48.5 expected, triggering growth scare',
  },
  {
    id: '2',
    title: 'TLT Rally Post-NFP: A Deep Dive',
    date: '2025-05-02',
    eventDescription: 'Treasuries rallied sharply after April NFP missed expectations, with the 10Y yield falling 15bps.',
    firstOrderCause: 'NFP printed 175K vs 240K consensus, unemployment ticked up to 4.0%',
  },
  {
    id: '3',
    title: 'VIX Term Structure Inversion: Jan 2025',
    date: '2025-01-15',
    eventDescription: 'VIX futures shifted into backwardation as geopolitical tensions in the Middle East escalated.',
    firstOrderCause: 'Iran-Israel tensions escalated with direct military engagement, fear of broader conflict',
  },
  {
    id: '4',
    title: 'Copper Breakout: Structural Demand Shift',
    date: '2025-03-10',
    eventDescription: 'Copper surged above $5.00/lb for the first time as AI-driven data center demand compounded with green energy transition.',
    firstOrderCause: 'China announced record power grid investment, AI data center copper demand estimates revised up 30%',
  },
]

export default function DeepDivesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-foreground">Deep Dives</h1>
          <p className="text-sm text-muted mt-1">In-depth analysis of market events and themes</p>
        </div>
        <Link
          href="/deep-dives/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Deep Dive
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_DEEP_DIVES.map(dd => (
          <DeepDiveCard key={dd.id} deepDive={dd} />
        ))}
      </div>
    </div>
  )
}
