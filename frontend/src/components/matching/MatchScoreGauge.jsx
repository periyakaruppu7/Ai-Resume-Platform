import React from 'react';
import { Target, Zap } from 'lucide-react';

export default function MatchScoreGauge({ score = 0 }) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = 440 - (440 * normalizedScore) / 100;

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (val >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getGrade = (val) => {
    if (val >= 85) return 'Excellent Match';
    if (val >= 70) return 'Good Match';
    if (val >= 50) return 'Moderate Match';
    return 'Low Match';
  };

  return (
    <div className="glass-card p-6 rounded-3xl text-center flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Target className="w-4 h-4 text-blue-400" /> ATS Compatibility
      </div>

      <div className="relative w-44 h-44 my-4 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-slate-800 fill-none"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(normalizedScore)}`}
            strokeWidth="12"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(normalizedScore).split(' ')[0]}`}>
            {normalizedScore}%
          </span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">Match Score</span>
        </div>
      </div>

      <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-semibold text-slate-300">
        <Zap className="w-3.5 h-3.5 text-amber-400" /> {getGrade(normalizedScore)}
      </div>
    </div>
  );
}
