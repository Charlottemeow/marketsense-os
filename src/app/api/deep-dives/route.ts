import { NextRequest, NextResponse } from 'next/server'

const MOCK_DEEP_DIVES = [
  {
    id: '1',
    title: 'Deconstructing the Aug 2024 Sell-off',
    date: '2024-08-05',
    eventDescription: 'Broad market sell-off triggered by weaker-than-expected ISM manufacturing data and a spike in the Japanese Yen carry trade unwind. The S&P 500 fell 3.5% in a single session.',
    firstOrderCause: 'ISM Manufacturing PMI printed 46.8 vs 48.5 expected, triggering growth scare. New orders component collapsed to 44.0.',
    secondOrderCause: 'Stop losses in systematic strategies cascaded. VIX spiked above 30. The Yen carry trade unwind accelerated as BOJ surprised with hawkish hold.',
    crossAssetReaction: 'SPX -3.5%, NDX -5.2%, 10Y yield -18bps, DXY -0.8%, USDJPY -2.1%, Gold +1.8%, Bitcoin -4.5%',
    marketPriceIn: 'Market repriced 50bp of Fed cuts by year-end, up from 25bp pre-sell-off. Fed funds futures priced in 75% chance of emergency cut.',
    baseCase: 'Growth scare, not recession. Fed delivers 25bp cut in September. Market recovers within 2-4 weeks. Buy the dip.',
    bullCase: 'Soft landing narrative reasserts as data stabilizes. V-shaped recovery. This is the best opportunity to add risk in 2024.',
    bearCase: 'This is the start of a recession triggered by lagged effects of restrictive Fed policy. More 10%+ downside. Cash is king.',
    verificationPlan: 'Watch jobless claims — if they spike above 250k, bear case gains credibility. Watch ISM services next week for confirmation. Monitor HY credit spreads for stress.',
    createdAt: '2024-08-05T20:00:00Z',
  },
  {
    id: '2',
    title: 'TLT Rally Post-NFP: A Deep Dive',
    date: '2025-05-02',
    eventDescription: 'Treasuries rallied sharply after April NFP missed expectations, with the 10Y yield falling 15bps in a single session.',
    firstOrderCause: 'NFP printed 175K vs 240K consensus. Unemployment ticked up to 4.0%. Average hourly earnings moderated to 3.9% YoY.',
    secondOrderCause: 'Algorithmic momentum traders piled on. Treasury futures volume 3x normal. Weekend positioning ahead of ISM services.',
    crossAssetReaction: 'TLT +2.1%, 10Y yield -15bps, 2Y yield -12bps, curve steepener. SPX +0.8%, DXY -0.5%. Gold +0.9%.',
    marketPriceIn: 'Market now pricing 50bp of cuts by December, up from 35bp pre-NFP. September cut probability at 65%.',
    baseCase: 'Labor market softening gradually. Fed cuts 25bp in September and December. 10Y ends year at 4.00-4.25%.',
    bullCase: 'Labor market cracks faster. Fed forced to cut 50bp in September. 10Y rallies to 3.75%. Curve bull steepens.',
    bearCase: 'NFP noise — one month does not make a trend. Hiring reaccelerates. 10Y back to 4.75%.',
    verificationPlan: 'Watch weekly claims for sustained elevation above 240K. Next month\'s NFP is critical. JOLTS data for quits rate health.',
    createdAt: '2025-05-02T20:00:00Z',
  },
]

const deepDives = [...MOCK_DEEP_DIVES]

export async function GET() {
  return NextResponse.json({
    success: true,
    total: deepDives.length,
    deepDives,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newDeepDive = {
    id: String(deepDives.length + 1),
    ...body,
    createdAt: new Date().toISOString(),
  }

  deepDives.unshift(newDeepDive)

  return NextResponse.json({
    success: true,
    message: 'Deep dive created successfully',
    deepDive: newDeepDive,
  }, { status: 201 })
}
