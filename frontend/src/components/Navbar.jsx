import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, FileText, UserCheck, HelpCircle, Layers, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            ResuAI Matcher
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
              <Link to="/dashboard" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/matching" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Matcher
              </Link>
              <Link to="/interviews" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> AI Interviewer
              </Link>
              <Link to="/rag" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" /> RAG Guides
              </Link>
              <Link to="/resumes" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Resumes
              </Link>
            </nav>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-100">{user.fullName}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/25 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
