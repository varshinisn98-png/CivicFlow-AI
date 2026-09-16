import React, { useState, useEffect } from 'react';
import { adminAPI, complaintAPI } from '../api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import HeatmapView from '../components/HeatmapView';
import AIResponseModal from '../components/AIResponseModal';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  LayoutDashboard, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Sparkles, 
  Filter, 
  TrendingUp, 
  Users, 
  Building2,
  FileText
} from 'lucide-react';

const COLORS = ['#6366f1', '#f97316', '#06b6d4', '#10b981', '#a855f7', '#ec4899', '#eab308'];

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, heatmap, clusters, queue
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resMetrics, resAnalytics, resHeatmap, resClusters, resComplaints] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getAnalytics(),
        adminAPI.getHeatmap(),
        adminAPI.getDuplicateClusters(),
        complaintAPI.list({})
      ]);

      setMetrics(resMetrics.data);
      setAnalytics(resAnalytics.data);
      setHeatmapPoints(resHeatmap.data);
      setClusters(resClusters.data);
      setComplaints(resComplaints.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (updateData) => {
    if (!selectedComplaint) return;
    try {
      await complaintAPI.updateStatus(selectedComplaint.id, updateData);
      setSelectedComplaint(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">SaaS Admin & Department Portal</h1>
            <p className="text-xs text-slate-400">Real-time complaint telemetry, AI cluster resolution & geospatial analytics</p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-2 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* 5 Metric SaaS Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Complaints</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics ? metrics.total_complaints : 0}</div>
          <div className="text-[11px] text-slate-500">System Lifetime Volume</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{metrics ? metrics.pending_complaints : 0}</div>
          <div className="text-[11px] text-slate-500">Awaiting Assignment</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">In Progress</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400">{metrics ? metrics.in_progress_complaints : 0}</div>
          <div className="text-[11px] text-slate-500">Active Field Repair</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{metrics ? metrics.resolved_complaints : 0}</div>
          <div className="text-[11px] text-slate-500">Successfully Fixed</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">SLA Breached</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{metrics ? metrics.sla_breached_complaints : 0}</div>
          <div className="text-[11px] text-slate-500">Exceeded SLA Hours</div>
        </div>

      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab('heatmap')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'heatmap' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Geospatial Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'clusters' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>AI Duplicate Clusters ({clusters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'queue' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Resolution Queue ({complaints.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview & Recharts */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bar Chart - Category Breakdown */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Complaints by Category</h3>
                <span className="text-xs text-slate-400">Department Volume</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categories}>
                    <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Priorities */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">Priority Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.priorities}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ priority, count }) => `${priority}: ${count}`}
                    >
                      {analytics.priorities.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Area Chart - Weekly Trend */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Weekly Complaint & Resolution Velocity</h3>
              <div className="text-xs text-emerald-400 font-semibold">
                Avg Resolution Time: {analytics.avg_resolution_hours} Hours
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trends}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} name="Total Received" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Geospatial Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Interactive Leaflet Geocoded Complaint Markers & Heat Intensity</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> <span>Critical</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> <span>High</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span> <span>Medium</span></span>
            </div>
          </div>
          <HeatmapView points={heatmapPoints} />
        </div>
      )}

      {/* Tab 3: AI Duplicate Clusters */}
      {activeTab === 'clusters' && (
        <div className="space-y-4">
          {clusters.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-xs text-slate-400">
              No duplicate complaint clusters currently detected.
            </div>
          ) : (
            clusters.map((cluster, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
                      Cluster of {cluster.cluster_size} Complaints
                    </span>
                    <h3 className="text-sm font-bold text-white">{cluster.parent_title}</h3>
                  </div>
                </div>

                {/* AI Cluster Executive Summary */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-1">AI Executive Summary</div>
                    <p>{cluster.ai_summary}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grouped Submissions</div>
                  {cluster.complaints.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">#CF-{c.id}: {c.title}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">📍 {c.location_name} • {c.created_at}</div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Resolution Queue */}
      {activeTab === 'queue' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">All System Complaints</h3>
            <span className="text-xs text-slate-400">{complaints.length} Total Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Department</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-400">#CF-{c.id}</td>
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-white truncate">{c.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">📍 {c.location_name || 'Location'}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{c.category}</td>
                    <td className="p-4"><PriorityBadge priority={c.priority} /></td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-slate-300">{c.department_name || 'Unassigned'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Response Generator & Status Update Modal */}
      <AIResponseModal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        complaint={selectedComplaint}
        onSave={handleUpdateStatus}
      />

    </div>
  );
};

export default AdminDashboard;
