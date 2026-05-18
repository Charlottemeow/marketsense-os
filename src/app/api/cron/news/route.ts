import { NextResponse } from 'next/server'

export async function GET() {
  const updateSummary = {
    cron: 'news',
    runAt: new Date().toISOString(),
    status: 'success',
    results: [
      {
        provider: 'MarketAux',
        action: 'fetch_news',
        categories: ['general', 'earnings', 'macro', 'commodities', 'crypto'],
        articles: 48,
        duration: '1.9s',
        status: 'success',
      },
      {
        provider: 'RSS',
        action: 'poll_feeds',
        feeds: [
          'https://feeds.ft.com/ft/news',
          'https://www.wsj.com/xml/rss/3_7085.xml',
          'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
        ],
        articles: 18,
        duration: '1.0s',
        status: 'success',
      },
    ],
    totalDuration: '2.9s',
  }

  return NextResponse.json(updateSummary)
}
