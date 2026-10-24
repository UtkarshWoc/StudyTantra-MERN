import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils';
import Review from './Review';

const mutate = vi.fn();
const future = (days) => new Date(Date.now() + days * 86400000).toISOString();
const card = (id, question) => ({
  _id: id, question, answer: `${question} answer`, topic: 'Cells', documentTitle: 'Biology', isNew: true,
  intervals: { 1: future(0.007), 2: future(1), 3: future(3), 4: future(9) },
});

vi.mock('../api/hooks', () => ({
  useReviewQueue: () => ({
    data: { cards: [card('a', 'What is ATP?'), card('b', 'What is DNA?')], counts: { due: 0, new: 2, newToday: 0, newLimit: 20, newWaiting: 2 } },
    isLoading: false,
  }),
  useSubmitReview: () => ({ mutate, isPending: false }),
}));

describe('Review', () => {
  beforeEach(() => {
    mutate.mockReset();
    mutate.mockImplementation((vars, { onSuccess }) => onSuccess({}));
  });

  it('flips, shows next intervals, and re-queues cards rated Again', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Review />);

    expect(screen.getByText('What is ATP?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /show answer/i }));
    expect(screen.getByText('What is ATP? answer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /good.*3d/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /again/i }));
    expect(mutate).toHaveBeenCalledWith({ id: 'a', rating: 1 }, expect.any(Object));
    // "Again" sends ATP to the back of the queue
    expect(screen.getByText('What is DNA?')).toBeInTheDocument();
    expect(screen.getByText(/2 left/)).toBeInTheDocument();
  });

  it('supports keyboard shortcuts and finishes the session', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Review />);

    await user.keyboard(' ');
    await user.keyboard('3');
    await user.keyboard(' ');
    await user.keyboard('4');
    expect(mutate).toHaveBeenNthCalledWith(1, { id: 'a', rating: 3 }, expect.any(Object));
    expect(mutate).toHaveBeenNthCalledWith(2, { id: 'b', rating: 4 }, expect.any(Object));
    expect(screen.getByText('Session complete')).toBeInTheDocument();
  });
});
