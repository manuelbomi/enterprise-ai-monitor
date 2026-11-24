// ============================================================
// Overview — the AI Architect's morning check-in page.
// Shows total spend / calls / tokens for today, this week,
// this month, plus a 30-day cost trend line chart.
// ============================================================

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDailyCost, getTeamUsage } from '@/services/api';
import { StatCard } from '@/components/StatCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DollarSign, Zap, MessageSquare, TrendingUp } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const [days, setDays] = useState(30);

  const { data: daily = [] } = useQuery({
    queryKey: ['daily-cost', days],
    queryFn: () => getDailyCost(days),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['team-usage', days],
    queryFn: () => getTeamUsage(days),
  });

  const totalCost   = teams.reduce((s, t) => s + t.total_cost_usd, 0);
  const totalCalls  = teams.reduce((s, t) => s + t.total_calls, 0);
  const totalTokens = teams.reduce((s, t) => s + t.total_tokens, 0);
  const todayCost   = daily[daily.length - 1]?.cost_usd ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide usage summary</p>
        </div>
        {/* Period selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                days === d ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={`Total Spend (${days}d)`}  value={`$${totalCost.toFixed(2)}`}
          sub={`Today: $${todayCost.toFixed(4)}`} color="green" icon={<DollarSign className="w-4 h-4" />} />
        <StatCard label={`API Calls (${days}d)`}    value={totalCalls.toLocaleString()}
          color="blue"   icon={<MessageSquare className="w-4 h-4" />} />
        <StatCard label={`Tokens (${days}d)`}       value={`${(totalTokens / 1_000_000).toFixed(2)}M`}
          color="purple" icon={<Zap className="w-4 h-4" />} />
        <StatCard label="Active Teams"              value={String(teams.length)}
          color="amber"  icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Daily cost trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Daily Spend — Last {days} days (USD)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={daily} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={(v: number) => [`$${v.toFixed(4)}`, 'Cost']} />
            <Legend />
            <Line type="monotone" dataKey="cost_usd" name="Spend (USD)"
              stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="calls" name="API Calls" yAxisId={0}
              stroke="#a78bfa" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Team spend summary table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Team Summary</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="pb-2 font-medium">Team</th>
              <th className="pb-2 font-medium text-right">Calls</th>
              <th className="pb-2 font-medium text-right">Tokens</th>
              <th className="pb-2 font-medium text-right">Cost (USD)</th>
              <th className="pb-2 font-medium text-right">Top Model</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teams.map(t => (
              <tr key={t.team_name} className="hover:bg-gray-50">
                <td className="py-2.5 font-medium text-gray-800">{t.team_name}</td>
                <td className="py-2.5 text-right text-gray-600">{t.total_calls.toLocaleString()}</td>
                <td className="py-2.5 text-right text-gray-600">{t.total_tokens.toLocaleString()}</td>
                <td className="py-2.5 text-right font-semibold text-gray-800">${t.total_cost_usd.toFixed(4)}</td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded text-xs">{t.top_model ?? '—'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
