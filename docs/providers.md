# Data Provider Guide

## Architecture

All data providers implement the `DataProvider<T>` interface defined in `src/lib/providers/types.ts`:

```typescript
interface DataProvider<T> {
  name: string
  fetchLatest(): Promise<T[]>
  fetchHistorical(symbol: string, from: string, to: string): Promise<T[]>
  isAvailable(): boolean
  rateLimit?: { remaining: number; resetAt: Date }
}
```

## Provider Priority

The system auto-selects the first available provider based on environment variable priority:

1. Twelve Data (`TWELVE_DATA_API_KEY`)
2. Alpha Vantage (`ALPHA_VANTAGE_API_KEY`)
3. Financial Modeling Prep (`FMP_API_KEY`)
4. Finnhub (`FINNHUB_API_KEY`)

## Adding a New Provider

1. Create a new file in `src/lib/providers/`
2. Implement the `DataProvider<T>` interface
3. Register it in `src/lib/providers/registry.ts`
4. Add the API key to `.env.example`

## FRED Macro Data

Macro data uses the FRED API exclusively. Configure via `FRED_API_KEY`.

## RSS / News Feeds

RSS feed URLs are configured via environment variables (`RSS_FEED_URL_1`, `RSS_FEED_URL_2`, etc.).

## Mock Data Fallback

When no API keys are configured, all providers return clearly-labeled mock data suitable for development and demonstration.
