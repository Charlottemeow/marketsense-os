import { NextRequest, NextResponse } from 'next/server'

const MOCK_PITCHES = [
  {
    id: '1',
    companyName: 'NVIDIA Corporation',
    ticker: 'NVDA',
    sector: 'Semiconductors',
    currentPrice: '$95.50',
    recommendation: 'Long',
    targetPrice: '$180.00',
    timeHorizon: '12 months',
    marketNarrative: 'The market is focused on near-term GPU inventory digestion and ignores the structural AI infrastructure buildout.',
    variantViewBull: 'AI reasoning models require 10x more compute per query, extending the GPU demand super-cycle.',
    variantViewBear: 'Hyperscalers developing custom ASICs that erode NVIDIA\'s market share over time.',
    investmentThesis: 'NVIDIA\'s CUDA ecosystem creates a switching cost moat that ASICs will not overcome.',
    valuationMethodology: 'DCF',
    valuationAnalysis: 'DCF using 30% revenue CAGR through 2028 yields $180/share (45x 2026 EPS).',
    catalysts: 'GTC conference, Q1 earnings, Blackwell ramp, Sovereign AI deal flow',
    risks: 'ASIC competition, US-China chip restrictions, Inventory correction, CEO insider selling',
    createdAt: '2025-05-14T10:00:00Z',
    updatedAt: '2025-05-14T10:00:00Z',
  },
  {
    id: '2',
    companyName: 'iShares 20+ Year Treasury Bond ETF',
    ticker: 'TLT',
    sector: 'Fixed Income',
    currentPrice: '$92.30',
    recommendation: 'Long',
    targetPrice: '$105.00',
    timeHorizon: '6 months',
    marketNarrative: 'Growth slowdown and Fed pivot will drive rates lower. The market is underestimating the pace of disinflation.',
    variantViewBull: 'Recession fears trigger aggressive Fed easing. 10Y yield falls to 3.50%, TLT rallies to $115.',
    variantViewBear: 'Sticky inflation prevents Fed from cutting. 10Y remains above 4.50%. TLT rangebound.',
    investmentThesis: 'Position for duration rally as the lagged effects of restrictive Fed policy bite and the labor market softens.',
    valuationMethodology: 'DCF',
    valuationAnalysis: 'Based on rate path modeling, TLT is undervalued by ~14% assuming three 25bp cuts.',
    catalysts: 'CPI print, FOMC meeting, NFP data, Fed speak, Treasury auction demand',
    risks: 'Fiscal expansion, supply glut, inflation reacceleration, hawkish Fed surprise',
    createdAt: '2025-05-12T10:00:00Z',
    updatedAt: '2025-05-12T10:00:00Z',
  },
]

const pitches = [...MOCK_PITCHES]

export async function GET() {
  return NextResponse.json({
    success: true,
    total: pitches.length,
    pitches,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const now = new Date().toISOString()

  const newPitch = {
    id: String(pitches.length + 1),
    ...body,
    createdAt: now,
    updatedAt: now,
  }

  pitches.unshift(newPitch)

  return NextResponse.json({
    success: true,
    message: 'Pitch created successfully',
    pitch: newPitch,
  }, { status: 201 })
}
