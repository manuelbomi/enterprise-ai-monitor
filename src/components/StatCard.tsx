// KPI tile — large number, label, optional sub-label
import React from 'react';

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: 'blue' | 'green' | 'purple' | 'amber';
  icon?: React.ReactNode;
}

const colorMap = {
  blue:   'border-t-brand-500',
  green:  'border-t-green-500',
  purple: 'border-t-purple-500',
  amber:  'border-t-amber-500',
};

export const StatCard: React.FC<Props> = ({ label, value, sub, color = 'blue', icon }) => (
  <div className={`bg-white rounded-xl border border-gray-200 border-t-4 ${colorMap[color]} p-5 shadow-sm`}>
    <div className="flex items-start justify-between mb-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      {icon && <span className="text-gray-400">{icon}</span>}
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);
