import { NextResponse } from 'next/server'

export async function GET() {
  const updateSummary = {
    cron: 'asia-market',
    runAt: new Date().toISOString(),
    status: 'success',
    results: [
      {
        provider: 'Polygon',
        action: 'fetch_prices',
        symbols: ['EWJ', 'FXI', 'EWT', 'KOSPI', 'AS51', 'NKY'],
        recordsUpdated: 6,
        duration: '2.8s',
        status: 'success',
      },
      {
        provider: 'MarketAux',
        action: 'fetch_news',
        region: 'asia',
        articles: 24,
        duration: '1.0s',
        status: 'success',
      },
    ],
    totalDuration: '3.8s',
  }

  return NextResponse.json(updateSummary)
}
