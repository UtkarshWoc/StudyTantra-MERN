import { authFetch } from './api';

/**
 * POST a chat message to `${path}/stream` (path from chatPath) and consume the
 * Server-Sent Events response.
 * Calls onSources({ citations }), onToken(text) per chunk; resolves with the
 * final history. Pass an AbortSignal to stop streaming.
 */
export const streamChat = async (path, message, { onSources, onToken, signal } = {}) => {
  const res = await authFetch(`${path}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Could not reach the AI service. Please try again.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let history = null;

  const handleEvent = (block) => {
    const event = block.match(/^event: (.+)$/m)?.[1];
    const dataLine = block.match(/^data: (.+)$/m)?.[1];
    if (!event || !dataLine) return;
    const data = JSON.parse(dataLine);
    if (event === 'sources') onSources?.(data);
    else if (event === 'token') onToken?.(data.text);
    else if (event === 'done') history = data.history;
    else if (event === 'error') throw new Error(data.message);
  };

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      handleEvent(buffer.slice(0, boundary));
      buffer = buffer.slice(boundary + 2);
    }
  }
  if (buffer.trim()) handleEvent(buffer);
  return history;
};
