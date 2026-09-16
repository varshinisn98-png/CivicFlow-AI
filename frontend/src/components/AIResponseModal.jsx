import React, { useState } from 'react';
import { Sparkles, Check, X, Send } from 'lucide-react';

export const AIResponseModal = ({ isOpen, onClose, complaint, onSave }) => {
  if (!isOpen || !complaint) return null;

  const [status, setStatus] = useState(complaint.status);
  const [updateText, setUpdateText] = useState('');
  const [sendAI, setSendAI] = useState(true);

  const defaultMsg = (st) => {
    const dept = complaint.department_name || 'Maintenance';
    if (st === 'In Progress') {
      return `Dear Citizen, your complaint regarding '${complaint.title}' has been successfully assigned to the ${dept} Department. A maintenance officer has been dispatched to investigate and resolve the issue. Expected resolution within SLA timeframe.`;
    } else if (st === 'Resolved') {
      return `Good news! Your complaint regarding '${complaint.title}' has been resolved by the ${dept} Department. Please inspect the resolution and share your feedback rating on your dashboard.`;
    } else if (st === 'Rejected') {
      return `Thank you for reaching out. Upon technical inspection by the ${dept} Department, this submission was determined to fall outside current department purview or is a duplicate case.`;
    }
    return '';
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setUpdateText(defaultMsg(newStatus));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      status,
      update_text: updateText || defaultMsg(status),
      send_ai_response: sendAI
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Update Status & Draft Response</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Target Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    status === s
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Official Response / Citizen Notification
              </label>
              <button
                type="button"
                onClick={() => setUpdateText(defaultMsg(status))}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Regenerate AI Response</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Enter message for citizen or click Regenerate AI Response..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendAI"
              checked={sendAI}
              onChange={(e) => setSendAI(e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
            />
            <label htmlFor="sendAI" className="text-xs text-slate-300">
              Notify citizen with update message & SLA timestamp
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AIResponseModal;
