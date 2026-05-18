-- MarketSense OS - Initial Schema
-- All 11 tables for the marketsense-os finance dashboard

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ASSETS
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('equity', 'etf', 'index', 'commodity', 'currency', 'crypto', 'bond', 'macro')),
  exchange TEXT NOT NULL DEFAULT '',
  currency TEXT NOT NULL DEFAULT 'USD',
  isin TEXT,
  sector TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_symbol ON assets (symbol);
CREATE INDEX idx_assets_category ON assets (category);
CREATE INDEX idx_assets_active ON assets (active) WHERE active = TRUE;

-- 2. MARKET PRICES
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  price DOUBLE PRECISION NOT NULL,
  open DOUBLE PRECISION NOT NULL DEFAULT 0,
  high DOUBLE PRECISION NOT NULL DEFAULT 0,
  low DOUBLE PRECISION NOT NULL DEFAULT 0,
  close DOUBLE PRECISION NOT NULL DEFAULT 0,
  volume BIGINT NOT NULL DEFAULT 0,
  change DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  previous_close DOUBLE PRECISION NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT '',
  source_label TEXT NOT NULL DEFAULT '',
  is_mock BOOLEAN NOT NULL DEFAULT FALSE,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_prices_asset_id ON market_prices (asset_id);
CREATE INDEX idx_market_prices_fetched_at ON market_prices (fetched_at DESC);
CREATE INDEX idx_market_prices_asset_fetched ON market_prices (asset_id, fetched_at DESC);

-- 3. MACRO SERIES
CREATE TABLE macro_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fred_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('interest_rates', 'inflation', 'employment', 'gdp', 'housing', 'consumer', 'manufacturing', 'services', 'trade', 'sentiment')),
  unit TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
  seasonally_adjusted BOOLEAN NOT NULL DEFAULT FALSE,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_macro_series_code ON macro_series (fred_code);
CREATE INDEX idx_macro_series_category ON macro_series (category);

-- 4. MACRO OBSERVATIONS
CREATE TABLE macro_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID NOT NULL REFERENCES macro_series(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  change DOUBLE PRECISION,
  change_percent DOUBLE PRECISION,
  UNIQUE(series_id, date)
);

CREATE INDEX idx_macro_observations_series ON macro_observations (series_id);
CREATE INDEX idx_macro_observations_date ON macro_observations (date DESC);

-- 5. ECONOMIC EVENTS
CREATE TABLE economic_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  category TEXT NOT NULL CHECK (category IN ('interest_rates', 'inflation', 'employment', 'gdp', 'housing', 'consumer', 'manufacturing', 'services', 'trade', 'sentiment')),
  importance TEXT NOT NULL CHECK (importance IN ('low', 'medium', 'high')),
  previous DOUBLE PRECISION,
  forecast DOUBLE PRECISION,
  actual DOUBLE PRECISION,
  revised DOUBLE PRECISION,
  source TEXT NOT NULL DEFAULT '',
  source_label TEXT NOT NULL DEFAULT '',
  is_mock BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_economic_events_date ON economic_events (date);
CREATE INDEX idx_economic_events_importance ON economic_events (importance);
CREATE INDEX idx_economic_events_category ON economic_events (category);

-- 6. NEWS ITEMS
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  source_logo_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('markets', 'economy', 'earnings', 'central_banks', 'geopolitics', 'sector', 'company', 'regulation')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author TEXT,
  sentiment DOUBLE PRECISION,
  symbols TEXT[] DEFAULT '{}',
  is_mock BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT
);

CREATE INDEX idx_news_items_published ON news_items (published_at DESC);
CREATE INDEX idx_news_items_category ON news_items (category);
CREATE INDEX idx_news_items_source ON news_items (source);
CREATE INDEX idx_news_items_symbols ON news_items USING GIN (symbols);

-- 7. DAILY MARKET NOTES
CREATE TABLE daily_market_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence TEXT CHECK (confidence IN ('low', 'medium', 'high')),
  market_context TEXT
);

CREATE INDEX idx_daily_notes_date ON daily_market_notes (date DESC);
CREATE INDEX idx_daily_notes_pinned ON daily_market_notes (is_pinned) WHERE is_pinned = TRUE;

-- 8. WHY DID IT MOVE NOTES
CREATE TABLE why_did_it_move_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  symbol TEXT NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  event_cause TEXT,
  catalyst_summary TEXT NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
  related_events TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wdim_symbol ON why_did_it_move_notes (symbol);
CREATE INDEX idx_wdim_date ON why_did_it_move_notes (date DESC);

-- 9. TOPIC DEEP DIVES
CREATE TABLE topic_deep_dives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  topic TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  related_series_codes TEXT[] NOT NULL DEFAULT '{}',
  sources TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deep_dives_topic ON topic_deep_dives (topic);
CREATE INDEX idx_deep_dives_tags ON topic_deep_dives USING GIN (tags);

-- 10. STOCK PITCHES
CREATE TABLE stock_pitches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('strong_buy', 'buy', 'hold', 'sell', 'strong_sell')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  entry_price DOUBLE PRECISION,
  current_price DOUBLE PRECISION,
  target_price DOUBLE PRECISION,
  stop_loss DOUBLE PRECISION,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  confidence DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pitches_symbol ON stock_pitches (symbol);
CREATE INDEX idx_pitches_status ON stock_pitches (status);
CREATE INDEX idx_pitches_recommendation ON stock_pitches (recommendation);

-- PITCH STEPS
CREATE TABLE pitch_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stock_pitch_id UUID NOT NULL REFERENCES stock_pitches(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  checklist_items TEXT[] NOT NULL DEFAULT '{}',
  UNIQUE(stock_pitch_id, step_number)
);

CREATE INDEX idx_pitch_steps_pitch_id ON pitch_steps (stock_pitch_id);
CREATE INDEX idx_pitch_steps_step ON pitch_steps (stock_pitch_id, step_number);

-- 11. DATA SOURCE LOGS
CREATE TABLE data_source_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  source_label TEXT NOT NULL DEFAULT '',
  endpoint TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'rate_limited', 'mock')),
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  is_mock BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT,
  queried_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_source ON data_source_logs (source);
CREATE INDEX idx_logs_status ON data_source_logs (status);
CREATE INDEX idx_logs_queried ON data_source_logs (queried_at DESC);

-- ============== SEED DATA ==============

-- Insert DEFAULT_WATCHLIST assets
INSERT INTO assets (symbol, name, category, exchange, currency, sector) VALUES
  ('SPY', 'SPDR S&P 500 ETF Trust', 'etf', 'NYSE', 'USD', 'Broad Market'),
  ('QQQ', 'Invesco QQQ Trust', 'etf', 'NASDAQ', 'USD', 'Technology'),
  ('DIA', 'SPDR Dow Jones Industrial Average ETF', 'etf', 'NYSE', 'USD', 'Broad Market'),
  ('IWM', 'iShares Russell 2000 ETF', 'etf', 'NYSE', 'USD', 'Small Cap'),
  ('AAPL', 'Apple Inc.', 'equity', 'NASDAQ', 'USD', 'Technology'),
  ('MSFT', 'Microsoft Corporation', 'equity', 'NASDAQ', 'USD', 'Technology'),
  ('GOOGL', 'Alphabet Inc.', 'equity', 'NASDAQ', 'USD', 'Technology'),
  ('AMZN', 'Amazon.com Inc.', 'equity', 'NASDAQ', 'USD', 'Consumer Cyclical'),
  ('NVDA', 'NVIDIA Corporation', 'equity', 'NASDAQ', 'USD', 'Technology'),
  ('META', 'Meta Platforms Inc.', 'equity', 'NASDAQ', 'USD', 'Technology'),
  ('TSLA', 'Tesla Inc.', 'equity', 'NASDAQ', 'USD', 'Consumer Cyclical'),
  ('JPM', 'JPMorgan Chase & Co.', 'equity', 'NYSE', 'USD', 'Financial'),
  ('VTI', 'Vanguard Total Stock Market ETF', 'etf', 'NYSE', 'USD', 'Broad Market'),
  ('GLD', 'SPDR Gold Shares', 'etf', 'NYSE', 'USD', 'Commodity'),
  ('TLT', 'iShares 20+ Year Treasury Bond ETF', 'etf', 'NASDAQ', 'USD', 'Fixed Income'),
  ('XAU/USD', 'Gold Spot', 'commodity', 'OTC', 'USD', NULL),
  ('XAG/USD', 'Silver Spot', 'commodity', 'OTC', 'USD', NULL),
  ('USO', 'United States Oil Fund', 'etf', 'NYSE', 'USD', 'Commodity'),
  ('DXY', 'US Dollar Index', 'index', 'ICE', 'USD', NULL),
  ('BTC/USD', 'Bitcoin', 'crypto', 'Coinbase', 'USD', NULL),
  ('ETH/USD', 'Ethereum', 'crypto', 'Coinbase', 'USD', NULL),
  ('IXIC', 'NASDAQ Composite', 'index', 'NASDAQ', 'USD', NULL),
  ('DJI', 'Dow Jones Industrial Average', 'index', 'NYSE', 'USD', NULL),
  ('VIX', 'CBOE Volatility Index', 'index', 'CBOE', 'USD', NULL),
  ('HYG', 'iShares iBoxx High Yield Corporate Bond ETF', 'etf', 'NYSE', 'USD', 'Fixed Income'),
  ('EEM', 'iShares MSCI Emerging Markets ETF', 'etf', 'NYSE', 'USD', 'Emerging Markets'),
  ('XLF', 'Financial Select Sector SPDR Fund', 'etf', 'NYSE', 'USD', 'Financial'),
  ('XLK', 'Technology Select Sector SPDR Fund', 'etf', 'NYSE', 'USD', 'Technology')
ON CONFLICT (symbol) DO NOTHING;

-- Insert FRED macro series definitions
INSERT INTO macro_series (fred_code, name, category, unit, frequency, seasonally_adjusted, description) VALUES
  ('FEDFUNDS', 'Federal Funds Effective Rate', 'interest_rates', '%', 'monthly', FALSE, 'Effective federal funds rate'),
  ('DFF', 'Federal Funds Effective Rate (Daily)', 'interest_rates', '%', 'daily', FALSE, 'Daily effective federal funds rate'),
  ('DGS10', '10-Year Treasury Constant Maturity Rate', 'interest_rates', '%', 'daily', FALSE, 'Yield on 10-year US Treasury securities'),
  ('DGS2', '2-Year Treasury Constant Maturity Rate', 'interest_rates', '%', 'daily', FALSE, 'Yield on 2-year US Treasury securities'),
  ('T10Y2Y', '10-Year Minus 2-Year Treasury Yield Spread', 'interest_rates', '%', 'daily', FALSE, 'Yield curve spread'),
  ('CPIAUCSL', 'Consumer Price Index for All Urban Consumers', 'inflation', 'Index 1982-1984=100', 'monthly', TRUE, 'Headline CPI'),
  ('CPILFESL', 'Consumer Price Index Less Food and Energy', 'inflation', 'Index 1982-1984=100', 'monthly', TRUE, 'Core CPI'),
  ('PCEPILFE', 'Personal Consumption Expenditures Excluding Food and Energy', 'inflation', 'Index 2012=100', 'monthly', TRUE, 'Core PCE price index'),
  ('UNRATE', 'Unemployment Rate', 'employment', '%', 'monthly', TRUE, 'US unemployment rate'),
  ('PAYEMS', 'Total Nonfarm Payrolls', 'employment', 'Thousands', 'monthly', TRUE, 'Monthly change in nonfarm payrolls'),
  ('AWHMAN', 'Average Weekly Hours of Production Employees: Manufacturing', 'employment', 'Hours', 'monthly', TRUE, 'Average weekly hours in manufacturing'),
  ('GDP', 'Gross Domestic Product', 'gdp', 'Billions $', 'quarterly', FALSE, 'Nominal GDP'),
  ('GDPC1', 'Real Gross Domestic Product', 'gdp', 'Billions Chained 2012 $', 'quarterly', TRUE, 'Real GDP'),
  ('HOUST', 'Housing Starts: Total: New Privately Owned Housing Units Started', 'housing', 'Thousands', 'monthly', TRUE, 'Monthly housing starts'),
  ('MORTGAGE30US', '30-Year Fixed Rate Mortgage Average', 'housing', '%', 'weekly', FALSE, 'Average 30-year mortgage rate'),
  ('UMCSENT', 'University of Michigan Consumer Sentiment', 'sentiment', 'Index', 'monthly', FALSE, 'Consumer sentiment index'),
  ('INDPRO', 'Industrial Production Index', 'manufacturing', 'Index 2017=100', 'monthly', TRUE, 'Total industrial production'),
  ('TCU', 'Capacity Utilization: Total Industry', 'manufacturing', '%', 'monthly', TRUE, 'Capacity utilization rate'),
  ('DSPIC96', 'Real Disposable Personal Income', 'consumer', 'Billions Chained 2017 $', 'monthly', TRUE, 'Real DPI'),
  ('WTREGEN', 'West Texas Intermediate Crude Oil Price', 'commodity', '$ per Barrel', 'daily', FALSE, 'WTI crude oil spot price')
ON CONFLICT (fred_code) DO NOTHING;
