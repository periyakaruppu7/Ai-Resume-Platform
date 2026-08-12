import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploader from '../components/FileUploader';
import { resumeApi } from '../services/api';
import { FileText, Sparkles, CheckCircle, BrainCircuit, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const response = await resumeApi.getResumes();
      setResumes(response.data);
    } catch (err) {
      console.error('Failed to load user resumes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl relative overflow-hidden border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI Engine Ready
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome, {user?.fullName || 'Candidate'}!
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Upload your master resume PDF to parse skills, evaluate job description compatibility, generate AI interview questions, and query company interview guides.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1">
          <FileUploader onUploadSuccess={fetchResumes} />
        </div>

        {/* Resumes List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Uploaded Resumes ({resumes.length})
            </h2>
          </div>

          {loading ? (
            <div className="glass-card p-8 rounded-2xl text-center text-slate-400">Loading your resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-600" />
              <h3 className="font-semibold text-slate-300">No Resumes Uploaded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your first resume PDF using the upload widget on the left to extract raw text and trigger AI analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="glass-card p-5 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm">{resume.fileName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Uploaded on {new Date(resume.createdAt).toLocaleDateString()} • {resume.rawText ? `${resume.rawText.length} chars extracted` : 'Text extracted'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3 h-3" /> Parsed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
