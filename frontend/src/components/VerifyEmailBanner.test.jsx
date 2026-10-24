import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import VerifyEmailBanner from './VerifyEmailBanner';

describe('VerifyEmailBanner', () => {
  it('is hidden for verified users', () => {
    renderWithProviders(<VerifyEmailBanner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('asks unverified users to verify', () => {
    renderWithProviders(<VerifyEmailBanner />, { user: { _id: 'u', email: 'me@example.com', emailVerified: false } });
    expect(screen.getByRole('status')).toHaveTextContent('me@example.com');
    expect(screen.getByRole('button', { name: /resend/i })).toBeInTheDocument();
  });
});
