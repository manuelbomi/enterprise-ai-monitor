# Enterprise AI Monitor — Cost & Usage Analytics Dashboard

> A dedicated admin analytics dashboard for the **Enterprise AI Gateway** platform.
> Gives AI Architects and Finance teams daily/weekly cost breakdowns by team, user, and model — with budget alerts and a printable weekly report.

---

## What This Is

The [Enterprise AI Gateway](../enterprise-ai-gateway/) platform logs every LLM call with its user, team, model, token count, cost, and latency. This project is a **standalone React dashboard** that reads those logs through the gateway's API and presents them as the charts and tables that leadership actually wants to see.

**This is a pure frontend — no additional backend or database required.** It connects to your existing Enterprise AI Gateway API.

---

## What It Shows

| View | Purpose |
|---|---|
| **Overview** | Total spend / calls / tokens for today, this week, this month. The "at a glance" page for the AI Architect's morning check. |
| **Cost by Team** | Bar chart + sortable table with each department's spend, calls, and % of monthly budget used. |
| **Cost by User** | Ranked table of top spenders. Surfaces runaway usage before budgets are hit. |
| **Cost by Model** | Which LLM costs the most and is called the most. Informs the decision to restrict expensive models. |
| **Budget Status** | Traffic-light (green / amber / red) per team. Red = over 90% of monthly budget used. |
| **Weekly Report** | Printable page designed to be emailed to the CTO or Finance team every Monday. |

---

## UI Tour

> ASCII mockups of all six dashboard views — built with React 18 + TypeScript + Tailwind CSS + Recharts.

### Login Page

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                   ╔═══════════════════════════╗                      │
│                   ║  🧠 Enterprise AI Monitor  ║                      │
│                   ║   Admin & Analytics        ║                      │
│                   ╠═══════════════════════════╣                      │
│                   ║                           ║                      │
│                   ║  Work Email               ║                      │
│                   ║  ┌───────────────────┐    ║                      │
│                   ║  │ admin@company.com │    ║                      │
│                   ║  └───────────────────┘    ║                      │
│                   ║                           ║                      │
│                   ║  Password                 ║                      │
│                   ║  ┌───────────────────┐    ║                      │
│                   ║  │ ●●●●●●●●●●●●     │    ║                      │
│                   ║  └───────────────────┘    ║                      │
│                   ║                           ║                      │
│                   ║  [ Sign In → ]            ║                      │
│                   ║  Requires admin role      ║                      │
│                   ╚═══════════════════════════╝                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
  Same JWT credentials as Enterprise AI Gateway  ·  Auto-redirect to /
```

---

### Overview Page (`/`) — Morning Check-In

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ■ AI Monitor  │  Overview                                  [ 7d  30d  90d ] │
│───────────────┼─────────────────────────────────────────────────────────────│
│  📊 Overview  │                                                             │
│  👥 By Team   │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│  👤 By User   │  │ Total Spend   │ │  API Calls    │ │   Tokens      │    │
│  🤖 By Model  │  │   $142.37     │ │    8,291      │ │    14.2M      │    │
│  🛡️  Budget    │  │ 30-day period │ │ 30-day period │ │ 30-day period │    │
│  📋 Weekly    │  └───────────────┘ └───────────────┘ └───────────────┘    │
│               │                                                             │
│               │  ┌── Daily Spend — Last 30 days (USD) ─────────────────┐  │
│               │  │  $8 ┤                 ╭──╮                          │  │
│               │  │  $6 ┤           ╭─╮ ╭╯  ╰──╮                       │  │
│               │  │  $4 ┤   ╭──╮  ╭─╯ ╰─╯      ╰╮                     │  │
│               │  │  $2 ┤───╯  ╰──╯               ╰────                │  │
│               │  │  $0 └──────────────────────────────────────────     │  │
│               │  │      Nov 1   Nov 7  Nov 14  Nov 21  Nov 24          │  │
│               │  │      ── Spend (USD)   ╌╌ API Calls                  │  │
│               │  └─────────────────────────────────────────────────────┘  │
│               │                                                             │
│               │  Team Summary                                               │
│               │  ───────────────────────────────────────────────────────   │
│               │  Engineering    3,241   6.1M   $71.20   gpt-4o            │
│               │  HR             2,180   4.3M   $38.90   claude-sonnet     │
│               │  Logistics      1,920   2.8M   $22.47   gpt-4o-mini       │
│               │  C-Suite          950   1.0M    $9.80   claude-opus       │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

---

### Cost by Team (`/by-team`) — Spend vs. Budget

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ■ AI Monitor  │  Cost by Team                              [ 7d  30d  90d ] │
│───────────────┼─────────────────────────────────────────────────────────────│
│  📊 Overview  │  ┌── Spend by Department (USD) ─────────────────────────┐  │
│  👥 By Team   │  │  $80 ┤                                               │  │
│  👤 By User   │  │  $60 ┤        ████                                   │  │
│  🤖 By Model  │  │  $40 ┤  ████  ████  ████                             │  │
│  🛡️  Budget    │  │  $20 ┤  ████  ████  ████  ████                       │  │
│  📋 Weekly    │  │      └────────────────────────────────────────       │  │
│               │  │       Engineering  HR  Logistics  C-Suite            │  │
│               │  └──────────────────────────────────────────────────────┘  │
│               │                                                             │
│               │  Team         Calls    Tokens    Spend    Budget  Remaining Status │
│               │  ──────────────────────────────────────────────────────────────── │
│               │  Engineering  3,241    6.1M     $71.20   $500     $428.80  🟢 14% │
│               │  HR           2,180    4.3M     $38.90   $200     $161.10  🟢 19% │
│               │  Logistics    1,920    2.8M     $22.47   $150     $127.53  🟢 15% │
│               │  C-Suite        950    1.0M      $9.80   $300     $290.20  🟢  3% │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

---

### Budget Status (`/budget`) — Traffic-Light Alerts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ■ AI Monitor  │  Budget Status  — refreshes every 5 minutes               │
│───────────────┼─────────────────────────────────────────────────────────────│
│  📊 Overview  │  ┌─── ⚠️  Warning ──────────────────────────────────────┐  │
│  👥 By Team   │  │  1 team between 70–90% budget used                  │  │
│  👤 By User   │  │  Logistics — monitor closely this week              │  │
│  🤖 By Model  │  └──────────────────────────────────────────────────────┘  │
│  🛡️  Budget    │                                                             │
│  📋 Weekly    │  ┌── Engineering ──────┐  ┌── HR ───────────────────┐     │
│               │  │ 🟢 On track · 14%   │  │ 🟢 On track · 19%       │     │
│               │  │ ██░░░░░░░░░░░░░░░   │  │ ███░░░░░░░░░░░░░░░░░    │     │
│               │  │ Spent:    $71.20    │  │ Spent:    $38.90        │     │
│               │  │ Remaining:$428.80  │  │ Remaining:$161.10       │     │
│               │  │ Budget:   $500/mo   │  │ Budget:   $200/mo       │     │
│               │  └────────────────────┘  └─────────────────────────┘     │
│               │                                                             │
│               │  ┌── Logistics ────────┐  ┌── C-Suite ──────────────┐     │
│               │  │ 🟡 Warning · 75%    │  │ 🟢 On track · 3%        │     │
│               │  │ ████████████░░░░░   │  │ █░░░░░░░░░░░░░░░░░░░    │     │
│               │  │ Spent:    $112.50   │  │ Spent:     $9.80        │     │
│               │  │ Remaining: $37.50  │  │ Remaining:$290.20       │     │
│               │  │ Budget:   $150/mo   │  │ Budget:   $300/mo       │     │
│               │  └────────────────────┘  └─────────────────────────┘     │
└───────────────┴─────────────────────────────────────────────────────────────┘
  Green < 70%  ·  Amber 70–90%  ·  Red > 90%  ·  Live refresh every 5 min
```

---

### Weekly Report (`/weekly-report`) — Leadership Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ■ AI Monitor  │  Weekly Report                   [ 🖨️  Print / Save as PDF ] │
│───────────────┼─────────────────────────────────────────────────────────────│
│  📊 Overview  │  ╔═══════════════════════════════════════════════════════╗  │
│  👥 By Team   │  ║  Enterprise AI Platform — Weekly Summary             ║  │
│  👤 By User   │  ║  Report generated: November 24, 2026 · Last 7 days   ║  │
│  🤖 By Model  │  ╠═══════════════════════════════════════════════════════╣  │
│  🛡️  Budget    │  ║  This Week at a Glance                              ║  │
│  📋 Weekly    │  ║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ║  │
│               │  ║  │  $38.72      │ │   2,104      │ │      4       │ ║  │
│               │  ║  │ Total Spend  │ │  API Calls   │ │Active Teams  │ ║  │
│               │  ║  └──────────────┘ └──────────────┘ └──────────────┘ ║  │
│               │  ║                                                      ║  │
│               │  ║  4-Week Cost Trend by Team (stacked bar)             ║  │
│               │  ║  $50 ┤                       ████                   ║  │
│               │  ║  $40 ┤              ████     ████                   ║  │
│               │  ║  $30 ┤     ████     ████     ████                   ║  │
│               │  ║  $20 ┤     ████     ████     ████                   ║  │
│               │  ║       Nov 3   Nov 10   Nov 17   Nov 24              ║  │
│               │  ║       ■ Eng  ■ HR  ■ Logistics  ■ C-Suite           ║  │
│               │  ║                                                      ║  │
│               │  ║  Department Breakdown (Last 7 Days)                 ║  │
│               │  ║  Engineering   921   1.8M   $19.40   gpt-4o         ║  │
│               │  ║  HR            612   1.1M   $10.90   claude-sonnet  ║  │
│               │  ║  Logistics     421   0.7M    $6.22   gpt-4o-mini    ║  │
│               │  ║  C-Suite       150   0.3M    $2.20   claude-opus    ║  │
│               │  ╚═══════════════════════════════════════════════════════╝  │
└───────────────┴─────────────────────────────────────────────────────────────┘
  Browser Print → "Save as PDF" produces a clean A4 page  ·  Sidebar hidden
```

---

## Prerequisites

- The **Enterprise AI Gateway** backend must be running and accessible
- An account with `super_admin` or `team_admin` role on that platform
- Node.js 20+

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/enterprise-ai-monitor.git
cd enterprise-ai-monitor

# 2. Install dependencies
npm install

# 3. Configure the API URL
cp .env.example .env
# Edit .env — set VITE_API_URL to your gateway's backend URL:
#   Local dev:    VITE_API_URL=http://localhost:8000
#   Production:   VITE_API_URL=https://ai.acme.com/api

# 4. Run the dev server
npm run dev
# → http://localhost:5174
```

Log in with your Enterprise AI Gateway admin credentials. The monitor uses the same JWT auth — no separate login system.

---

## Project Structure

```
enterprise-ai-monitor/
├── src/
│   ├── App.tsx               # Router and auth guard
│   ├── main.tsx
│   ├── index.css
│   ├── config.ts             # API base URL from env var
│   ├── types/index.ts        # Analytics response types
│   ├── services/api.ts       # All analytics API calls
│   ├── components/
│   │   ├── RagBadge.tsx      # Green / Amber / Red status badge
│   │   ├── StatCard.tsx      # KPI tile (number + label + trend)
│   │   ├── SectionHeader.tsx
│   │   └── WeeklyReportTable.tsx
│   └── pages/
│       ├── Layout.tsx        # Sidebar + top bar shell
│       ├── LoginPage.tsx
│       ├── OverviewPage.tsx
│       ├── ByTeamPage.tsx
│       ├── ByUserPage.tsx
│       ├── ByModelPage.tsx
│       ├── BudgetStatusPage.tsx
│       └── WeeklyReportPage.tsx
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## API Endpoints Used

All endpoints are on the Enterprise AI Gateway backend. This dashboard calls:

| Endpoint | Used by |
|---|---|
| `POST /auth/login` | Login page |
| `GET /auth/me` | Auth guard |
| `GET /admin/analytics/usage-by-team?days=N` | Cost by Team, Overview |
| `GET /admin/analytics/daily-cost?days=N` | Overview trend chart |
| `GET /admin/analytics/usage-by-user?days=N` | Cost by User |
| `GET /admin/analytics/usage-by-model?days=N` | Cost by Model |
| `GET /admin/analytics/budget-status` | Budget Status |
| `GET /admin/analytics/weekly-summary?weeks=N` | Weekly Report |

---

## Deployment

Because this is a static React app, it can be served from anywhere:

```bash
# Build static files
npm run build
# → dist/ folder

# Serve from the same nginx as the gateway (add a /monitor location block)
# Or deploy to: Vercel, Netlify, S3 + CloudFront, Azure Static Web Apps
```

For internal deployments, host it at a memorable internal URL:
```
https://ai-monitor.acme.internal
```

---

*Companion project to [Enterprise AI Gateway](../enterprise-ai-gateway/).*
