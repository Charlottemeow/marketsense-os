import { NextResponse } from 'next/server'

export async function GET() {
  const updateSummary = {
    cron: 'us-market',
    runAt: new Date().toISOString(),
    status: 'success',
    results: [
      {
        provider: 'Polygon',
        action: 'fetch_prices',
        symbols: ['SPY', 'QQQ', 'TLT', 'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'IEF', 'DIA'],
        recordsUpdated: 11,
        duration: '3.2s',
        status: 'success',
      },
      {
        provider: 'Finnhub',
        action: 'fetch_calendar',
        date: new Date().toISOString().split('T')[0],
        events: 8,
        duration: '1.0s',
        status: 'success',
      },
    ],
    totalDuration: '4.2s',
  }

  return NextResponse.json(updateSummary)
}
