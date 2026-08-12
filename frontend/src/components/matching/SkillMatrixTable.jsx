import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Layers } from 'lucide-react';

export default function SkillMatrixTable({ matchedSkills = [], partialSkills = [], missingSkills = [] }) {
  const [activeTab, setActiveTab] = useState('ALL');

  const totalSkills = matchedSkills.length + partialSkills.length + missingSkills.length;

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" /> Skill Coverage Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed evaluation of required skills vs. resume evidence ({totalSkills} Total Evaluated)
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'ALL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All ({totalSkills})
          </button>
          <button
            onClick={() => setActiveTab('MATCHED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'MATCHED' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Matched ({matchedSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('PARTIAL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'PARTIAL' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Partial ({partialSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('MISSING')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'MISSING' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Missing ({missingSkills.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Matched Section */}
        {(activeTab === 'ALL' || activeTab === 'MATCHED') && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Fully Matched ({matchedSkills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs rounded-lg font-medium">
                  {skill}
                </span>
              ))}
              {matchedSkills.length === 0 && <span className="text-xs text-slate-500">None detected</span>}
            </div>
          </div>
        )}

        {/* Partial Section */}
        {(activeTab === 'ALL' || activeTab === 'PARTIAL') && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Partially Matched ({partialSkills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {partialSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs rounded-lg font-medium">
                  {skill}
                </span>
              ))}
              {partialSkills.length === 0 && <span className="text-xs text-slate-500">None detected</span>}
            </div>
          </div>
        )}

        {/* Missing Section */}
        {(activeTab === 'ALL' || activeTab === 'MISSING') && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <XCircle className="w-4 h-4" /> Missing Key Skills ({missingSkills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs rounded-lg font-medium">
                  {skill}
                </span>
              ))}
              {missingSkills.length === 0 && <span className="text-xs text-slate-500">None detected</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
