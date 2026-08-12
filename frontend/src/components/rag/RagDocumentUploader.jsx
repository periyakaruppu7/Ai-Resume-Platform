import React, { useState } from 'react';
import { ragApi } from '../../services/api';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Database } from 'lucide-react';

export default function RagDocumentUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF company guide to embed.');
      return;
    }

    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await ragApi.uploadDocument(formData);
      setSuccess(true);
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to embed RAG document. Please check PDF file format.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100 text-sm">Upload Context PDF Document</h3>
          <p className="text-xs text-slate-400">Spring AI chunks & stores embeddings into VectorStore</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Document embedded into Vector DB successfully!</span>
        </div>
      )}

      <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 text-center transition-colors">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-1.5">
          <FileText className="w-7 h-7 mx-auto text-slate-500" />
          {file ? (
            <p className="text-xs font-medium text-indigo-400">{file.name}</p>
          ) : (
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Click to upload</span> company interview guide
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Embedding into Vector Store...</span>
          </>
        ) : (
          <span>Embed PDF for RAG Q&A</span>
        )}
      </button>
    </div>
  );
}
