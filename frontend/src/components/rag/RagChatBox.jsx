import React, { useState } from 'react';
import { ragApi } from '../../services/api';
import { Send, Bot, User, BookOpen, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';

export default function RagChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your RAG Enterprise Advisor. Ask any question about your uploaded company interview guides and I will retrieve exact grounded answers from the vector database.',
      sources: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [querying, setQuerying] = useState(false);
  const [expandedSourceIndex, setExpandedSourceIndex] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || querying) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    // Append User Message
    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userText, sources: [] },
    ];
    setMessages(updatedMessages);
    setQuerying(true);

    try {
      const response = await ragApi.queryContext({
        questionText: userText,
      });

      setMessages([
        ...updatedMessages,
        {
          sender: 'bot',
          text: response.data.answerText,
          sources: response.data.relevantSources || [],
        },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          sender: 'bot',
          text: 'Apologies, I encountered an issue searching the vector database context.',
          sources: [],
        },
      ]);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col h-[580px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Context-Grounded RAG Chat</h3>
            <p className="text-[10px] text-slate-400">Strict top-$k$ similarity search against VectorStore</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              <p>{msg.text}</p>

              {/* Source Chunk Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() =>
                      setExpandedSourceIndex(expandedSourceIndex === idx ? null : idx)
                    }
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Grounded Source Chunks ({msg.sources.length})</span>
                    {expandedSourceIndex === idx ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {expandedSourceIndex === idx && (
                    <div className="mt-2 space-y-2">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1"
                        >
                          <div className="font-bold text-slate-300 flex justify-between">
                            <span>{src.documentName}</span>
                            <span className="text-emerald-400 font-normal">
                              Match: {Math.round((src.similarityScore || 0.9) * 100)}%
                            </span>
                          </div>
                          <p className="text-slate-400 italic">"{src.textSnippet}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {querying && (
          <div className="flex items-center gap-3 text-xs text-indigo-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching Vector Database & generating grounded answer...</span>
          </div>
        )}
      </div>

      {/* Input Query Bar */}
      <form onSubmit={handleSend} className="pt-4 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about your uploaded interview prep guide..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || querying}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
