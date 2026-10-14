import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Square, Trash2, BookOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatHistory, useClearChat, chatPath, chatKey } from '../api/hooks';
import { streamChat } from '../lib/chatStream';
import Markdown from './Markdown';

const CitationChips = ({ citations, onCitation }) => {
  const seen = new Set();
  const chips = (citations || []).filter((c) => {
    const key = `${c.document}-${c.page}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
      <BookOpen size={12} className="text-slate-500" />
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Sources</span>
      {chips.map((c) => (
        <button
          key={`${c.document}-${c.page}`}
          type="button"
          onClick={() => onCitation?.(c.page, c)}
          className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200 cursor-pointer"
        >
          {c.title ? `${c.title} · ` : ''}p. {c.page}
        </button>
      ))}
    </div>
  );
};

const Bubble = ({ sender, children }) => (
  <div className={`flex max-w-[92%] animate-slide-up ${sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${sender === 'user' ? 'bg-amber-500/80 ml-3' : 'bg-gradient-to-br from-amber-400 to-amber-600 mr-3 shadow-lg shadow-amber-900/20'}`}>
      {sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
    </div>
    <div className={`p-4 min-w-0 ${sender === 'user' ? 'bg-amber-500/15 text-slate-100 rounded-2xl rounded-tr-sm border border-amber-500/20 whitespace-pre-wrap text-[15px]' : 'glass-card text-slate-200 rounded-2xl rounded-tl-sm'}`}>
      {children}
    </div>
  </div>
);

const ChatInterface = ({ documentId, collectionId, documentTitle, ready = true, onCitation, draft, onDraftUsed }) => {
  const queryClient = useQueryClient();
  const target = { documentId, collectionId };
  const { data: history = [], isLoading: loadingHistory } = useChatHistory(target);
  const clearChat = useClearChat(target);

  const [input, setInput] = useState('');
  const [pending, setPending] = useState(null);
  const abortRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const streaming = Boolean(pending && !pending.error);

  const [usedDraft, setUsedDraft] = useState(null);
  if (draft && draft !== usedDraft) {
    setUsedDraft(draft);
    setInput(draft.text);
  }
  useEffect(() => {
    if (!draft) return;
    inputRef.current?.focus();
    onDraftUsed?.();
  }, [draft, onDraftUsed]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [history.length, pending?.answer, pending?.error]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || streaming || !ready) return;

    setInput('');
    setPending({ question, answer: '', citations: [] });
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const finalHistory = await streamChat(chatPath(target), question, {
        signal: controller.signal,
        onSources: ({ citations }) => setPending((p) => ({ ...p, citations })),
        onToken: (text) => setPending((p) => ({ ...p, answer: p.answer + text })),
      });
      if (finalHistory) queryClient.setQueryData(chatKey(target), finalHistory);
      setPending(null);
    } catch (error) {
      if (controller.signal.aborted) {
        await queryClient.invalidateQueries({ queryKey: chatKey(target) });
        setPending(null);
      } else {
        setPending((p) => ({ ...p, error: error.message }));
      }
    } finally {
      abortRef.current = null;
    }
  };

  const messages = history.map((msg, i) => ({ id: i, sender: msg.role === 'model' ? 'ai' : 'user', text: msg.content, citations: msg.citations }));

  if (loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full glass-card rounded-2xl text-slate-500">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full glass-card rounded-2xl overflow-hidden font-sans">
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center">
        <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 mr-3">
          <Sparkles size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm">AI Study Assistant</h3>
          <p className={`text-xs font-medium ${ready ? 'text-emerald-400' : 'text-amber-400'}`}>
            {ready ? 'Answers cite pages from your document' : 'Waiting for the document to finish processing...'}
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => window.confirm('Clear this conversation?') && clearChat.mutate()}
            disabled={streaming || clearChat.isPending}
            aria-label="Clear conversation"
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all duration-200 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0b1120]/40" aria-live="polite">
        {messages.length === 0 && !pending && (
          <Bubble sender="ai">
            <p className="text-[15px]">Hi! Ask me anything about <span className="font-semibold text-amber-300">{documentTitle || 'this document'}</span>. I'll answer from {collectionId ? 'these documents' : 'the document'} and show which pages I used.</p>
          </Bubble>
        )}

        {messages.map((msg) => (
          <Bubble key={msg.id} sender={msg.sender}>
            {msg.sender === 'ai' ? (
              <>
                <Markdown onCitation={onCitation}>{msg.text}</Markdown>
                <CitationChips citations={msg.citations} onCitation={onCitation} />
              </>
            ) : msg.text}
          </Bubble>
        ))}

        {pending && (
          <>
            <Bubble sender="user">{pending.question}</Bubble>
            <Bubble sender="ai">
              {pending.error ? (
                <p className="text-sm text-red-400">{pending.error}</p>
              ) : pending.answer ? (
                <Markdown onCitation={onCitation}>{pending.answer}</Markdown>
              ) : (
                <div className="flex space-x-1.5 py-1" aria-label="Thinking">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              )}
            </Bubble>
          </>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t border-white/[0.06]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!ready}
            maxLength={4000}
            aria-label="Ask a question"
            placeholder={ready ? 'Ask a question about this document...' : 'Processing document...'}
            className="w-full pl-4 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] transition-all duration-300 placeholder-slate-500 text-slate-100 disabled:opacity-60"
          />
          {streaming ? (
            <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop generating" className="absolute right-2 p-2 text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
              <Square size={16} />
            </button>
          ) : (
            <button type="submit" disabled={!input.trim() || !ready} aria-label="Send" className="absolute right-2 p-2 text-[#0b1120] bg-amber-500 rounded-lg hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer btn-press">
              <Send size={16} className="ml-0.5" />
            </button>
          )}
        </form>
        <p className="text-center text-xs text-slate-500 mt-2.5 flex items-center justify-center">
          <Sparkles size={12} className="mr-1.5" />
          AI can make mistakes. Check the cited pages.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
