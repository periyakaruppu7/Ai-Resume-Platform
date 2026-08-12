import React from 'react';
import { HelpCircle, Code, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function QuestionCard({ question, currentIndex, totalQuestions, isAnswered }) {
  const getDifficultyBadge = (level) => {
    switch (level?.toUpperCase()) {
      case 'EASY':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full font-semibold">Easy</span>;
      case 'HARD':
        return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs rounded-full font-semibold">Hard</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs rounded-full font-semibold">Medium</span>;
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {isAnswered && (
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Answered
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getDifficultyBadge(question.difficulty)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0 mt-1">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 leading-relaxed">
            {question.questionText}
          </h3>
        </div>

        {question.targetSkill && (
          <div className="pl-11 flex items-center gap-2 text-xs text-slate-400">
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Skill: <strong className="text-slate-200">{question.targetSkill}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
