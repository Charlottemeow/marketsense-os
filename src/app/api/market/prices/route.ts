import { NextRequest, NextResponse } from 'next/server'

const MOCK_PRICES = {
  equities: [
    { ticker: 'SPY', name: 'SPDR S&P 500 ETF', price: 531.42, change: -0.82, changePercent: -0.15, volume: 42500000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'QQQ', name: 'Invesco QQQ Trust', price: 452.18, change: -2.34, changePercent: -0.52, volume: 28500000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'AAPL', name: 'Apple Inc.', price: 189.50, change: 1.20, changePercent: 0.64, volume: 52000000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', price: 425.30, change: -3.10, changePercent: -0.72, volume: 18000000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 95.50, change: 2.80, changePercent: 3.02, volume: 220000000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 172.35, change: 0.45, changePercent: 0.26, volume: 15000000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 186.20, change: -1.50, changePercent: -0.80, volume: 32000000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: 248.75, change: 5.60, changePercent: 2.30, volume: 85000000, timestamp: '2025-05-15T16:00:00Z' },
  ],
  treasuries: [
    { ticker: 'TLT', name: '20+ Year Treasury ETF', price: 92.30, change: 0.85, changePercent: 0.93, volume: 12500000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'IEF', name: '7-10 Year Treasury ETF', price: 96.15, change: 0.32, changePercent: 0.33, volume: 5200000, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'SHY', name: '1-3 Year Treasury ETF', price: 82.40, change: 0.05, changePercent: 0.06, volume: 2100000, timestamp: '2025-05-15T16:00:00Z' },
  ],
  currencies: [
    { pair: 'EUR/USD', price: 1.0845, change: 0.0012, changePercent: 0.11, timestamp: '2025-05-15T16:00:00Z' },
    { pair: 'GBP/USD', price: 1.2720, change: -0.0035, changePercent: -0.27, timestamp: '2025-05-15T16:00:00Z' },
    { pair: 'USD/JPY', price: 151.80, change: -0.42, changePercent: -0.28, timestamp: '2025-05-15T16:00:00Z' },
    { pair: 'DXY', price: 104.25, change: -0.18, changePercent: -0.17, timestamp: '2025-05-15T16:00:00Z' },
  ],
  commodities: [
    { ticker: 'GC=F', name: 'Gold Futures', price: 2385.20, change: 15.40, changePercent: 0.65, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'CL=F', name: 'Crude Oil WTI', price: 78.50, change: -1.20, changePercent: -1.51, timestamp: '2025-05-15T16:00:00Z' },
    { ticker: 'HG=F', name: 'Copper Futures', price: 4.85, change: 0.08, changePercent: 1.68, timestamp: '2025-05-15T16:00:00Z' },
  ],
  rates: [
    { name: 'Fed Funds Rate', value: '5.25-5.50%', change: '0bp', timestamp: '2025-05-15T16:00:00Z' },
    { name: 'SOFR', value: '5.32%', change: '+1bp', timestamp: '2025-05-15T16:00:00Z' },
    { name: '2Y UST Yield', value: '4.82%', change: '-2bp', timestamp: '2025-05-15T16:00:00Z' },
    { name: '10Y UST Yield', value: '4.42%', change: '-4bp', timestamp: '2025-05-15T16:00:00Z' },
    { name: '30Y UST Yield', value: '4.65%', change: '-3bp', timestamp: '2025-05-15T16:00:00Z' },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'all'
  const period = searchParams.get('period') || '1d'

  let data: Record<string, unknown>
  if (category === 'all') {
    data = MOCK_PRICES
  } else if (category in MOCK_PRICES) {
    data = { [category]: MOCK_PRICES[category as keyof typeof MOCK_PRICES] }
  } else {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    period,
    data,
    updatedAt: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { symbols } = body

  return NextResponse.json({
    success: true,
    message: 'Price refresh completed',
    refreshedSymbols: symbols || 'all',
    timestamp: new Date().toISOString(),
  })
}
