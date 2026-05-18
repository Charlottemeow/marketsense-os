import { NextRequest, NextResponse } from 'next/server'

const MOCK_ENTRIES = [
  {
    id: '1',
    date: '2025-05-14',
    asset: 'SPY',
    priceMove: '-1.2%',
    trigger: 'CPI print 3.2% vs 3.0% expected, core services inflation sticky',
    fundamentalImpact: 'Higher inflation delays Fed cut timeline, raising discount rates across risk assets. Real rates up 5bps.',
    sentimentImpact: 'VIX spiked 18% to 22. Put/call ratio surged to 1.4. Breadth negative with 4:1 decliners.',
    positioningImpact: 'Long positions liquidated in final hour. 2Y yield up 15bps triggering stop losses in levered rate shorts.',
    wasPricedIn: false,
    myView: 'Overreaction - core services inflation was in line with recent trend. Looking to add duration on pullback.',
    watchNext: 'Fed speaker Brainard at 2pm. PPI tomorrow. Watching TLT for support at $91.',
    createdAt: '2025-05-14T16:30:00Z',
  },
  {
    id: '2',
    date: '2025-05-12',
    asset: 'TLT',
    priceMove: '+1.8%',
    trigger: 'Weak 10Y auction tailed, then reversed on flight-to-safety as equity selling accelerated',
    fundamentalImpact: 'Growth concerns outweigh inflation worries for now. Real rates falling.',
    sentimentImpact: 'Safe-haven bid across rates. Equity selling abated after initial dip buying failed.',
    positioningImpact: 'Short covering in TLT futures. Leveraged accounts reducing duration shorts after 2Y broke below 4.80%.',
    wasPricedIn: true,
    myView: 'Bond rally has room to run if data continues to soften. 10Y support at 4.35%.',
    watchNext: 'Weekly jobless claims. 30Y auction tomorrow. Watching high-yield credit spreads.',
    createdAt: '2025-05-12T16:30:00Z',
  },
]

const entries = [...MOCK_ENTRIES]

export async function GET() {
  return NextResponse.json({
    success: true,
    total: entries.length,
    entries,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newEntry = {
    id: String(entries.length + 1),
    date: new Date().toISOString().split('T')[0],
    ...body,
    createdAt: new Date().toISOString(),
  }

  entries.unshift(newEntry)

  return NextResponse.json({
    success: true,
    message: 'Entry saved successfully',
    entry: newEntry,
  }, { status: 201 })
}
