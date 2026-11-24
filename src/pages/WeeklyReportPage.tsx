// ============================================================
// Weekly Report — printable/exportable summary designed to be
// emailed to the CTO or Finance team every Monday morning.
// Click "Print / Save as PDF" in the browser to export.
// ============================================================

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeeklySummary, getBudgetStatus, getTeamUsage } from '@/services/api';
import { RagBadge } from '@/components/RagBadge';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export const WeeklyReportPage: React.FC = () => {
  const { data: weekly = [] }  = useQuery({ queryKey: ['weekly-summary'], queryFn: () => getWeeklySummary(4) });
  const { data: budgets = [] } = useQuery({ queryKey: ['budget-status'], queryFn: getBudgetStatus });
  const { data: teams = [] }   = useQuery({ queryKey: ['team-usage-7', 7], queryFn: () => getTeamUsage(7) });

  const thisWeekTotal = teams.reduce((s, t) => s + t.total_cost_usd, 0);
  const thisWeekCalls = teams.reduce((s, t) => s + t.total_calls, 0);
  const today = format(new Date(), 'MMMM d, yyyy');

  // Pivot weekly data for the grouped bar chart: [{week_start, Team1: cost, Team2: cost, ...}]
  const teamNames = [...new Set(weekly.map(r => r.team_name))];
  const weeks = [...new Set(weekly.map(r => r.week_start))].sort();
  const pivoted = weeks.map(w => {
    const row: Record<string, string | number> = { week: w.slice(5) }; // MM-DD
    teamNames.forEach(t => {
      const found = weekly.find(r => r.week_start === w && r.team_name === t);
      row[t] = found?.cost_usd ?? 0;
    });
    return row;
  });

  const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];

  return (
    <div className="p-6 space-y-6">
      {/* Header + Print button */}
      <div className="flex items-start justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Designed to be emailed to leadership — click Print to save as PDF
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* ---- PRINTABLE CONTENT STARTS HERE ---- */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 print:border-none print:p-0 space-y-8 max-w-4xl">

        {/* Report header */}
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-xl font-bold text-gray-900">Enterprise AI Platform — Weekly Summary</h2>
          <p className="text-sm text-gray-500 mt-1">Report generated: {today} · Data covers the last 7 days</p>
        </div>

        {/* This week KPIs */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">This Week at a Glance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">${thisWeekTotal.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-1">Total Spend (7d)</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{thisWeekCalls.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">API Calls (7d)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{teams.length}</p>
              <p className="text-xs text-green-600 mt-1">Active Teams</p>
            </div>
          </div>
        </div>

        {/* 4-week trend chart */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">4-Week Cost Trend by Team</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pivoted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(4)}`, '']} />
              <Legend />
              {teamNames.map((name, i) => (
                <Bar key={name} dataKey={name} stackId="a" fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* This week by team */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Department Breakdown (Last 7 Days)</h3>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500">
                <th className="px-4 py-2.5 font-medium">Department</th>
                <th className="px-4 py-2.5 font-medium text-right">Calls</th>
                <th className="px-4 py-2.5 font-medium text-right">Tokens</th>
                <th className="px-4 py-2.5 font-medium text-right">Spend</th>
                <th className="px-4 py-2.5 font-medium text-right">Top Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teams.map(t => (
                <tr key={t.team_name}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{t.team_name}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{t.total_calls.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{t.total_tokens.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">${t.total_cost_usd.toFixed(4)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500 text-xs">{t.top_model ?? '—'}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2.5">TOTAL</td>
                <td className="px-4 py-2.5 text-right">{thisWeekCalls.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right">—</td>
                <td className="px-4 py-2.5 text-right">${thisWeekTotal.toFixed(4)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Budget status */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Monthly Budget Status</h3>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500">
                <th className="px-4 py-2.5 font-medium">Team</th>
                <th className="px-4 py-2.5 font-medium text-right">Budget</th>
                <th className="px-4 py-2.5 font-medium text-right">Spent</th>
                <th className="px-4 py-2.5 font-medium text-right">Remaining</th>
                <th className="px-4 py-2.5 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budgets.map(b => (
                <tr key={b.team_id}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{b.team_name}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">${b.budget_usd}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">${b.spent_usd.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">${b.remaining_usd.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-center">
                    <RagBadge status={b.rag_status} pct={b.pct_used} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 text-xs text-gray-400">
          Generated by Enterprise AI Monitor · {today} · Confidential — Internal Use Only
        </div>
      </div>
    </div>
  );
};
