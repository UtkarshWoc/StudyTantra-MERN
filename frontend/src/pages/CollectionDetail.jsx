import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageSquare, Target, FileText, Zap, FolderOpen } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import QuizEngine from '../components/QuizEngine';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { useCollection, useCollectionQuizzes, useGenerateCollectionQuiz } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';

const CollectionQuizzes = ({ collectionId, ready }) => {
  const { data: quizzes = [], isLoading } = useCollectionQuizzes(collectionId);
  const generate = useGenerateCollectionQuiz(collectionId);
  const [options, setOptions] = useState(() => defaultOptions('quiz'));
  const [pickedId, setPickedId] = useState('');
  const active = quizzes.find((q) => q._id === pickedId) || quizzes[0];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
        <GenerationOptions kind="quiz" value={options} onChange={setOptions} allowPages={false} />
        {generate.isError && <p className="text-sm text-red-500">{getErrorMessage(generate.error)}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {quizzes.length > 1 ? (
            <select aria-label="Quiz" value={active?._id || ''} onChange={(e) => setPickedId(e.target.value)} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-2.5 rounded-xl text-sm">
              {quizzes.map((q, i) => <option key={q._id} value={q._id}>{`Quiz ${quizzes.length - i} · ${q.totalQuestions} Qs · ${q.scope || ''}`}</option>)}
            </select>
          ) : <span />}
          <button
            onClick={() => generate.mutate(toRequestBody(options, 'quiz'), { onSuccess: (d) => setPickedId(d.quiz._id) })}
            disabled={generate.isPending || !ready}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-bold disabled:opacity-50 cursor-pointer"
          >
            {generate.isPending ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} Generate quiz across collection
          </button>
        </div>
      </div>
      {isLoading ? <Loader2 className="animate-spin mx-auto text-gray-400" /> : active ? <QuizEngine key={active._id} quiz={active} /> : null}
    </div>
  );
};

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: collection, isLoading, isError } = useCollection(id);
  const [tab, setTab] = useState('chat');

  if (isLoading) return <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" size={28} /></div>;
  if (isError || !collection) return <p className="text-center py-16 text-gray-400">Collection not found. <Link to="/documents" className="text-amber-400">Back to library</Link></p>;

  const readyCount = collection.documents.filter((d) => d.status === 'ready').length;
  const openCitation = (page, citation) => citation?.document && navigate(`/documents/${citation.document}?page=${page}`);

  return (
    <div className="py-6 space-y-6">
      <Link to="/documents" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-amber-400"><ArrowLeft size={16} /> Library</Link>

      <div className="bg-[#111827] border border-[#334155]/50 rounded-2xl p-6">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-100"><FolderOpen className="text-amber-400" /> {collection.name}</h1>
        <p className="text-sm text-slate-400 mt-1">Chat with and quiz yourself on all {collection.documents.length} documents at once.</p>
        {collection.documents.length === 0 ? (
          <p className="text-sm text-slate-500 mt-4">This collection is empty. Move documents into it from the Library.</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {collection.documents.map((d) => (
              <li key={d._id}>
                <Link to={`/documents/${d._id}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e293b] text-sm text-slate-200 hover:text-amber-300">
                  <FileText size={14} /> {d.title} <DocumentStatus document={d} compact />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-1" role="tablist">
        {[{ id: 'chat', label: 'Chat', icon: MessageSquare }, { id: 'quiz', label: 'Quizzes', icon: Target }].map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer ${tab === t.id ? 'bg-amber-500/15 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'chat' ? (
        <div className="h-[70vh]">
          <ChatInterface collectionId={id} documentTitle={collection.name} ready={readyCount > 0} onCitation={openCitation} />
        </div>
      ) : (
        <CollectionQuizzes collectionId={id} ready={readyCount > 0} />
      )}
    </div>
  );
};

export default CollectionDetail;
