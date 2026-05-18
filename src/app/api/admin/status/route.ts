import { NextResponse } from 'next/server'

const MOCK_STATUS = {
  system: {
    uptime: '14d 6h 32m',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    lastBuild: '2025-05-14T22:00:00Z',
  },
  providers: [
    { id: 'fred', name: 'FRED (Fed Economic Data)', status: 'online', lastFetch: '2025-05-15 08:30:00', records: 2847, error: null, rateLimit: '950/1000' },
    { id: 'marketaux', name: 'MarketAux (News)', status: 'online', lastFetch: '2025-05-15 08:15:00', records: 1523, error: null, rateLimit: '480/500' },
    { id: 'polygon', name: 'Polygon (Prices)', status: 'degraded', lastFetch: '2025-05-15 07:45:00', records: 8921, error: 'Rate limit at 85%', rateLimit: '425/500' },
    { id: 'finnhub', name: 'Finnhub (Calendar)', status: 'online', lastFetch: '2025-05-15 08:00:00', records: 456, error: null, rateLimit: '280/300' },
    { id: 'openai', name: 'OpenAI (Classification)', status: 'error', lastFetch: '2025-05-14 23:00:00', records: 128, error: 'API returned 429 - Too Many Requests', rateLimit: '150/150' },
    { id: 'rss', name: 'RSS Feeds', status: 'idle', lastFetch: null, records: 0, error: null, rateLimit: null },
  ],
  cron: {
    usMarket: { lastRun: '2025-05-15 16:30:00', status: 'success', duration: '4.2s' },
    asiaMarket: { lastRun: '2025-05-15 06:00:00', status: 'success', duration: '3.8s' },
    macroData: { lastRun: '2025-05-15 08:30:00', status: 'success', duration: '5.1s' },
    news: { lastRun: '2025-05-15 08:15:00', status: 'success', duration: '2.9s' },
  },
  updatedAt: new Date().toISOString(),
}

export async function GET() {
  return NextResponse.json({
    success: true,
    ...MOCK_STATUS,
  })
}
