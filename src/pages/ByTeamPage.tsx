// Cost by Team — bar chart + table with budget-remaining indicator
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeamUsage, getBudgetStatus } from '@/services/api';
import { RagBadge } from '@/components/RagBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ByTeamPage: React.FC = () => {
  const [days, setDays] = useState(30);

  const { data: teams = [] }  = useQuery({ queryKey: ['team-usage', days], queryFn: () => getTeamUsage(days) });
  const { data: budgets = [] } = useQuery({ queryKey: ['budget-status'], queryFn: getBudgetStatus });

  // Merge spend data with budget status
  const merged = teams.map(t => {
    const b = budgets.find(b => b.team_name === t.team_name);
    return { ...t, pct_used: b?.pct_used ?? null, rag: b?.rag_status ?? null, budget: b?.budget_usd ?? null, remaining: b?.remaining_usd ?? null };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost by Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">Department spend vs. monthly budget</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {[7,30,90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${days===d?'bg-white shadow text-gray-900':'text-gray-500 hover:text-gray-700'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Spend by Department (USD)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={merged} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="team_name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={(v: number) => [`$${v.toFixed(4)}`, 'Spend']} />
            <Bar dataKey="total_cost_usd" fill="#3b82f6" radius={[4,4,0,0]} name="Cost (USD)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Team</th>
              <th className="px-5 py-3 font-medium text-right">Calls</th>
              <th className="px-5 py-3 font-medium text-right">Tokens</th>
              <th className="px-5 py-3 font-medium text-right">Spend</th>
              <th className="px-5 py-3 font-medium text-right">Budget</th>
              <th className="px-5 py-3 font-medium text-right">Remaining</th>
              <th className="px-5 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {merged.map(t => (
              <tr key={t.team_name} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{t.team_name}</td>
                <td className="px-5 py-3 text-right text-gray-600">{t.total_calls.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-gray-600">{t.total_tokens.toLocaleString()}</td>
                <td className="px-5 py-3 text-right font-semibold text-gray-800">${t.total_cost_usd.toFixed(4)}</td>
                <td className="px-5 py-3 text-right text-gray-500">{t.budget != null ? `$${t.budget}` : '—'}</td>
                <td className="px-5 py-3 text-right text-gray-500">{t.remaining != null ? `$${t.remaining.toFixed(2)}` : '—'}</td>
                <td className="px-5 py-3 text-center">
                  {t.rag && t.pct_used != null
                    ? <RagBadge status={t.rag as 'green'|'amber'|'red'} pct={t.pct_used} />
                    : <span className="text-gray-400 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
