import React, { useEffect, useState } from 'react';
import { interviewApi, matchApi, resumeApi, jobDescriptionApi } from '../services/api';
import QuestionCard from '../components/interview/QuestionCard';
import EvaluationCard from '../components/interview/EvaluationCard';
import { MessageSquare, Play, Send, Loader2, Award, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Plus } from 'lucide-react';

export default function InterviewPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answerInput, setAnswerInput] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [error, setError] = useState('');

  // Applications list to link session
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');

  useEffect(() => {
    loadSessionsAndApps();
  }, []);

  const loadSessionsAndApps = async () => {
    try {
      const sessionsRes = await interviewApi.getSessions();
      if (sessionsRes.data) {
        setSessions(sessionsRes.data);
        if (sessionsRes.data.length > 0) {
          setActiveSession(sessionsRes.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load interview sessions', err);
    }

    try {
      const appsRes = await matchApi.getApplications();
      if (appsRes.data) {
        setApplications(appsRes.data);
        if (appsRes.data.length > 0) {
          setSelectedAppId(appsRes.data[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    }
  };

  const handleStartNewSession = async () => {
    setCreatingSession(true);
    setError('');
    try {
      const appId = selectedAppId && !isNaN(parseInt(selectedAppId)) ? parseInt(selectedAppId) : null;
      const response = await interviewApi.createSession({
        applicationId: appId,
      });
      setSessions([response.data, ...sessions]);
      setActiveSession(response.data);
      setCurrentQuestionIndex(0);
      setAnswerInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview session.');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleSubmitAnswer = async () => {
    const currentQ = activeSession?.questions?.[currentQuestionIndex];
    if (!currentQ || !answerInput.trim()) return;

    setSubmittingAnswer(true);
    setError('');
    try {
      const response = await interviewApi.submitAnswer({
        questionId: currentQ.id,
        answerText: answerInput,
      });

      // Update question in active session
      const updatedQuestions = activeSession.questions.map((q) =>
        q.id === response.data.id ? response.data : q
      );

      setActiveSession({
        ...activeSession,
        questions: updatedQuestions,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const currentQ = activeSession?.questions?.[currentQuestionIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive AI Interviewer
          </div>
          <h1 className="text-3xl font-extrabold text-white">Technical Interview Simulator</h1>
          <p className="text-slate-400 text-sm mt-1">
            Practice 5 tailored technical questions based on your resume background & missing skills with automated scoring.
          </p>
        </div>

        {/* Start New Session Controls */}
        <div className="flex items-center gap-3">
          {applications.length > 0 && (
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id.toString()}>
                  Target: {app.jobTitle} ({Math.round(app.matchScore)}% Match)
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleStartNewSession}
            disabled={creatingSession}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {creatingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>New Practice Session</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sessions Sidebar */}
        <div className="lg:col-span-1 glass-card p-5 rounded-3xl border border-slate-800 space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" /> Practice Sessions ({sessions.length})
          </h3>

          <div className="space-y-2">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSession(s);
                  setCurrentQuestionIndex(0);
                  setAnswerInput('');
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all text-xs space-y-1 ${
                  activeSession?.id === s.id
                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                    : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300'
                }`}
              >
                <div className="font-semibold truncate">{s.sessionTitle}</div>
                <div className="text-[10px] text-slate-400">
                  {new Date(s.createdAt).toLocaleDateString()} • {s.questions?.length || 0} Questions
                </div>
              </button>
            ))}
            {sessions.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No practice sessions created yet.</p>
            )}
          </div>
        </div>

        {/* Question & Answer Working Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeSession && activeSession.questions?.length > 0 ? (
            <>
              {/* Question Navigation Stepper */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {activeSession.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setAnswerInput(q.userAnswer || '');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                      currentQuestionIndex === idx
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : q.userAnswer
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {q.userAnswer && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>

              {/* Active Question Display */}
              {currentQ && (
                <QuestionCard
                  question={currentQ}
                  currentIndex={currentQuestionIndex}
                  totalQuestions={activeSession.questions.length}
                  isAnswered={!!currentQ.userAnswer}
                />
              )}

              {/* Answer Input Area */}
              {currentQ && (
                <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Your Technical Answer
                  </label>
                  <textarea
                    rows={6}
                    value={answerInput || currentQ.userAnswer || ''}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Type your structured technical explanation here... Mention concepts, architectural trade-offs, and practical implementations."
                    className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Word Count: {(answerInput || currentQ.userAnswer || '').trim().split(/\s+/).filter(Boolean).length}
                    </span>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submittingAnswer || !answerInput.trim()}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
                    >
                      {submittingAnswer ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Evaluating with Spring AI...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* AI Real-Time Evaluation Display */}
              {currentQ && currentQ.correctnessScore != null && (
                <EvaluationCard evaluation={currentQ} />
              )}
            </>
          ) : (
            <div className="glass-card p-12 rounded-3xl text-center space-y-3">
              <Sparkles className="w-10 h-10 mx-auto text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-200">No Active Interview Session Selected</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click "New Practice Session" above to generate 5 tailored technical interview questions based on your resume and missing job skills.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
