// Split page texts into overlapping, page-tagged chunks for embedding/retrieval.
// ~3200 chars ≈ 800 tokens; overlap keeps sentences that straddle a boundary
// retrievable from either side.

const DEFAULTS = { maxChars: 3200, overlapChars: 400 };

const splitSentences = (text) => text.match(/[^.!?\n]+(?:[.!?]+|\n+|$)/g)?.map((s) => s.trim()).filter(Boolean) || [];

/**
 * pages: [{ page, text }] → [{ index, page, pageEnd, text }]
 */
export const chunkPages = (pages, options = {}) => {
  const { maxChars, overlapChars } = { ...DEFAULTS, ...options };
  const chunks = [];
  let buffer = [];
  let length = 0;
  // How many items at the start of `buffer` were carried over from the previous chunk
  let carried = 0;

  const flush = () => {
    if (buffer.length === carried) return; // nothing new since the last chunk
    chunks.push({
      index: chunks.length,
      page: buffer[0].page,
      pageEnd: buffer[buffer.length - 1].page,
      text: buffer.map((s) => s.text).join(' '),
    });
    // Carry the tail of this chunk into the next one as overlap
    const tail = [];
    let tailLength = 0;
    for (let i = buffer.length - 1; i > 0 && tailLength + buffer[i].text.length <= overlapChars; i--) {
      tail.unshift(buffer[i]);
      tailLength += buffer[i].text.length + 1;
    }
    buffer = tail;
    carried = tail.length;
    length = tailLength;
  };

  for (const { page, text } of pages) {
    for (const sentence of splitSentences(text || '')) {
      // Hard-split pathological "sentences" (tables, no punctuation)
      for (let i = 0; i < sentence.length; i += maxChars) {
        const piece = sentence.slice(i, i + maxChars);
        if (length + piece.length > maxChars && buffer.length > carried) flush();
        buffer.push({ page, text: piece });
        length += piece.length + 1;
      }
    }
  }
  flush();
  return chunks;
};
