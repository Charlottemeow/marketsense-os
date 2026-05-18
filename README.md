# Market Sense OS

A daily market research training dashboard for finance students. Combines cross-asset market data, macro indicators, news/events, structured note-taking, and stock pitch building into one daily habit-forming workflow.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Recharts, TradingView Widgets, Lucide React
- **Backend**: Next.js API Routes (server-side only)
- **Database**: Supabase PostgreSQL
- **Scheduling**: Vercel Cron Jobs

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

At minimum, set up one market data provider and FRED for macro data.

### 3. Set up the database

Run the migration SQL in `supabase/migrations/001_initial_schema.sql` against your Supabase project.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Daily Dashboard | `/` | Market theme, global snapshot, heatmap, top movers |
| Market Dashboard | `/dashboard` | Full asset price tables by category |
| Macro Dashboard | `/macro` | FRED series, yield curve, CPI, unemployment |
| News & Events | `/news` | Economic calendar, earnings, RSS feeds |
| Daily Notes | `/notes` | Structured daily reflection form |
| Why Did It Move | `/notes/why-did-it-move` | Asset move analysis |
| Topic Deep Dives | `/deep-dives` | Causal market event analysis |
| Stock Pitches | `/pitches` | 9-step stock pitch builder |
| Admin | `/admin` | Provider status, refresh, logs |

## Data Providers

See [docs/providers.md](docs/providers.md) for how to add or replace data providers.

## Disclaimer

This app is for education and market research training only. It is not financial advice.
