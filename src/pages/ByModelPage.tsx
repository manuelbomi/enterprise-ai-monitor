// Cost by Model — which LLM costs the most and is called most
// Informs decisions about restricting expensive models per team
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getModelUsage } from '@/services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];

export const ByModelPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data: models = [], isLoading } = useQuery({
    queryKey: ['model-usage', days],
    queryFn: () => getModelUsage(days),
  });

  const totalCost = models.reduce((s, m) => s + m.total_cost_usd, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost by Model</h1>
          <p className="text-sm text-gray-500 mt-0.5">Which LLMs are being used and what they cost</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Cost Share by Model</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={models} dataKey="total_cost_usd" nameKey="model_alias"
                cx="50%" cy="50%" outerRadius={90} label={({ model_alias, percent }) =>
                  `${model_alias} ${(percent*100).toFixed(0)}%`}>
                {models.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toFixed(4)}`, 'Cost']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary cards */}
        <div className="space-y-3">
          {models.map((m, i) => (
            <div key={m.model_alias} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="font-semibold text-gray-800 text-sm">{m.model_alias}</span>
                </div>
                <span className="font-bold text-gray-900">${m.total_cost_usd.toFixed(4)}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{m.call_count.toLocaleString()} calls</span>
                <span>{m.total_tokens.toLocaleString()} tokens</span>
                <span>{m.avg_latency_ms}ms avg</span>
                <span className="text-gray-400 text-xs">{totalCost > 0 ? ((m.total_cost_usd/totalCost)*100).toFixed(1) : 0}% of total</span>
              </div>
              {/* Cost proportion bar */}
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
                <div className="h-1.5 rounded-full" style={{
                  width: `${totalCost > 0 ? (m.total_cost_usd/totalCost)*100 : 0}%`,
                  background: COLORS[i % COLORS.length],
                }} />
              </div>
            </div>
          ))}
          {!isLoading && models.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No model usage data for this period
            </div>
          )}
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Model Alias</th>
              <th className="px-5 py-3 font-medium">Provider Model</th>
              <th className="px-5 py-3 font-medium text-right">Calls</th>
              <th className="px-5 py-3 font-medium text-right">Prompt Tokens</th>
              <th className="px-5 py-3 font-medium text-right">Completion Tokens</th>
              <th className="px-5 py-3 font-medium text-right">Avg Latency</th>
              <th className="px-5 py-3 font-medium text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {models.map(m => (
              <tr key={m.model_alias} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{m.model_alias}</td>
                <td className="px-5 py-3 text-xs text-gray-400 font-mono">{m.model_actual}</td>
                <td className="px-5 py-3 text-right text-gray-600">{m.call_count.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-gray-600">{m.prompt_tokens.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-gray-600">{m.completion_tokens.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-gray-500">{m.avg_latency_ms}ms</td>
                <td className="px-5 py-3 text-right font-semibold text-gray-800">${m.total_cost_usd.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
