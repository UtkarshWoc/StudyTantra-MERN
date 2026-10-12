import { describe, it, expect, vi, afterEach } from 'vitest';
import { streamChat } from './chatStream';
import { setAccessToken } from './api';

const sseResponse = (chunks, status = 200) => {
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    start(controller) {
      chunks.forEach((c) => controller.enqueue(encoder.encode(c)));
      controller.close();
    },
  });
  return new Response(body, { status, headers: { 'Content-Type': 'text/event-stream' } });
};

describe('streamChat', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('parses events even when they are split across network chunks', async () => {
    setAccessToken('t');
    const fetchMock = vi.fn().mockResolvedValue(sseResponse([
      'event: sources\ndata: {"citations":[{"page":2}]}\n\nevent: tok',
      'en\ndata: {"text":"Hello "}\n\n',
      'event: token\ndata: {"text":"[p. 2]"}\n\nevent: done\ndata: {"history":[{"role":"user"},{"role":"model"}]}\n\n',
    ]));
    vi.stubGlobal('fetch', fetchMock);

    const onSources = vi.fn();
    const tokens = [];
    const history = await streamChat('doc1', 'hi', { onSources, onToken: (t) => tokens.push(t) });

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/chat\/doc1\/stream$/);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer t');
    expect(onSources).toHaveBeenCalledWith({ citations: [{ page: 2 }] });
    expect(tokens.join('')).toBe('Hello [p. 2]');
    expect(history).toHaveLength(2);
  });

  it('surfaces server errors before and during the stream', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'Still processing' }), { status: 409 })));
    await expect(streamChat('d', 'q')).rejects.toThrow('Still processing');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(sseResponse(['event: error\ndata: {"message":"AI down"}\n\n'])));
    await expect(streamChat('d', 'q')).rejects.toThrow('AI down');
  });
});
