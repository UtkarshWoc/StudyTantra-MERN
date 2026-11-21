import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Flashcards from './Flashcards';

vi.mock('../api/hooks', () => ({
  useDocuments: vi.fn(),
  useFlashcards: vi.fn(),
  useGenerateFlashcards: vi.fn(),
  useDeleteFlashcard: vi.fn(),
  useSubmitReview: vi.fn(),
}));

import {
  useDocuments,
  useFlashcards,
  useGenerateFlashcards,
  useDeleteFlashcard,
  useSubmitReview,
} from '../api/hooks';

describe('Flashcards Page', () => {
  const queryClient = new QueryClient();

  it('renders correctly with 1 document and 0 flashcards', () => {
    useDocuments.mockReturnValue({
      data: [{ _id: 'doc-123', title: 'Colleen Hoover - It Starts with Us', status: 'ready', pageCount: 200 }],
      isLoading: false,
    });
    useFlashcards.mockReturnValue({
      data: [],
      isLoading: false,
    });
    useGenerateFlashcards.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    });
    useDeleteFlashcard.mockReturnValue({
      mutate: vi.fn(),
    });
    useSubmitReview.mockReturnValue({
      mutate: vi.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Flashcards />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Flashcards Vault/i)).toBeInTheDocument();
    expect(screen.getByText(/No Flashcards Generated Yet/i)).toBeInTheDocument();
  });

  it('renders correctly when document is processing', () => {
    useDocuments.mockReturnValue({
      data: [{ _id: 'doc-123', title: 'Colleen Hoover - It Starts with Us', status: 'processing', progress: 45 }],
      isLoading: false,
    });
    useFlashcards.mockReturnValue({
      data: [],
      isLoading: false,
    });
    useGenerateFlashcards.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    });
    useDeleteFlashcard.mockReturnValue({ mutate: vi.fn() });
    useSubmitReview.mockReturnValue({ mutate: vi.fn() });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Flashcards />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Flashcards Vault/i)).toBeInTheDocument();
  });

  it('renders correctly when flashcards exist', () => {
    useDocuments.mockReturnValue({
      data: [{ _id: 'doc-123', title: 'Colleen Hoover', status: 'ready', pageCount: 10 }],
      isLoading: false,
    });
    useFlashcards.mockReturnValue({
      data: [
        { _id: 'card-1', question: 'What is Q1?', answer: 'Answer 1', topic: 'Chapter 1' },
      ],
      isLoading: false,
    });
    useGenerateFlashcards.mockReturnValue({ mutate: vi.fn(), isPending: false, error: null });
    useDeleteFlashcard.mockReturnValue({ mutate: vi.fn() });
    useSubmitReview.mockReturnValue({ mutate: vi.fn() });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Flashcards />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Question \/ Prompt/i)).toBeInTheDocument();
  });
});
