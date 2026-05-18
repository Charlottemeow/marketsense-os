import type { AssetCategory } from '@/types/asset'

export const STALE_DATA_THRESHOLD_MINUTES = 15

export const APP_NAME = 'Marketsense OS'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const APP_TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Shanghai'

export const API_ENDPOINTS = {
  MARKET_DATA: '/api/market-data',
  MACRO_DATA: '/api/macro-data',
  NEWS: '/api/news',
  ECONOMIC_CALENDAR: '/api/economic-calendar',
  NOTES: '/api/notes',
  PITCHES: '/api/pitches',
  REGIME: '/api/regime',
  RSS_FEEDS: '/api/rss-feeds',
} as const

export const DEFAULT_WATCHLIST: {
  symbol: string
  name: string
  category: AssetCategory
  exchange: string
  currency: string
  sector?: string
}[] = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Broad Market' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'etf', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Broad Market' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Small Cap' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Consumer Cyclical' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms Inc.', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'equity', exchange: 'NASDAQ', currency: 'USD', sector: 'Consumer Cyclical' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'equity', exchange: 'NYSE', currency: 'USD', sector: 'Financial' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Broad Market' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Commodity' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'etf', exchange: 'NASDAQ', currency: 'USD', sector: 'Fixed Income' },
  { symbol: 'XAU/USD', name: 'Gold Spot', category: 'commodity', exchange: 'OTC', currency: 'USD' },
  { symbol: 'XAG/USD', name: 'Silver Spot', category: 'commodity', exchange: 'OTC', currency: 'USD' },
  { symbol: 'USO', name: 'United States Oil Fund', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Commodity' },
  { symbol: 'DXY', name: 'US Dollar Index', category: 'index', exchange: 'ICE', currency: 'USD' },
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', exchange: 'Coinbase', currency: 'USD' },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', exchange: 'Coinbase', currency: 'USD' },
  { symbol: 'IXIC', name: 'NASDAQ Composite', category: 'index', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'DJI', name: 'Dow Jones Industrial Average', category: 'index', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'VIX', name: 'CBOE Volatility Index', category: 'index', exchange: 'CBOE', currency: 'USD' },
  { symbol: 'HYG', name: 'iShares iBoxx High Yield Corporate Bond ETF', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Fixed Income' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Emerging Markets' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Financial' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', category: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Technology' },
]

export const FRED_SERIES: {
  code: string
  name: string
  category: string
  unit: string
  frequency: string
  description: string
}[] = [
  { code: 'FEDFUNDS', name: 'Federal Funds Effective Rate', category: 'interest_rates', unit: '%', frequency: 'monthly', description: 'Effective federal funds rate' },
  { code: 'DFF', name: 'Federal Funds Effective Rate (Daily)', category: 'interest_rates', unit: '%', frequency: 'daily', description: 'Daily effective federal funds rate' },
  { code: 'DGS10', name: '10-Year Treasury Constant Maturity Rate', category: 'interest_rates', unit: '%', frequency: 'daily', description: 'Yield on 10-year US Treasury securities' },
  { code: 'DGS2', name: '2-Year Treasury Constant Maturity Rate', category: 'interest_rates', unit: '%', frequency: 'daily', description: 'Yield on 2-year US Treasury securities' },
  { code: 'T10Y2Y', name: '10-Year Minus 2-Year Treasury Yield Spread', category: 'interest_rates', unit: '%', frequency: 'daily', description: 'Yield curve spread' },
  { code: 'CPIAUCSL', name: 'Consumer Price Index for All Urban Consumers', category: 'inflation', unit: 'Index 1982-1984=100', frequency: 'monthly', description: 'Headline CPI' },
  { code: 'CPILFESL', name: 'Consumer Price Index Less Food and Energy', category: 'inflation', unit: 'Index 1982-1984=100', frequency: 'monthly', description: 'Core CPI' },
  { code: 'PCEPILFE', name: 'Personal Consumption Expenditures Excluding Food and Energy', category: 'inflation', unit: 'Index 2012=100', frequency: 'monthly', description: 'Core PCE price index' },
  { code: 'UNRATE', name: 'Unemployment Rate', category: 'employment', unit: '%', frequency: 'monthly', description: 'US unemployment rate' },
  { code: 'PAYEMS', name: 'Total Nonfarm Payrolls', category: 'employment', unit: 'Thousands', frequency: 'monthly', description: 'Monthly change in nonfarm payrolls' },
  { code: 'AWHMAN', name: 'Average Weekly Hours of Production Employees: Manufacturing', category: 'employment', unit: 'Hours', frequency: 'monthly', description: 'Average weekly hours in manufacturing' },
  { code: 'GDP', name: 'Gross Domestic Product', category: 'gdp', unit: 'Billions $', frequency: 'quarterly', description: 'Nominal GDP' },
  { code: 'GDPC1', name: 'Real Gross Domestic Product', category: 'gdp', unit: 'Billions Chained 2012 $', frequency: 'quarterly', description: 'Real GDP' },
  { code: 'HOUST', name: 'Housing Starts: Total: New Privately Owned Housing Units Started', category: 'housing', unit: 'Thousands', frequency: 'monthly', description: 'Monthly housing starts' },
  { code: 'MORTGAGE30US', name: '30-Year Fixed Rate Mortgage Average', category: 'housing', unit: '%', frequency: 'weekly', description: 'Average 30-year mortgage rate' },
  { code: 'UMCSENT', name: 'University of Michigan Consumer Sentiment', category: 'sentiment', unit: 'Index', frequency: 'monthly', description: 'Consumer sentiment index' },
  { code: 'INDPRO', name: 'Industrial Production Index', category: 'manufacturing', unit: 'Index 2017=100', frequency: 'monthly', description: 'Total industrial production' },
  { code: 'TCU', name: 'Capacity Utilization: Total Industry', category: 'manufacturing', unit: '%', frequency: 'monthly', description: 'Capacity utilization rate' },
  { code: 'DSPIC96', name: 'Real Disposable Personal Income', category: 'consumer', unit: 'Billions Chained 2017 $', frequency: 'monthly', description: 'Real DPI' },
  { code: 'WTREGEN', name: 'West Texas Intermediate Crude Oil Price', category: 'commodity', unit: '$ per Barrel', frequency: 'daily', description: 'WTI crude oil spot price' },
]

export const MARKET_REGIMES: Record<string, { name: string; description: string; color: string }> = {
  risk_on: {
    name: 'Risk On',
    description: 'Equities rallying, credit spreads tight, VIX low, USD stable or weak, commodities bid',
    color: '#22C55E',
  },
  risk_off: {
    name: 'Risk Off',
    description: 'Equities selling off, credit spreads widening, VIX elevated, USD bid, yields falling',
    color: '#EF4444',
  },
  higher_for_longer: {
    name: 'Higher for Longer',
    description: 'Fed holding rates high, short-term yields elevated, bond market under pressure, growth resilient',
    color: '#F59E0B',
  },
  growth_scare: {
    name: 'Growth Scare',
    description: 'Growth data missing expectations lower, yields falling on growth fears, cyclicals underperforming',
    color: '#8B5CF6',
  },
  inflation_scare: {
    name: 'Inflation Scare',
    description: 'Core inflation prints hot, breakevens widening, Fed hawkish repricing, TIPS outperforming',
    color: '#EC4899',
  },
  usd_liquidity_stress: {
    name: 'USD Liquidity Stress',
    description: 'DXY surging, EM currencies under pressure, cross-currency basis widening, reserve drain accelerating',
    color: '#06B6D4',
  },
}

export const REGIME_CLASSIFICATION_RULES = {
  risk_on: {
    conditions: [
      { indicator: 'SPY_1M_RETURN', threshold: 0.02, direction: 'above' },
      { indicator: 'VIX_LEVEL', threshold: 15, direction: 'below' },
      { indicator: 'HY_SPREAD', threshold: 3.5, direction: 'below' },
    ],
    weight: 1,
  },
  risk_off: {
    conditions: [
      { indicator: 'SPY_1M_RETURN', threshold: -0.02, direction: 'below' },
      { indicator: 'VIX_LEVEL', threshold: 25, direction: 'above' },
      { indicator: 'HY_SPREAD', threshold: 5.0, direction: 'above' },
    ],
    weight: 1,
  },
  higher_for_longer: {
    conditions: [
      { indicator: 'FEDFUNDS', threshold: 4.5, direction: 'above' },
      { indicator: 'DGS2', threshold: 4.0, direction: 'above' },
      { indicator: 'GDP_GROWTH', threshold: 0.02, direction: 'above' },
    ],
    weight: 1,
  },
  growth_scare: {
    conditions: [
      { indicator: 'GDP_GROWTH', threshold: 0.01, direction: 'below' },
      { indicator: 'PAYEMS_CHANGE', threshold: 100, direction: 'below' },
      { indicator: 'DGS10', threshold: 0.3, direction: 'below_1m_change' },
    ],
    weight: 1,
  },
  inflation_scare: {
    conditions: [
      { indicator: 'CPI_YOY', threshold: 0.03, direction: 'above' },
      { indicator: 'PCE_YOY', threshold: 0.025, direction: 'above' },
      { indicator: 'BREAKEVEN_10Y', threshold: 0.025, direction: 'above' },
    ],
    weight: 1,
  },
  usd_liquidity_stress: {
    conditions: [
      { indicator: 'DXY_1M_RETURN', threshold: 0.02, direction: 'above' },
      { indicator: 'EM_CURRENCY_INDEX', threshold: -0.02, direction: 'below' },
      { indicator: 'RREP', threshold: 0, direction: 'below' },
    ],
    weight: 1,
  },
} as const

export const DATA_SOURCE_PRIORITY = ['TWELVE_DATA', 'ALPHA_VANTAGE', 'FMP', 'FINNHUB'] as const

export const RSS_FEED_DEFAULTS = {
  WALLSTREET_CN_NEWS: 'https://rsshub.app/wallstreetcn/news',
  WALLSTREET_CN_LIVE: 'https://rsshub.app/wallstreetcn/live',
}
