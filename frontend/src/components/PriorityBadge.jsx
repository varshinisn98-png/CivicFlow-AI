import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const styles = {
    'Critical': 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    'High': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    'Medium': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    'Low': 'bg-slate-500/20 text-slate-400 border-slate-500/40',
  };

  const currentStyle = styles[priority] || 'bg-slate-500/20 text-slate-400 border-slate-500/40';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
