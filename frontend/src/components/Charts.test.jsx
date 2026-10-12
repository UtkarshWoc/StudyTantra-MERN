import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActivityHeatmap from './ActivityHeatmap';
import GoalMeter from './GoalMeter';

describe('ActivityHeatmap', () => {
  it('draws one cell per day and summarises activity for screen readers', () => {
    const days = Array.from({ length: 14 }, (_, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, count: i % 3 }));
    const { container } = render(<ActivityHeatmap days={days} />);
    expect(container.querySelectorAll('rect')).toHaveLength(14);
    expect(screen.getByRole('img')).toHaveAccessibleName(/13 reviews and quizzes on 9 days/);
    // Zero days use the neutral step, active days the amber ramp
    expect(container.querySelector('rect').getAttribute('fill')).toBe('#1e293b');
  });
});

describe('GoalMeter', () => {
  it('shows progress and a labelled completed state', () => {
    const { rerender } = render(<GoalMeter done={5} target={20} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '5');
    expect(screen.getByText('15 to go')).toBeInTheDocument();
    rerender(<GoalMeter done={25} target={20} />);
    expect(screen.getByText('Goal reached')).toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '20');
  });
});
