import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <span className="text-lg font-bold text-white">CivicFlow AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Smart Grievance & Complaint Management System. Empowering citizens and departments with automated routing, SLA deadline tracking, and resolution feedback.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Key Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> <span>Automated Department Routing</span></li>
              <li className="flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5 text-purple-400" /> <span>Target SLA Window Tracking</span></li>
              <li className="flex items-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> <span>Citizen Resolution Ratings</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Departments</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Electrical & Maintenance</li>
              <li>Civil & Infrastructure</li>
              <li>Water & Sanitation</li>
              <li>Academic & IT Tech</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CivicFlow AI. Smart Grievance Management System.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>Fast Resolution</span>
            <span>•</span>
            <span>Live Status Tracking</span>
            <span>•</span>
            <span>Citizen Ratings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
