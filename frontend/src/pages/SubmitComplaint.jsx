import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI, departmentAPI } from '../api';
import MapPicker from '../components/MapPicker';
import { 
  Sparkles, 
  AlertTriangle, 
  MapPin, 
  Send, 
  Building2, 
  Clock, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export const SubmitComplaint = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [imageUrl, setImageUrl] = useState('');

  const [departments, setDepartments] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [duplicateMatches, setDuplicateMatches] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    departmentAPI.list().then(res => setDepartments(res.data)).catch(() => {});
  }, []);

  // Trigger AI Auto Analysis & Duplicate Check
  const handleAIAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please provide title and description before triggering AI analysis');
      return;
    }
    setError('');
    setIsAnalyzing(true);

    try {
      // 1. Analyze Category & Priority
      const resAI = await complaintAPI.analyze({ title, description });
      setAiAnalysis(resAI.data);
      setCategory(resAI.data.category);
      setPriority(resAI.data.priority);
      setLocationName(resAI.data.extracted_location || '');
      if (resAI.data.department_id) {
        setDepartmentId(resAI.data.department_id);
      }

      // 2. Check Vector Duplicates
      const resDup = await complaintAPI.checkDuplicates({
        title,
        description,
        latitude: coords.lat,
        longitude: coords.lng
      });
      setDuplicateMatches(resDup.data);
    } catch (err) {
      console.error(err);
      setError('AI service temporary error. You can still manually select options.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await complaintAPI.create({
        title,
        description,
        category: category || (aiAnalysis ? aiAnalysis.category : 'Infrastructure'),
        priority: priority || (aiAnalysis ? aiAnalysis.priority : 'Medium'),
        department_id: departmentId ? parseInt(departmentId) : null,
        location_name: locationName,
        latitude: coords.lat,
        longitude: coords.lng,
        image_url: imageUrl || null
      });

      navigate('/history');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Submit Grievance / Complaint</h1>
          <p className="text-xs text-slate-400">Describe your issue below and let CivicFlow AI auto-classify and route it</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Streetlight near Block A not working for 5 days"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details regarding location, safety risk, and duration..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* AI Trigger Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 gap-3">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-indigo-200">CivicFlow AI Engine</div>
                <div className="text-[11px] text-slate-400">Auto-detect category, urgency priority, SLA & location</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Text...' : 'Analyze with AI'}</span>
            </button>
          </div>

          {/* Duplicate Matches Alert */}
          {duplicateMatches.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential Duplicate Complaint Detected ({duplicateMatches.length} match)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Another citizen reported a similar issue recently. Submitting will link your complaint to the existing case for higher department priority.
              </p>
              <div className="space-y-2">
                {duplicateMatches.map((m) => (
                  <div key={m.complaint_id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{m.title}</span>
                      <span className="text-[10px] text-amber-400 ml-2">{(m.similarity_score * 100).toFixed(0)}% Similarity Match</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase">{m.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Result Cards */}
          {aiAnalysis && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">Category</div>
                <div className="text-xs font-bold text-indigo-400">{aiAnalysis.category}</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">Predicted Priority</div>
                <div className="text-xs font-bold text-orange-400">{aiAnalysis.priority}</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">Est. SLA Window</div>
                <div className="text-xs font-bold text-emerald-400">{aiAnalysis.sla_hours} Hours</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">Sentiment</div>
                <div className="text-xs font-bold text-purple-400">{aiAnalysis.sentiment}</div>
              </div>
            </div>
          )}

          {/* Detailed Metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select or use AI recommendation</option>
                {['Infrastructure', 'Electricity', 'Water', 'Cleanliness', 'Transport', 'Academic', 'Security', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Assigned Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-assign via AI</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Location Name</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Block A Pathway, Central Library"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Interactive Map Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Pin Point Complaint Location on Map</span>
            </label>
            <MapPicker lat={coords.lat} lng={coords.lng} onChange={(pos) => setCoords(pos)} />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Image Attachment URL (Optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Action button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'Registering Grievance...' : 'Submit Complaint'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default SubmitComplaint;
