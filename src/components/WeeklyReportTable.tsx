// Reusable styled table component for weekly summary data
import React from 'react';
import { RagBadge } from './RagBadge';
import type { WeeklySummaryRow } from '@/types';

interface Props {
  rows: WeeklySummaryRow[];
}

export const WeeklyReportTable: React.FC<Props> = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
        No weekly data available yet
      </div>
    );
  }

  // Group rows by team for a compact view
  const teams = [...new Set(rows.map(r => r.team_name))];
  const weeks = [...new Set(rows.map(r => r.week_start))].sort();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
            <th className="px-5 py-3 font-medium">Team</th>
            {weeks.map(w => (
              <th key={w} className="px-4 py-3 font-medium text-right text-xs">
                Week of {w.slice(5)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {teams.map(team => (
            <tr key={team} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium text-gray-800">{team}</td>
              {weeks.map(w => {
                const row = rows.find(r => r.team_name === team && r.week_start === w);
                return (
                  <td key={w} className="px-4 py-3 text-right">
                    {row ? (
                      <div>
                        <span className="font-semibold text-gray-800">${row.cost_usd.toFixed(2)}</span>
                        <span className="text-gray-400 text-xs ml-1">({row.calls} calls)</span>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
