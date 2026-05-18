import { NextRequest, NextResponse } from 'next/server'

const MOCK_NOTES = [
  {
    id: '1',
    date: '2025-05-14',
    marketTrading: 'Risk-off tone, S&P down 1.2% led by tech. CPI print triggered selling in duration.',
    assetClassMoved: 'Treasuries rallied with 10Y down 12bps. Gold +1.2%. DXY -0.4%.',
    changedVsYesterday: 'Fed rhetoric shifted hawkish after minutes showed concern about sticky services inflation.',
    alreadyPricedIn: 'NFP miss was already expected after weak ADP print, but CPI surprise was not priced in.',
    myView: 'Still bearish duration near term but adding on dips. Think 10Y above 4.5% is unsustainable.',
    confidenceLevel: 3,
    watchTomorrow: 'JOLTS data, Fed speak, oil inventory. Watching 10Y auction.',
    createdAt: '2025-05-14T18:00:00Z',
  },
  {
    id: '2',
    date: '2025-05-13',
    marketTrading: 'Quiet session ahead of CPI. S&P flat, TLT +0.3%. Volume below average.',
    assetClassMoved: 'EUR/USD +0.3% on weaker dollar. No major catalyst.',
    changedVsYesterday: 'Rangebound trading, implied vol declining into CPI print.',
    alreadyPricedIn: 'Market pricing 25bp cut in September, 50bp by December.',
    myView: 'Neutral heading into CPI. Expecting volatility expansion post-print.',
    confidenceLevel: 4,
    watchTomorrow: 'CPI at 8:30am. Positioning for a 2-sigma move in rates.',
    createdAt: '2025-05-13T18:00:00Z',
  },
  {
    id: '3',
    date: '2025-05-12',
    marketTrading: 'Risk-on Monday. S&P +0.8%, NDX +1.2%. Small caps outperforming.',
    assetClassMoved: 'Copper +2.5% on China stimulus hopes. Oil flat.',
    changedVsYesterday: 'Weekend news flow positive — China PMI beat, no negative geopolitical headlines.',
    alreadyPricedIn: 'AI enthusiasm still driving megacap tech. Narrative unchanged.',
    myView: 'Tactically bullish near term. Positioning for mean reversion in small caps.',
    confidenceLevel: 3,
    watchTomorrow: 'NFIB small business optimism index. Watching oil for supply disruption risk.',
    createdAt: '2025-05-12T18:00:00Z',
  },
]

const notes = [...MOCK_NOTES]

export async function GET() {
  return NextResponse.json({
    success: true,
    total: notes.length,
    notes,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newNote = {
    id: String(notes.length + 1),
    date: new Date().toISOString().split('T')[0],
    ...body,
    createdAt: new Date().toISOString(),
  }

  notes.unshift(newNote)

  return NextResponse.json({
    success: true,
    message: 'Note saved successfully',
    note: newNote,
  }, { status: 201 })
}
