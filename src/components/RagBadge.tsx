// Traffic-light budget status badge
import React from 'react';

interface Props { status: 'green' | 'amber' | 'red'; pct: number }

const cfg = {
  green: { bg: 'bg-green-100', text: 'text-green-700', label: 'On track' },
  amber: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Warning'  },
  red:   { bg: 'bg-red-100',   text: 'text-red-700',   label: 'Critical' },
};

export const RagBadge: React.FC<Props> = ({ status, pct }) => {
  const c = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'green' ? 'bg-green-500' : status === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
      {c.label} · {pct}%
    </span>
  );
};
