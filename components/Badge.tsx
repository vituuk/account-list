import React from 'react';
import { AccountStatus } from '../types';

interface BadgeProps {
  status: AccountStatus;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  let colorClass = '';
  
  switch (status) {
    case AccountStatus.Active:
      colorClass = 'bg-green-500';
      break;
    case AccountStatus.Checkpoint:
      colorClass = 'bg-orange-500';
      break;
    case AccountStatus.Locked:
      colorClass = 'bg-slate-500';
      break;
    case AccountStatus.Disabled:
      colorClass = 'bg-red-500';
      break;
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${colorClass} ring-2 ring-white shadow-sm`}></span>
      <span className="text-sm font-medium text-slate-700">{status}</span>
    </div>
  );
};

export const SuggestionBadge: React.FC<{ hasSuggestion: boolean }> = ({ hasSuggestion }) => {
  if (hasSuggestion) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        YES
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
      NO
    </span>
  );
};
