import React from 'react';
import { Award, AlertOctagon, CheckCircle2, MessageSquareText } from 'lucide-react';

export default function EvaluationCard({ evaluation }) {
  if (!evaluation || evaluation.correctnessScore == null) return null;

  const correctness = evaluation.correctnessScore;
  const clarity = evaluation.clarityScore;
  const missing = evaluation.missingConcepts || [];

  return (
    <div className="glass-card p-6 rounded-3xl border border-indigo-500/20 space-y-6 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/20">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h4 className="font-bold text-slate-100 flex items-center gap-2 text-base">
          <Award className="w-5 h-5 text-amber-400" /> Real-Time AI Answer Evaluation
        </h4>
        <span className="text-xs font-medium text-slate-400">Spring AI Output Parser</span>
      </div>

      {/* Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Technical Correctness</span>
            <span className="text-emerald-400 font-bold text-sm">{correctness}/100</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${correctness}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Relevance & Clarity</span>
            <span className="text-blue-400 font-bold text-sm">{clarity}/100</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-700"
              style={{ width: `${clarity}%` }}
            />
          </div>
        </div>
      </div>

      {/* Missing Concepts Chips */}
      {missing.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" /> Missing Key Concepts
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((concept, idx) => (
              <span key={idx} className="px-3 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs rounded-lg font-medium">
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Constructive Feedback */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquareText className="w-4 h-4" /> AI Feedback
        </div>
        <p className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
          {evaluation.feedback}
        </p>
      </div>

      {/* Ideal Response */}
      {evaluation.idealResponse && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Ideal Model Response
          </div>
          <p className="text-xs text-slate-300 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20 leading-relaxed italic">
            "{evaluation.idealResponse}"
          </p>
        </div>
      )}
    </div>
  );
}
