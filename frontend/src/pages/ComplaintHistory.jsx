import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI, feedbackAPI } from '../api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  History, 
  Clock, 
  MapPin, 
  Building2, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Rating modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchComplaints = () => {
    setLoading(true);
    complaintAPI.list({ my_only: true })
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSubmittingFeedback(true);
    try {
      await feedbackAPI.submit(selectedComplaint.id, { rating, comments });
      setSelectedComplaint(null);
      setComments('');
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const filtered = complaints.filter(c => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Complaint History</h1>
            <p className="text-xs text-slate-400">Track resolution progress, updates, and SLA windows</p>
          </div>
        </div>

        <Link
          to="/submit"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <span>+ Submit New Complaint</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {['ALL', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab === 'ALL' ? 'All Complaints' : tab}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading complaint records...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <History className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-slate-300">No Complaints Found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't submitted any complaints matching this filter yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-indigo-400 font-bold">#CF-{c.id}</span>
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                  {c.is_duplicate && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Linked Duplicate
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Submitted {new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">{c.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{c.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center space-x-1 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{c.department_name || 'General Maintenance'}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.location_name || 'Campus Location'}</span>
                </div>

                <div className="flex items-center space-x-1 text-purple-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {c.sla_hours} Hours</span>
                </div>

                {/* Feedback button if resolved */}
                {c.status === 'Resolved' && (
                  <div className="ml-auto">
                    {c.feedback ? (
                      <div className="flex items-center space-x-1 text-amber-400 font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>Rating: {c.feedback.rating}/5</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Give Feedback</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Status Update History Stepper */}
              {c.updates && c.updates.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Latest Update Log</div>
                  <div className="text-xs text-slate-300 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-200">{c.updates[0].update_text}</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        By {c.updates[0].updated_by_name} • {new Date(c.updates[0].created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Feedback Submission Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Rate Complaint Resolution</h3>
            <p className="text-xs text-slate-400">
              How satisfied are you with the resolution of "{selectedComplaint.title}"?
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${rating >= star ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Comments (Optional)</label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share feedback for the department..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Submit Rating
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ComplaintHistory;
