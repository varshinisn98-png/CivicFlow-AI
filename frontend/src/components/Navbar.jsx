import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../api';
import { 
  Building2, 
  FilePlus, 
  History, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Bell, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      notificationAPI.list().then(res => setNotifications(res.data)).catch(() => {});
    }
  }, [user, location.pathname]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = (id) => {
    notificationAPI.markRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                CivicFlow <span className="text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider font-medium uppercase">
                Smart Grievance OS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/submit"
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/submit') ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </Link>

                <Link
                  to="/history"
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/history') ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>My Complaints</span>
                </Link>

                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'text-purple-400 bg-purple-500/10 border border-purple-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth Bar */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900"></span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Notifications</span>
                        <span className="text-xs text-indigo-400 font-semibold">{unreadCount} new</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkRead(n.id)}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-700/50 transition-colors ${
                                !n.is_read ? 'bg-indigo-500/5 font-medium text-slate-200' : 'text-slate-400'
                              }`}
                            >
                              <p className="line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                    {user.full_name[0]}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-slate-200">{user.full_name}</div>
                    <div className="text-[10px] text-indigo-400 capitalize">{user.role}</div>
                  </div>
                </div>

                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
