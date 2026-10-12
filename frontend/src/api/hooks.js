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

export const useDocuments = (options = {}) =>
  useQuery({ queryKey: keys.documents, queryFn: () => get('/documents'), ...options });

export const useDocument = (id, options = {}) =>
  useQuery({ queryKey: keys.document(id), queryFn: () => get(`/documents/${id}`), enabled: Boolean(id), ...options });

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

export const useChatHistory = (docId) =>
  useQuery({ queryKey: keys.chat(docId), queryFn: () => get(`/chat/${docId}`).then((d) => d.history), enabled: Boolean(docId) });
