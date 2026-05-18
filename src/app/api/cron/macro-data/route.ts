import { NextResponse } from 'next/server'

export async function GET() {
  const updateSummary = {
    cron: 'macro-data',
    runAt: new Date().toISOString(),
    status: 'success',
    results: [
      {
        provider: 'FRED',
        action: 'fetch_series',
        series: ['GDP', 'CPIAUCSL', 'UNRATE', 'FEDFUNDS', 'DGS10', 'T10YIE', 'PAYEMS', 'DGS2', 'DGS30', 'BAA10Y'],
        recordsUpdated: 30,
        duration: '3.5s',
        status: 'success',
      },
      {
        provider: 'OpenAI',
        action: 'classify_regime',
        inputSeries: ['GDP', 'CPIAUCSL', 'UNRATE', 'FEDFUNDS', 'DGS10', 'VIX', 'HY Spread'],
        result: {
          regime: 'Risk-On',
          score: 62.5,
          confidence: 0.72,
        },
        duration: '1.6s',
        status: 'success',
      },
    ],
    totalDuration: '5.1s',
  }

  return NextResponse.json(updateSummary)
}
