import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Square, Trash2, BookOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatHistory, useClearChat, chatPath, chatKey, keys } from '../api/hooks';
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
    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/30 font-label">
      <BookOpen size={13} className="text-primary shrink-0" />
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Cited Sources</span>
      {chips.map((c) => (
        <button
          key={`${c.document}-${c.page}`}
          type="button"
          onClick={() => onCitation?.(c.page, c)}
          className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-fixed text-primary hover:bg-primary-fixed-dim transition-all cursor-pointer shadow-xs"
        >
          {c.title ? `${c.title} · ` : ''}p. {c.page}
        </button>
      ))}
    </div>
  );
};

const Bubble = ({ sender, children }) => (
  <div className={`flex max-w-[92%] animate-slide-up ${sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
    <div
      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
        sender === 'user'
          ? 'bg-primary text-on-primary ml-3 shadow-xs'
          : 'bg-primary-fixed text-primary mr-3 shadow-xs'
      }`}
    >
      {sender === 'user' ? <User size={14} /> : <Bot size={14} />}
    </div>
    <div
      className={`p-4 min-w-0 font-body text-xs sm:text-sm leading-relaxed ${
        sender === 'user'
          ? 'bg-primary text-on-primary rounded-2xl rounded-tr-xs shadow-sm whitespace-pre-wrap'
          : 'bg-surface-container-lowest text-on-surface rounded-2xl rounded-tl-xs shadow-xs border border-outline-variant/30'
      }`}
    >
      {children}
    </div>
  </div>
);

const ChatInterface = ({
  documentId,
  collectionId,
  documentTitle,
  ready = true,
  onCitation,
  draft,
  onDraftUsed,
}) => {
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
      if (finalHistory) {
        queryClient.setQueryData(chatKey(target), finalHistory);
        queryClient.invalidateQueries({ queryKey: ['insights'] });
        queryClient.invalidateQueries({ queryKey: keys.dashboard });
      }
      setPending(null);
    } catch (error) {
      if (controller.signal.aborted) {
        await queryClient.invalidateQueries({ queryKey: chatKey(target) });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
        queryClient.invalidateQueries({ queryKey: keys.dashboard });
        setPending(null);
      } else {
        setPending((p) => ({ ...p, error: error.message }));
      }
    } finally {
      abortRef.current = null;
    }
  };

  const messages = history.map((msg, i) => ({
    id: i,
    sender: msg.role === 'model' ? 'ai' : 'user',
    text: msg.content,
    citations: msg.citations,
  }));

  if (loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-surface-container-low rounded-2xl text-on-surface-variant p-8 border border-outline-variant/30">
        <Loader2 className="animate-spin mb-3 text-primary" size={32} />
        <p className="font-headline text-base">Loading study dialog...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-surface-container-low rounded-2xl overflow-hidden font-body border border-outline-variant/30 shadow-xs">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-[19px]">neurology</span>
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface leading-tight">Tantra AI Copilot</h3>
            <span className="text-[10px] font-label font-semibold text-primary uppercase tracking-wider block">
              Claude-3.5 Sonnet • Neural Stream
            </span>
          </div>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => window.confirm('Clear this conversation history?') && clearChat.mutate()}
            disabled={streaming || clearChat.isPending}
            aria-label="Clear conversation"
            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" aria-live="polite">
        {messages.length === 0 && !pending && (
          <Bubble sender="ai">
            <p className="font-body text-xs sm:text-sm">
              Greetings! Ask me any conceptual derivation or definition from{' '}
              <strong className="text-primary">{documentTitle || 'this document'}</strong>. I will cite the exact page
              theorems and formulas.
            </p>
          </Bubble>
        )}

        {messages.map((msg) => (
          <Bubble key={msg.id} sender={msg.sender}>
            {msg.sender === 'ai' ? (
              <>
                <Markdown onCitation={onCitation}>{msg.text}</Markdown>
                <CitationChips citations={msg.citations} onCitation={onCitation} />
              </>
            ) : (
              msg.text
            )}
          </Bubble>
        ))}

        {pending && (
          <>
            <Bubble sender="user">{pending.question}</Bubble>
            <Bubble sender="ai">
              {pending.error ? (
                <p className="text-xs text-error font-medium">{pending.error}</p>
              ) : pending.answer ? (
                <Markdown onCitation={onCitation}>{pending.answer}</Markdown>
              ) : (
                <div className="flex space-x-1.5 py-1" aria-label="Thinking">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
            </Bubble>
          </>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface-container/40">
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
            className="w-full pl-4 pr-12 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-xs font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 shadow-xs"
          />
          {streaming ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              aria-label="Stop generating"
              className="absolute right-2 p-2 text-on-surface-variant bg-surface-container rounded-lg hover:text-on-surface cursor-pointer"
            >
              <Square size={15} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || !ready}
              aria-label="Send"
              className="absolute right-2 p-2 text-on-primary bg-primary rounded-lg hover:bg-primary/95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              <Send size={15} />
            </button>
          )}
        </form>
        <p className="text-center text-[10px] text-on-surface-variant font-label mt-2 flex items-center justify-center gap-1">
          <Sparkles size={11} className="text-primary" />
          AI extracts directly from page proofs. Click citations to jump to source.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
