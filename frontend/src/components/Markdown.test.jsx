import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Markdown from './Markdown';

describe('Markdown', () => {
  it('turns page citations into buttons that jump to the page', async () => {
    const onCitation = vi.fn();
    render(<Markdown onCitation={onCitation}>{'Plants make glucose [p. 3] and oxygen [p. 4-5].'}</Markdown>);

    await userEvent.click(screen.getByRole('button', { name: 'p. 3' }));
    expect(onCitation).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'p. 4-5' }));
    expect(onCitation).toHaveBeenLastCalledWith(4);
  });

  it('renders markdown but not raw HTML', () => {
    const { container } = render(<Markdown>{'**bold** <img src=x onerror=alert(1)>'}</Markdown>);
    expect(container.querySelector('strong')).toHaveTextContent('bold');
    expect(container.querySelector('img')).toBeNull();
  });
});
