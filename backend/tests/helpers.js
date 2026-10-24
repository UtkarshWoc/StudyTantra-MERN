import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { whenIdle } from '../src/services/ingestion/queue.js';

let mongod;

export const startDb = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  // Unique indexes must exist before tests rely on them
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
};

export const stopDb = async () => {
  await mongoose.disconnect();
  await mongod?.stop();
};

export const clearDb = async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
};

export const api = () => request(app);

let counter = 0;

/**
 * Register a fresh user. Returns { token, user, cookie, email, password }.
 */
export const registerUser = async (overrides = {}) => {
  counter += 1;
  const body = {
    name: 'Test User',
    email: `user${counter}-${Date.now()}@example.com`,
    password: 'password123',
    ...overrides,
  };
  const res = await api().post('/api/auth/register').send(body).expect(201);
  return {
    token: res.body.accessToken,
    user: res.body.user,
    cookie: res.headers['set-cookie'],
    email: body.email,
    password: body.password,
  };
};

export const auth = (token) => ({ Authorization: `Bearer ${token}` });

// Smallest valid one-page PDF with extractable text.
export const samplePdf = (text = 'Photosynthesis converts light energy into chemical energy') => {
  const stream = `BT /F1 12 Tf 20 200 Td (${text}) Tj ET`;
  return Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 600 300]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
    `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream endobj\n` +
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R>>'
  );
};

export const uploadPdf = (token, { title = 'Biology Notes', pdf = samplePdf() } = {}) =>
  api()
    .post('/api/documents')
    .set(auth(token))
    .field('title', title)
    .attach('document', pdf, { filename: 'notes.pdf', contentType: 'application/pdf' });

/**
 * Upload a PDF and wait for background ingestion to finish. Returns the document.
 */
export const uploadReady = async (token, options) => {
  const res = await uploadPdf(token, options).expect(201);
  await whenIdle();
  return (await api().get(`/api/documents/${res.body._id}`).set(auth(token)).expect(200)).body;
};

// A PDF whose single page has no text layer (like a scan)
export const scannedPdf = () => samplePdf('');
