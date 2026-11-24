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
