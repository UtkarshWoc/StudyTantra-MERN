import { extractText, getDocumentProxy } from 'unpdf';

/**
 * Extract text per page from a PDF buffer.
 * Returns { pageCount, pages: [{ page, text }] } with 1-based page numbers.
 */
export const extractPdfPages = async (buffer) => {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  return {
    pageCount: totalPages,
    pages: text.map((t, i) => ({ page: i + 1, text: (t || '').replace(/[ \t]+/g, ' ').trim() })),
  };
};

export const pagesToText = (pages) => pages.map((p) => `[p. ${p.page}]\n${p.text}`).join('\n\n');
