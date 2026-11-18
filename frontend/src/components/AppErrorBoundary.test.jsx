import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppErrorBoundary from './AppErrorBoundary';

const FaultyComponent = () => {
  throw new Error('Test crash error');
};

describe('AppErrorBoundary', () => {
  it('renders recovery screen when a child throws', () => {
    // Suppress console.error from expected throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AppErrorBoundary>
        <FaultyComponent />
      </AppErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /Neural Workspace Interrupted/i })).toBeInTheDocument();
    expect(screen.getByText(/StudyTantra Session Recovery/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Page/i })).toBeInTheDocument();

    spy.mockRestore();
  });

  it('triggers window.location.reload when Refresh Page is clicked', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock, href: '' },
    });

    render(<AppErrorBoundary error={new Error('Manual error')} />);
    const refreshBtn = screen.getByRole('button', { name: /Refresh Page/i });
    fireEvent.click(refreshBtn);
    expect(reloadMock).toHaveBeenCalled();
  });
});
