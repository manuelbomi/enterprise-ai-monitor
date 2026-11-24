// Budget Status — traffic-light per team for the current month
// Red teams need action NOW before they hit their limit
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBudgetStatus } from '@/services/api';
import { RagBadge } from '@/components/RagBadge';
import { AlertTriangle } from 'lucide-react';

export const BudgetStatusPage: React.FC = () => {
  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ['budget-status'],
    queryFn: getBudgetStatus,
    // Refresh every 5 minutes — budget status is live
    refetchInterval: 5 * 60 * 1000,
  });

  const red   = statuses.filter(s => s.rag_status === 'red');
  const amber = statuses.filter(s => s.rag_status === 'amber');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget Status</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Current-month budget utilisation per team · refreshes every 5 minutes
        </p>
      </div>

      {/* Alert banners */}
      {red.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">
              {red.length} team{red.length > 1 ? 's' : ''} over 90% budget used
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              {red.map(t => t.team_name).join(', ')} — consider raising their budget or restricting model access
            </p>
          </div>
        </div>
      )}
      {amber.length > 0 && red.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              {amber.length} team{amber.length > 1 ? 's' : ''} between 70–90% budget used
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {amber.map(t => t.team_name).join(', ')} — monitor closely this week
            </p>
          </div>
        </div>
      )}

      {/* Budget cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading && (
          <div className="col-span-3 p-8 text-center text-gray-400 text-sm">Loading…</div>
        )}
        {statuses.map(s => (
          <div key={s.team_id} className="bg-white rounded-xl border border-gray-200 p-5">
            {/* Team name + badge */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{s.team_name}</h3>
              <RagBadge status={s.rag_status} pct={s.pct_used} />
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full mb-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  s.rag_status === 'red' ? 'bg-red-500' :
                  s.rag_status === 'amber' ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(s.pct_used, 100)}%` }}
              />
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Spent</p>
                <p className="font-semibold text-gray-800">${s.spent_usd.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Remaining</p>
                <p className="font-semibold text-gray-800">${s.remaining_usd.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Budget</p>
                <p className="text-gray-600">${s.budget_usd}/mo</p>
              </div>
              <div>
                <p className="text-gray-400">Calls this month</p>
                <p className="text-gray-600">{s.calls_this_month.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
