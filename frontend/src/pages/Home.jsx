import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  FilePlus, 
  History, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Wrench, 
  Droplet, 
  Trash2, 
  Bus, 
  Star,
  Users
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      
      {/* Hero Banner */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Smart Grievance & Complaint Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Report Community & Campus Issues. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Get Faster Resolutions.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Submit your grievances online in seconds. Our smart portal automatically assigns your issue to the correct department and keeps you updated every step of the way.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/submit"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2.5"
            >
              <FilePlus className="w-5 h-5" />
              <span>Submit a Complaint</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/history"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all flex items-center justify-center space-x-2.5"
            >
              <History className="w-5 h-5 text-indigo-400" />
              <span>Track My Complaints</span>
            </Link>
          </div>

          {/* User Benefits Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white">Instant Routing</div>
              <div className="text-xs text-slate-400 mt-0.5">Sent directly to official teams</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <MapPin className="w-5 h-5 text-rose-400 mb-2" />
              <div className="text-sm font-bold text-white">Map Location Pin</div>
              <div className="text-xs text-slate-400 mt-0.5">Exact location targeting</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <Clock className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-sm font-bold text-white">Guaranteed SLA</div>
              <div className="text-xs text-slate-400 mt-0.5">Track resolution deadlines</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <Star className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Citizen Ratings</div>
              <div className="text-xs text-slate-400 mt-0.5">Rate work upon resolution</div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (Simple 4-Step Process) */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Easy Workflow</span>
            <h2 className="text-3xl font-extrabold text-white">How CivicFlow Works in 4 Simple Steps</h2>
            <p className="text-sm text-slate-400">From filing a request to final resolution feedback</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="text-base font-bold text-white">Submit Complaint</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe the problem, attach a photo, and mark the location on an interactive map.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="text-base font-bold text-white">Auto Department Routing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The portal automatically identifies the issue category and forwards it to the right department.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="text-base font-bold text-white">Track Live Status</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch status progress from Pending to In Progress with official staff notes and SLA countdowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-base">
                4
              </div>
              <h3 className="text-base font-bold text-white">Resolution & Rating</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once resolved by maintenance officers, inspect the work and give a 1-5 star rating.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Public Complaint Categories */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Supported Services</span>
            <h2 className="text-3xl font-extrabold text-white">What Can You Report?</h2>
            <p className="text-sm text-slate-400">Covers all major community & campus infrastructure needs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Electricity & Lighting</h3>
              <p className="text-xs text-slate-400">Streetlight blackouts, broken light poles, exposed wiring, transformer issues.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Roads & Infrastructure</h3>
              <p className="text-xs text-slate-400">Dangerous potholes, damaged sidewalks, broken benches, building repairs.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Water & Plumbing</h3>
              <p className="text-xs text-slate-400">Pipe bursts, tap leaks, sewage overflow, drinking water supply disruptions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Cleanliness & Waste</h3>
              <p className="text-xs text-slate-400">Overflowing garbage bins, uncollected trash, unhygienic public areas.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Bus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Transport & Parking</h3>
              <p className="text-xs text-slate-400">Illegal parking blocking pathways, shuttle bus delays, traffic safety.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Security & Safety</h3>
              <p className="text-xs text-slate-400">Malfunctioning CCTV cameras, unlit dark spots, campus security concerns.</p>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Have an Issue to Report in Your Area?</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Submit a grievance now. It takes less than a minute and helps keep our community safe and well-maintained.
          </p>
          <div className="pt-2">
            <Link
              to="/submit"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all"
            >
              <FilePlus className="w-5 h-5" />
              <span>File Your Complaint Now</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
