import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';

// Files are private: Cloudinary assets are uploaded with type "authenticated" and
// only ever reach the browser through GET /api/documents/:id/file (auth-checked).
// STORAGE_DRIVER=local stores files on disk instead (dev without Cloudinary, tests).

const LOCAL_DIR = path.resolve(process.env.LOCAL_UPLOAD_DIR || 'uploads');
const CLOUDINARY_FOLDER = 'studytantra_documents';

export const storageDriver = () => process.env.STORAGE_DRIVER || 'cloudinary';

const safeName = (name) =>
  (name || 'document')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .slice(0, 60) || 'document';

const uploadToCloudinary = (buffer, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', type: 'authenticated', folder: CLOUDINARY_FOLDER, public_id: publicId },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

/**
 * Store a file and return the fields to persist on the Document.
 */
export const saveFile = async (buffer, originalName) => {
  const id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName(originalName)}`;

  if (storageDriver() === 'local') {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    const key = `${id}.pdf`;
    await fs.writeFile(path.join(LOCAL_DIR, key), buffer);
    return { storageDriver: 'local', storageKey: key, deliveryType: 'private' };
  }

  // Raw assets keep the extension as part of the public_id.
  const result = await uploadToCloudinary(buffer, `${id}.pdf`);
  return { storageDriver: 'cloudinary', storageKey: result.public_id, deliveryType: 'authenticated' };
};

// Documents uploaded before private storage existed only have a public filePath.
const isLegacy = (doc) => !doc.storageKey;

/**
 * Read a document's file into a Buffer (for text extraction / AI / proxying).
 */
export const readFile = async (doc) => {
  if (!isLegacy(doc) && doc.storageDriver === 'local') {
    return fs.readFile(path.join(LOCAL_DIR, path.basename(doc.storageKey)));
  }

  const url = isLegacy(doc)
    ? doc.filePath
    : cloudinary.url(doc.storageKey, {
        resource_type: 'raw',
        type: 'authenticated',
        sign_url: true,
        secure: true,
      });

  if (!url) throw new Error('Document has no stored file');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch stored file: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
};

/**
 * Delete a document's file. Never throws — a missing file must not block DB cleanup.
 */
export const deleteFile = async (doc) => {
  try {
    if (isLegacy(doc)) {
      if (doc.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(doc.cloudinaryPublicId, { resource_type: 'raw' });
      }
    } else if (doc.storageDriver === 'local') {
      await fs.rm(path.join(LOCAL_DIR, path.basename(doc.storageKey)), { force: true });
    } else {
      await cloudinary.uploader.destroy(doc.storageKey, { resource_type: 'raw', type: 'authenticated' });
    }
  } catch (err) {
    console.warn('File deletion warning:', err.message);
  }
};
