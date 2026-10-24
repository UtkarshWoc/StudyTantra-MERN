import { api } from './api';

/**
 * Download a file from an authenticated API endpoint (a plain <a href> can't
 * send the bearer token). Uses the server's filename when provided.
 */
export const downloadFromApi = async (path, fallbackName) => {
  const res = await api.get(path, { responseType: 'blob' });
  const match = /filename="([^"]+)"/.exec(res.headers['content-disposition'] || '');
  const url = URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = match?.[1] || fallbackName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
