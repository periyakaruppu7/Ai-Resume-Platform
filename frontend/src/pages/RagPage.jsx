import React, { useEffect, useState } from 'react';
import { ragApi } from '../services/api';
import RagDocumentUploader from '../components/rag/RagDocumentUploader';
import RagChatBox from '../components/rag/RagChatBox';
import { Database, FileText, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

export default function RagPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await ragApi.getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to load RAG documents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ragApi.deleteDocument(id);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Spring AI Vector RAG Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">Context-Aware Document RAG Engine</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload company interview prep guides, chunk into vector embeddings, and query grounded Q&A context.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Document Uploader & Vector Index */}
        <div className="lg:col-span-1 space-y-6">
          <RagDocumentUploader onUploadSuccess={fetchDocuments} />

          {/* Embedded Documents List */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" /> Embedded Context Guides ({documents.length})
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400 text-center py-4">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No RAG guides uploaded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-200 truncate">{doc.documentName}</div>
                        <div className="text-[10px] text-slate-400">
                          {doc.chunkCount} Vector Chunks • {doc.status}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Grounded RAG Chatbox */}
        <div className="lg:col-span-2">
          <RagChatBox />
        </div>
      </div>
    </div>
  );
}
