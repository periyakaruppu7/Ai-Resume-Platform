import React from 'react';
import { Lightbulb, CheckSquare, Sparkles } from 'lucide-react';

export default function AtsRecommendationsCard({ recommendations = [], fixes = [] }) {
  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> Actionable ATS Recommendations
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          AI-generated steps to optimize your resume for automated applicant tracking systems
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General ATS Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" /> Optimization Tips
          </div>
          <ul className="space-y-2.5">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 font-semibold text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
            {recommendations.length === 0 && (
              <p className="text-xs text-slate-500">No specific optimization tips required.</p>
            )}
          </ul>
        </div>

        {/* Targeted Resume Fixes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" /> Recommended Bullet Fixes
          </div>
          <ul className="space-y-2.5">
            {fixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-semibold text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{fix}</span>
              </li>
            ))}
            {fixes.length === 0 && (
              <p className="text-xs text-slate-500">No bullet point fixes recommended.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
