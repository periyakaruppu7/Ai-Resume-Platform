import React, { useState } from 'react';
import { resumeApi } from '../services/api';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUploader({ onUploadSuccess }) {
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
      setError('Please select a PDF document to upload.');
      return;
    }

    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await resumeApi.uploadResume(formData);
      setSuccess(true);
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document. Please ensure it is a valid PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Upload Resume PDF</h3>
          <p className="text-xs text-slate-400">Apache Tika automatically extracts raw text & structured data</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Resume uploaded and text extracted successfully!</span>
        </div>
      )}

      <div className="relative border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center transition-colors">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <FileText className="w-8 h-8 mx-auto text-slate-500" />
          {file ? (
            <p className="text-sm font-medium text-blue-400">{file.name}</p>
          ) : (
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Click to upload</span> or drag and drop PDF
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full mt-4 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Parsing PDF Text...</span>
          </>
        ) : (
          <span>Upload & Parse</span>
        )}
      </button>
    </div>
  );
}
