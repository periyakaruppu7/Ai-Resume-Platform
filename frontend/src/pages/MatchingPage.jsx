import React, { useEffect, useState } from 'react';
import { resumeApi, jobDescriptionApi, matchApi } from '../services/api';
import MatchScoreGauge from '../components/matching/MatchScoreGauge';
import SkillMatrixTable from '../components/matching/SkillMatrixTable';
import AtsRecommendationsCard from '../components/matching/AtsRecommendationsCard';
import { Sparkles, FileText, Briefcase, Play, Loader2, AlertCircle, Plus } from 'lucide-react';

export default function MatchingPage() {
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);

  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJdId, setSelectedJdId] = useState('');

  // New JD state
  const [newJdTitle, setNewJdTitle] = useState('');
  const [newJdCompany, setNewJdCompany] = useState('');
  const [newJdRawText, setNewJdRawText] = useState('');
  const [showAddJd, setShowAddJd] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resumesRes = await resumeApi.getResumes();
      if (resumesRes.data) {
        setResumes(resumesRes.data);
        if (resumesRes.data.length > 0) {
          setSelectedResumeId(resumesRes.data[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to load candidate resumes', err);
    }

    try {
      const jdsRes = await jobDescriptionApi.getAll();
      if (jdsRes.data) {
        setJobDescriptions(jdsRes.data);
        if (jdsRes.data.length > 0) {
          setSelectedJdId(jdsRes.data[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to load job descriptions', err);
    }
  };

  const handleCreateJd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await jobDescriptionApi.create({
        title: newJdTitle,
        companyName: newJdCompany,
        rawText: newJdRawText,
      });
      setJobDescriptions([response.data, ...jobDescriptions]);
      setSelectedJdId(response.data.id.toString());
      setShowAddJd(false);
      setNewJdTitle('');
      setNewJdCompany('');
      setNewJdRawText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job description.');
    }
  };

  const handleRunMatch = async () => {
    if (!selectedResumeId || !selectedJdId) {
      setError('Please select both a resume and a job description.');
      return;
    }

    setAnalyzing(true);
    setError('');
    try {
      const response = await matchApi.analyze({
        resumeId: parseInt(selectedResumeId),
        jobDescriptionId: parseInt(selectedJdId),
      });

      // Parse JSON payload inside application response
      let parsedSkillAnalysis = {};
      try {
        parsedSkillAnalysis = JSON.parse(response.data.skillAnalysis || '{}');
      } catch (e) {
        console.error("Error parsing skill analysis JSON", e);
      }

      setAnalysisResult({
        ...response.data,
        parsedSkillAnalysis,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'AI Match calculation failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const parsedAnalysis = analysisResult?.parsedSkillAnalysis || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Spring AI Analytics Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Resume & Job Matching</h1>
          <p className="text-slate-400 text-sm mt-1">
            Compare candidate resumes against job descriptions to extract skill coverage matrices & ATS match scores.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Panel: Resume & Job Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select Resume */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">1. Select Candidate Resume</h3>
              <p className="text-xs text-slate-400">Choose from parsed PDF resumes</p>
            </div>
          </div>

          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id.toString()}>
                {r.fileName} (Uploaded {new Date(r.createdAt).toLocaleDateString()})
              </option>
            ))}
            {resumes.length === 0 && <option value="">No resumes available - Upload on Dashboard</option>}
          </select>
        </div>

        {/* Select Target Job Description */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">2. Select Job Description</h3>
                <p className="text-xs text-slate-400">Choose or paste a target JD</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddJd(!showAddJd)}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30 flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add New JD
            </button>
          </div>

          <select
            value={selectedJdId}
            onChange={(e) => setSelectedJdId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          >
            {jobDescriptions.map((jd) => (
              <option key={jd.id} value={jd.id.toString()}>
                {jd.title} {jd.companyName ? `(${jd.companyName})` : ''}
              </option>
            ))}
            {jobDescriptions.length === 0 && <option value="">No Job Descriptions added yet</option>}
          </select>
        </div>
      </div>

      {/* Add New JD Form Modal/Card */}
      {showAddJd && (
        <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-4 bg-indigo-950/20">
          <h3 className="font-bold text-slate-100 text-base">Paste Target Job Posting</h3>
          <form onSubmit={handleCreateJd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Job Title (e.g. Senior Java Full Stack Engineer)"
                value={newJdTitle}
                onChange={(e) => setNewJdTitle(e.target.value)}
                className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none text-slate-100"
              />
              <input
                type="text"
                placeholder="Company Name (e.g. Google / Microsoft)"
                value={newJdCompany}
                onChange={(e) => setNewJdCompany(e.target.value)}
                className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none text-slate-100"
              />
            </div>
            <textarea
              required
              rows={5}
              placeholder="Paste raw Job Description text here including required skills, qualifications, and experience level..."
              value={newJdRawText}
              onChange={(e) => setNewJdRawText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none text-slate-100"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddJd(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg"
              >
                Save & Extract Skills
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleRunMatch}
          disabled={analyzing || !selectedResumeId || !selectedJdId}
          className="py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 mx-auto transition-all disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Skill Matrix with Spring AI...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> Run AI Match Analytics
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <MatchScoreGauge score={analysisResult.matchScore} />
            </div>
            <div className="lg:col-span-2">
              <SkillMatrixTable
                matchedSkills={parsedAnalysis.matchedSkills || []}
                partialSkills={parsedAnalysis.partialSkills || []}
                missingSkills={parsedAnalysis.missingSkills || []}
              />
            </div>
          </div>

          <AtsRecommendationsCard
            recommendations={parsedAnalysis.atsRecommendations || []}
            fixes={parsedAnalysis.resumeFixes || []}
          />
        </div>
      )}
    </div>
  );
}
