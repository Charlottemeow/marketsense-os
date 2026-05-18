import { NextRequest, NextResponse } from 'next/server'

const MOCK_CLASSIFICATION = {
  regime: {
    primary: 'Risk-On',
    secondary: 'Growth Deceleration',
    confidence: 0.72,
    regimeScore: 62.5,
    signal: 'Moderate Bullish',
  },
  factors: {
    growth: {
      score: 58,
      trend: 'decelerating',
      description: 'Growth is positive but decelerating from Q4 2024 peak. Labor market softening gradually.',
    },
    inflation: {
      score: 45,
      trend: 'moderating',
      description: 'Inflation moderating but sticky in services. Core PCE trending toward 2.5%.',
    },
    monetary: {
      score: 30,
      trend: 'restrictive',
      description: 'Fed on hold at 5.25-5.50%. Market pricing 50bp of cuts by year-end.',
    },
    valuation: {
      score: 65,
      trend: 'elevated',
      description: 'Equity valuations above historical averages. S&P 500 P/E at 21.5x forward earnings.',
    },
    sentiment: {
      score: 55,
      trend: 'neutral',
      description: 'AAII bullish sentiment at 42%. Put/call ratio at 1.1. VIX at 15.8.',
    },
    liquidity: {
      score: 60,
      trend: 'stable',
      description: 'Financial conditions index easing. Corporate credit spreads tight at 95bps.',
    },
    technical: {
      score: 62,
      trend: 'positive',
      description: 'S&P 500 above 50-day and 200-day MA. Breadth improving. RSI at 58.',
    },
  },
  assetAllocation: {
    equities: { weight: 55, bias: 'overweight', rationale: 'Positive growth backdrop supports earnings' },
    treasuries: { weight: 25, bias: 'neutral', rationale: 'Duration attractive at current yields, but wait for clearer cut signal' },
    credit: { weight: 10, bias: 'underweight', rationale: 'Tight spreads offer limited compensation for tail risk' },
    commodities: { weight: 10, bias: 'overweight', rationale: 'Gold and copper benefiting from structural demand and rate cut expectations' },
    cash: { weight: 0, bias: 'neutral', rationale: 'Fully invested given risk-on regime signal' },
  },
  topSignals: [
    { signal: 'Yield curve steepening', impact: 'bullish', source: 'rates' },
    { signal: 'Credit spreads tightening', impact: 'bullish', source: 'credit' },
    { signal: 'Commodity demand rising', impact: 'bullish', source: 'commodities' },
    { signal: 'Labor market softening', impact: 'bearish for equities near term', source: 'macro' },
    { signal: 'Consumer sentiment weakening', impact: 'bearish for consumer discretionary', source: 'sentiment' },
  ],
  updatedAt: '2025-05-15T16:00:00Z',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const detail = searchParams.get('detail')

  let data
  if (detail === 'full') {
    data = MOCK_CLASSIFICATION
  } else {
    data = {
      regime: MOCK_CLASSIFICATION.regime,
      factors: MOCK_CLASSIFICATION.factors,
      updatedAt: MOCK_CLASSIFICATION.updatedAt,
    }
  }

  return NextResponse.json({
    success: true,
    data,
  })
}
