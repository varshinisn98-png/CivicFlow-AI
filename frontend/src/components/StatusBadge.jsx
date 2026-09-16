import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'In Progress': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Resolved': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Rejected': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  const currentStyle = styles[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
