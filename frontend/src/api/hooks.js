import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const keys = {
  documents: ['documents'],
  document: (id) => ['documents', id],
  dashboard: ['dashboard'],
  flashcards: (docId) => ['flashcards', docId],
  quizzes: (docId) => ['quizzes', docId],
  chat: (docId) => ['chat', docId],
};

const get = (url) => api.get(url).then((r) => r.data);

// ---- Documents ----

// Poll while documents are being processed (text extraction, OCR, embeddings)
const POLL_MS = 2500;

export const useDocuments = (options = {}) =>
  useQuery({
    queryKey: keys.documents,
    queryFn: () => get('/documents'),
    refetchInterval: (query) => (query.state.data?.some((d) => d.status === 'processing') ? POLL_MS : false),
    ...options,
  });

export const useDocument = (id, options = {}) => {
  const qc = useQueryClient();
  return useQuery({
    queryKey: keys.document(id),
    queryFn: async () => {
      const doc = await get(`/documents/${id}`);
      // Keep the library list in sync when this document finishes processing
      qc.setQueryData(keys.documents, (docs) => docs?.map((d) => (d._id === doc._id ? doc : d)));
      return doc;
    },
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.status === 'processing' ? POLL_MS : false),
    ...options,
  });
};

export const useReprocessDocument = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/documents/${id}/reprocess`).then((r) => r.data),
    onSuccess: (doc) => {
      qc.setQueryData(keys.document(id), doc);
      qc.invalidateQueries({ queryKey: keys.documents });
    },
  });
};

export const useExplainSelection = (docId) =>
  useMutation({ mutationFn: ({ text, mode }) => api.post(`/ai/explain/${docId}`, { text, mode }).then((r) => r.data.explanation) });

export const useUploadDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, title }) => {
      const form = new FormData();
      form.append('document', file);
      form.append('title', title);
      return api.post('/documents', form).then((r) => r.data);
    },
    onSuccess: (doc) => {
      qc.setQueryData(keys.document(doc._id), doc);
      qc.invalidateQueries({ queryKey: keys.documents });
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/documents/${id}`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: keys.documents });
      const previous = qc.getQueryData(keys.documents);
      qc.setQueryData(keys.documents, (docs = []) => docs.filter((d) => d._id !== id));
      return { previous };
    },
    onError: (err, id, ctx) => qc.setQueryData(keys.documents, ctx?.previous),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: keys.documents });
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useToggleDocumentFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.put(`/documents/${id}/favorite`).then((r) => r.data),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: keys.documents });
      const previous = qc.getQueryData(keys.documents);
      qc.setQueryData(keys.documents, (docs = []) =>
        docs.map((d) => (d._id === id ? { ...d, isFavorited: !d.isFavorited } : d)));
      return { previous };
    },
    onError: (err, id, ctx) => qc.setQueryData(keys.documents, ctx?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: keys.documents }),
  });
};

/**
 * Fetch the private PDF through the API and expose it as an object URL.
 */
export const useDocumentFileUrl = (id) => {
  const query = useQuery({
    queryKey: ['documentFile', id],
    queryFn: () => api.get(`/documents/${id}/file`, { responseType: 'blob' }).then((r) => r.data),
    enabled: Boolean(id),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!query.data) return undefined;
    const objectUrl = URL.createObjectURL(new Blob([query.data], { type: 'application/pdf' }));
    // Syncing with an external resource: the URL must be created and revoked in the
    // same effect so StrictMode's mount/unmount/mount cycle never leaves a revoked URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [query.data]);
  return { ...query, url, blob: query.data };
};

export const useGenerateSummary = (docId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/ai/summary/${docId}`).then((r) => r.data),
    onSuccess: ({ summary }) => {
      qc.setQueryData(keys.document(docId), (doc) => (doc ? { ...doc, summary } : doc));
    },
  });
};

// ---- Dashboard ----

export const useDashboard = () => useQuery({ queryKey: keys.dashboard, queryFn: () => get('/dashboard') });

// ---- Flashcards ----

export const useFlashcards = (docId) =>
  useQuery({ queryKey: keys.flashcards(docId), queryFn: () => get(`/flashcards/${docId}`), enabled: Boolean(docId) });

export const useGenerateFlashcards = (docId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/flashcards/generate/${docId}`, body).then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(keys.flashcards(docId), data.flashcards);
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useFlashcardFromSelection = (docId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text) => api.post(`/flashcards/from-selection/${docId}`, { text }).then((r) => r.data.flashcard),
    onSuccess: (card) => {
      qc.setQueryData(keys.flashcards(docId), (cards) => (cards ? [...cards, card] : cards));
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useDeleteFlashcard = (docId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/flashcards/${id}`),
    onMutate: (id) => {
      const previous = qc.getQueryData(keys.flashcards(docId));
      qc.setQueryData(keys.flashcards(docId), (cards = []) => cards.filter((c) => c._id !== id));
      return { previous };
    },
    onError: (err, id, ctx) => qc.setQueryData(keys.flashcards(docId), ctx?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: keys.dashboard }),
  });
};

// ---- Quizzes ----

export const useQuizzes = (docId) =>
  useQuery({ queryKey: keys.quizzes(docId), queryFn: () => get(`/quizzes/document/${docId}`), enabled: Boolean(docId) });

export const useGenerateQuiz = (docId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/quizzes/generate/${docId}`, body).then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(keys.quizzes(docId), (quizzes = []) => [data.quiz, ...quizzes]);
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const checkQuizAnswer = (quizId, index, answer) =>
  api.post(`/quizzes/${quizId}/check`, { index, answer }).then((r) => r.data);

export const useSubmitQuiz = (docId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, answers }) => api.post(`/quizzes/${quizId}/submit`, { answers }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.quizzes(docId) });
      qc.invalidateQueries({ queryKey: keys.dashboard });
    },
  });
};

export const useQuizAttempts = (quizId, enabled = true) =>
  useQuery({ queryKey: ['quizAttempts', quizId], queryFn: () => get(`/quizzes/${quizId}/attempts`), enabled: Boolean(quizId) && enabled });

// ---- Chat ----

// A chat targets one document or a whole collection
export const chatPath = ({ documentId, collectionId }) =>
  (collectionId ? `/chat/collection/${collectionId}` : `/chat/${documentId}`);
export const chatKey = ({ documentId, collectionId }) =>
  (collectionId ? ['chat', 'collection', collectionId] : keys.chat(documentId));

export const useChatHistory = (target) =>
  useQuery({
    queryKey: chatKey(target),
    queryFn: () => get(chatPath(target)).then((d) => d.history),
    enabled: Boolean(target.documentId || target.collectionId),
  });

export const useClearChat = (target) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete(chatPath(target)),
    onSuccess: () => qc.setQueryData(chatKey(target), []),
  });
};

// ---- Documents: rename / move ----

export const useUpdateDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`/documents/${id}`, body).then((r) => r.data),
    onSuccess: (doc) => {
      qc.setQueryData(keys.document(doc._id), doc);
      qc.setQueryData(keys.documents, (docs) => docs?.map((d) => (d._id === doc._id ? doc : d)));
      qc.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

// ---- Spaced repetition ----

export const useReviewQueue = (documentId) =>
  useQuery({
    queryKey: ['review', documentId || 'all'],
    queryFn: () => get(`/review/queue${documentId ? `?document=${documentId}` : ''}`),
    staleTime: 0,
  });

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating }) => api.post(`/review/${id}`, { rating }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
};

// ---- Insights ----

export const useInsights = () => useQuery({ queryKey: ['insights', 'overview'], queryFn: () => get('/insights/overview') });

export const useTopics = (documentId) =>
  useQuery({
    queryKey: ['insights', 'topics', documentId || 'all'],
    queryFn: () => get(`/insights/topics${documentId ? `?document=${documentId}` : ''}`).then((d) => d.topics),
  });

// ---- Collections ----

export const useCollections = () => useQuery({ queryKey: ['collections'], queryFn: () => get('/collections') });

export const useCollection = (id) =>
  useQuery({ queryKey: ['collections', id], queryFn: () => get(`/collections/${id}`), enabled: Boolean(id) });

export const useSaveCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => (id ? api.put(`/collections/${id}`, body) : api.post('/collections', body)).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useDeleteCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/collections/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['collections'] });
      qc.invalidateQueries({ queryKey: keys.documents });
    },
  });
};

export const useCollectionQuizzes = (collectionId) =>
  useQuery({ queryKey: ['quizzes', 'collection', collectionId], queryFn: () => get(`/quizzes/collection/${collectionId}`), enabled: Boolean(collectionId) });

export const useGenerateCollectionQuiz = (collectionId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/quizzes/generate/collection/${collectionId}`, body).then((r) => r.data),
    onSuccess: (data) => qc.setQueryData(['quizzes', 'collection', collectionId], (quizzes = []) => [data.quiz, ...quizzes]),
  });
};

// ---- Study planner ----

export const usePlans = () => useQuery({ queryKey: ['plans'], queryFn: () => get('/plans') });

export const usePlan = (id) => useQuery({ queryKey: ['plans', id], queryFn: () => get(`/plans/${id}`), enabled: Boolean(id) });

export const useCreatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post('/plans', body).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plans'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};

export const useTogglePlanTask = (planId) => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ taskId, done }) => api.patch(`/plans/${planId}/tasks/${taskId}`, { done }).then((r) => r.data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['plans'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
    },
  });

  // Optimistic update applied synchronously in the click handler: a controlled
  // checkbox would otherwise flicker back for a tick before onMutate runs.
  const mutate = ({ taskId, done }) => {
    const setDone = (t) => (t._id === taskId ? { ...t, done } : t);
    qc.setQueryData(['plans', planId], (plan) => plan && {
      ...plan,
      days: plan.days.map((d) => ({ ...d, tasks: d.tasks.map(setDone) })),
    });
    qc.setQueryData(['insights', 'overview'], (o) => o?.todaysPlan && {
      ...o,
      todaysPlan: { ...o.todaysPlan, tasks: o.todaysPlan.tasks.map(setDone) },
    } || o);
    mutation.mutate({ taskId, done });
  };

  return { ...mutation, mutate };
};

export const useDeletePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/plans/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plans'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};
