import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils';
import QuizEngine from './QuizEngine';

const submitMutateAsync = vi.fn();
const checkQuizAnswer = vi.fn();

vi.mock('../api/hooks', () => ({
  checkQuizAnswer: (...args) => checkQuizAnswer(...args),
  useSubmitQuiz: () => ({ mutateAsync: submitMutateAsync }),
  useQuizAttempts: () => ({ data: undefined }),
}));

// Public quiz shape: no correctAnswer/explanation until the server reveals them
const quiz = {
  _id: 'q1',
  document: 'd1',
  attempted: false,
  totalQuestions: 2,
  questions: [
    { question: 'Capital of France?', options: ['Paris', 'Rome', 'Berlin', 'Madrid'] },
    { question: '2 + 2?', options: ['3', '4', '5', '6'] },
  ],
};

describe('QuizEngine', () => {
  beforeEach(() => {
    checkQuizAnswer.mockReset();
    submitMutateAsync.mockReset();
  });

  it('gets feedback from the server and submits answers for grading', async () => {
    const user = userEvent.setup();
    checkQuizAnswer
      .mockResolvedValueOnce({ correct: true, correctAnswer: 'Paris', explanation: 'Paris is the capital.' })
      .mockResolvedValueOnce({ correct: false, correctAnswer: '4', explanation: 'Basic arithmetic.' });
    submitMutateAsync.mockResolvedValue({
      score: 1,
      quiz: { questions: [
        { question: 'Capital of France?', options: ['Paris', 'Rome', 'Berlin', 'Madrid'], correctAnswer: 'Paris', explanation: 'Paris is the capital.' },
        { question: '2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4', explanation: 'Basic arithmetic.' },
      ] },
    });

    renderWithProviders(<QuizEngine quiz={quiz} />);
    await user.click(screen.getByRole('button', { name: /start quiz/i }));

    await user.click(screen.getByRole('button', { name: 'Paris' }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    expect(checkQuizAnswer).toHaveBeenCalledWith('q1', 0, 'Paris');
    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText('Paris is the capital.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next question/i }));
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    expect(await screen.findByText('Incorrect')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /view results/i }));
    expect(submitMutateAsync).toHaveBeenCalledWith({ quizId: 'q1', answers: ['Paris', '5'] });
    expect(await screen.findByText(/you scored 1 out of 2/i)).toBeInTheDocument();
    expect(screen.getByText('Basic arithmetic.')).toBeInTheDocument();
  });

  it('shows an error and lets the user retry when checking fails', async () => {
    const user = userEvent.setup();
    checkQuizAnswer.mockRejectedValueOnce(new Error('network'));

    renderWithProviders(<QuizEngine quiz={quiz} />);
    await user.click(screen.getByRole('button', { name: /start quiz/i }));
    await user.click(screen.getByRole('button', { name: 'Rome' }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));

    expect(await screen.findByText(/could not check your answer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeEnabled();
  });
});
