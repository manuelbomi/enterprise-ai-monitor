// Cost by User — ranked table of top spenders
// Surfaces runaway usage before budgets are exhausted
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserUsage } from '@/services/api';

export const ByUserPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['user-usage', days],
    queryFn: () => getUserUsage(days, 50),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost by User</h1>
          <p className="text-sm text-gray-500 mt-0.5">Top 50 users ranked by spend — catch runaway usage early</p>
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Team</th>
                <th className="px-5 py-3 font-medium text-right">Calls</th>
                <th className="px-5 py-3 font-medium text-right">Tokens</th>
                <th className="px-5 py-3 font-medium text-right">Spend (USD)</th>
                <th className="px-5 py-3 font-medium text-right">Avg Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u, i) => (
                <tr key={u.email} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{u.full_name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{u.team_name}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{u.total_calls.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{u.total_tokens.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">${u.total_cost_usd.toFixed(4)}</td>
                  <td className="px-5 py-3 text-right text-gray-500">{u.avg_latency_ms}ms</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No data for this period</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
