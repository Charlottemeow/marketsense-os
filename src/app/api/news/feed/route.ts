import { NextRequest, NextResponse } from 'next/server'

const MOCK_NEWS = [
  {
    id: 'n1',
    title: 'Fed Minutes Show Officials Open to Rate Cuts if Inflation Continues to Moderate',
    source: 'Financial Times',
    url: 'https://example.com/fed-minutes-1',
    summary: 'Federal Reserve officials indicated they would be prepared to lower interest rates if inflation data continues to show improvement, according to minutes from the latest FOMC meeting.',
    publishedAt: '2025-05-15T14:30:00Z',
    sentiment: 'positive',
    symbols: ['SPY', 'QQQ', 'TLT'],
    topics: ['monetary policy', 'federal reserve', 'rates'],
  },
  {
    id: 'n2',
    title: 'April CPI Rises 0.3% Monthly, Core Inflation Eases to 2.8% YoY',
    source: 'Bloomberg',
    url: 'https://example.com/cpi-april',
    summary: 'Consumer prices rose less than expected in April, with core inflation declining to 2.8% year-over-year, supporting the case for Fed rate cuts later this year.',
    publishedAt: '2025-05-15T12:30:00Z',
    sentiment: 'positive',
    symbols: ['SPY', 'TLT', 'DXY'],
    topics: ['inflation', 'CPI', 'economic data'],
  },
  {
    id: 'n3',
    title: 'NVIDIA Announces Next-Generation Rubin AI Chip Architecture',
    source: 'Reuters',
    url: 'https://example.com/nvidia-rubin',
    summary: 'NVIDIA unveiled its next-generation Rubin AI chip architecture, promising 3x performance improvement over current Blackwell chips, with production slated for late 2026.',
    publishedAt: '2025-05-15T10:00:00Z',
    sentiment: 'positive',
    symbols: ['NVDA', 'AMD', 'INTC'],
    topics: ['semiconductors', 'AI', 'earnings'],
  },
  {
    id: 'n4',
    title: 'Oil Prices Slide as OPEC+ Considers Output Increase',
    source: 'Wall Street Journal',
    url: 'https://example.com/opec-oil',
    summary: 'Crude oil prices fell over 1.5% as reports emerged that OPEC+ is considering increasing production quotas at its upcoming meeting.',
    publishedAt: '2025-05-15T09:45:00Z',
    sentiment: 'negative',
    symbols: ['CL=F', 'XOM', 'CVX'],
    topics: ['commodities', 'energy', 'OPEC'],
  },
  {
    id: 'n5',
    title: 'Japan GDP Grows 0.5% QoQ, Beating Expectations on Strong Exports',
    source: 'Nikkei Asia',
    url: 'https://example.com/japan-gdp',
    summary: 'Japan\'s economy expanded at a 0.5% quarterly rate in Q1 2025, exceeding consensus estimates of 0.3%, driven by robust export growth and tourism spending.',
    publishedAt: '2025-05-15T05:00:00Z',
    sentiment: 'positive',
    symbols: ['EWJ', 'JPY=X'],
    topics: ['GDP', 'Japan', 'Asia'],
  },
  {
    id: 'n6',
    title: 'Treasury Yields Fall as Soft CPI Data Reinforces Rate Cut Expectations',
    source: 'CNBC',
    url: 'https://example.com/treasury-yields-cpi',
    summary: 'U.S. Treasury yields declined across the curve after the April CPI report came in below expectations, with the 10-year yield falling to 4.42%.',
    publishedAt: '2025-05-15T12:15:00Z',
    sentiment: 'positive',
    symbols: ['TLT', 'IEF', 'SHY'],
    topics: ['treasuries', 'yields', 'fixed income'],
  },
  {
    id: 'n7',
    title: 'Copper Prices Surge Past $5.00 on AI Data Center Demand',
    source: 'Mining Weekly',
    url: 'https://example.com/copper-surge',
    summary: 'Copper futures breached the $5.00 per pound mark for the first time as AI data center power demand and green energy transition drive structural demand growth.',
    publishedAt: '2025-05-14T15:00:00Z',
    sentiment: 'positive',
    symbols: ['HG=F', 'FCX', 'SCCO'],
    topics: ['commodities', 'copper', 'AI infrastructure'],
  },
  {
    id: 'n8',
    title: 'Apple Reports Record Services Revenue, iPhone Sales Miss',
    source: 'Bloomberg',
    url: 'https://example.com/apple-earnings',
    summary: 'Apple reported Q2 earnings with services revenue hitting an all-time high of $24.5 billion, though iPhone sales of $45.8 billion slightly missed analyst estimates.',
    publishedAt: '2025-05-14T20:30:00Z',
    sentiment: 'neutral',
    symbols: ['AAPL'],
    topics: ['earnings', 'technology', 'consumer'],
  },
  {
    id: 'n9',
    title: 'Eurozone Industrial Production Drops 1.2% in March, Misses Expectations',
    source: 'Financial Times',
    url: 'https://example.com/eurozone-industrial',
    summary: 'Eurozone industrial production fell more than expected in March, declining 1.2% month-over-month, raising concerns about the region\'s economic recovery.',
    publishedAt: '2025-05-14T09:00:00Z',
    sentiment: 'negative',
    symbols: ['EUR=X', 'EZU'],
    topics: ['eurozone', 'industrial production', 'economy'],
  },
  {
    id: 'n10',
    title: 'Bitcoin Rallies Above $68,000 as Institutional Inflows Accelerate',
    source: 'CoinDesk',
    url: 'https://example.com/bitcoin-rally',
    summary: 'Bitcoin surged past $68,000, reaching its highest level in three weeks, as spot ETF inflows picked up and positive CPI data boosted risk appetite.',
    publishedAt: '2025-05-15T11:00:00Z',
    sentiment: 'positive',
    symbols: ['BTC-USD', 'ETH-USD'],
    topics: ['crypto', 'bitcoin', 'ETF flows'],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const topic = searchParams.get('topic')
  const symbol = searchParams.get('symbol')

  let filtered = [...MOCK_NEWS]

  if (topic) {
    filtered = filtered.filter(item =>
      item.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    )
  }

  if (symbol) {
    const sym = symbol.toUpperCase()
    filtered = filtered.filter(item =>
      item.symbols.some(s => s === sym)
    )
  }

  filtered = filtered.slice(0, limit)

  return NextResponse.json({
    success: true,
    total: MOCK_NEWS.length,
    returned: filtered.length,
    articles: filtered,
    updatedAt: new Date().toISOString(),
  })
}
