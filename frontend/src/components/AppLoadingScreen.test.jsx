import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppLoadingScreen from './AppLoadingScreen';

describe('AppLoadingScreen', () => {
  it('renders StudyTantra brand name and educational insight', () => {
    render(<AppLoadingScreen message="Calibrating active recall..." />);
    expect(screen.getByRole('heading', { name: /StudyTantra/i })).toBeInTheDocument();
    expect(screen.getByText(/AI Spaced Recall & Neural Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Calibrating active recall.../i)).toBeInTheDocument();
  });

  it('provides a button to reload the page', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    });

    render(<AppLoadingScreen />);
    const refreshLink = screen.getByText(/Click to refresh/i);
    expect(refreshLink).toBeInTheDocument();
    fireEvent.click(refreshLink);
    expect(reloadMock).toHaveBeenCalled();
  });
});
