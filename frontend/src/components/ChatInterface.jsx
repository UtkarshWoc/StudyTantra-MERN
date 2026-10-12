import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Square, Trash2, BookOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatHistory, useClearChat, keys } from '../api/hooks';
import { streamChat } from '../lib/chatStream';
import Markdown from './Markdown';

const CitationChips = ({ citations, onCitation }) => {
  const pages = [...new Set((citations || []).map((c) => c.page))].sort((a, b) => a - b);
  if (!pages.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <BookOpen size={12} className="text-gray-400" />
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Sources</span>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onCitation?.(page)}
          className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-300 cursor-pointer"
        >
          p. {page}
        </button>
      ))}
    </div>
  );
};

const Bubble = ({ sender, children }) => (
  <div className={`flex max-w-[92%] ${sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${sender === 'user' ? 'bg-amber-600 ml-3' : 'bg-gradient-to-br from-amber-500 to-amber-700 mr-3 shadow-sm'}`}>
      {sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
    </div>
    <div className={`p-4 min-w-0 ${sender === 'user' ? 'bg-amber-600 text-white rounded-2xl rounded-tr-sm shadow-sm whitespace-pre-wrap text-[15px]' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm shadow-sm'}`}>
      {children}
    </div>
  </div>
);

/**
 * Document chat. Answers stream in token by token, cite pages ([p. N]) that
 * jump the viewer via onCitation, and `draft` ({ text }) lets the viewer prefill a question.
 */
const ChatInterface = ({ documentId, documentTitle, ready = true, onCitation, draft, onDraftUsed }) => {
  const queryClient = useQueryClient();
  const { data: history = [], isLoading: loadingHistory } = useChatHistory(documentId);
  const clearChat = useClearChat(documentId);

  const [input, setInput] = useState('');
  const [pending, setPending] = useState(null); // { question, answer, citations, error }
  const abortRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const streaming = Boolean(pending && !pending.error);

  // Text pushed from the PDF viewer ("Ask in chat"); draft is { text } so the
  // same text can be sent twice
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

  // Stop any in-flight stream when leaving the page
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || !documentId || streaming || !ready) return;

    setInput('');
    setPending({ question, answer: '', citations: [] });
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const finalHistory = await streamChat(documentId, question, {
        signal: controller.signal,
        onSources: ({ citations }) => setPending((p) => ({ ...p, citations })),
        onToken: (text) => setPending((p) => ({ ...p, answer: p.answer + text })),
      });
      if (finalHistory) queryClient.setQueryData(keys.chat(documentId), finalHistory);
      setPending(null);
    } catch (error) {
      if (controller.signal.aborted) {
        // The server keeps the partial answer; reload the conversation
        await queryClient.invalidateQueries({ queryKey: keys.chat(documentId) });
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
      <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-400">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden font-sans transition-colors">
      <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-center">
        <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600 dark:text-amber-400 mr-3">
          <Sparkles size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Study Assistant</h3>
          <p className={`text-xs font-medium ${ready ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {ready ? 'Answers cite pages from your document' : 'Waiting for the document to finish processing...'}
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => window.confirm('Clear this conversation?') && clearChat.mutate()}
            disabled={streaming || clearChat.isPending}
            aria-label="Clear conversation"
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50 dark:bg-gray-900/50" aria-live="polite">
        {messages.length === 0 && !pending && (
          <Bubble sender="ai">
            <p className="text-[15px]">Hi! Ask me anything about <span className="font-semibold">{documentTitle || 'this document'}</span>. I'll answer from the document and show which pages I used. Tip: select text in the PDF to explain it.</p>
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
                <p className="text-sm text-red-500">{pending.error}</p>
              ) : pending.answer ? (
                <Markdown onCitation={onCitation}>{pending.answer}</Markdown>
              ) : (
                <div className="flex space-x-1.5 py-1" aria-label="Thinking">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              )}
            </Bubble>
          </>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
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
            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder-gray-400 text-gray-900 dark:text-gray-100 disabled:opacity-60"
          />
          {streaming ? (
            <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop generating" className="absolute right-2 p-2 text-white bg-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
              <Square size={16} />
            </button>
          ) : (
            <button type="submit" disabled={!input.trim() || !ready} aria-label="Send" className="absolute right-2 p-2 text-[#0b1120] bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <Send size={16} className="ml-0.5" />
            </button>
          )}
        </form>
        <p className="text-center text-xs text-gray-400 mt-2.5 flex items-center justify-center">
          <Sparkles size={12} className="mr-1.5" />
          AI can make mistakes. Check the cited pages.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
