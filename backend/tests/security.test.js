import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';

// Google ID-token verification is mocked: the token string is the email it vouches for.
vi.mock('google-auth-library', () => ({
  OAuth2Client: class {
    async verifyIdToken({ idToken }) {
      const email = idToken.replace(/^google:/, '');
      return { getPayload: () => ({ sub: `sub-${email}`, email, email_verified: true, name: 'Google User' }) };
    }
  },
}));

vi.stubEnv('GOOGLE_CLIENT_ID', 'test-google-client');

let h;
let Session;
let testOutbox;

beforeAll(async () => {
  // Imported after stubbing env so config/env.js sees GOOGLE_CLIENT_ID
  h = await import('./helpers.js');
  ({ default: Session } = await import('../src/models/Session.js'));
  ({ testOutbox } = await import('../src/services/email.js'));
  await h.startDb();
});
afterAll(() => h.stopDb());
beforeEach(async () => {
  await h.clearDb();
  testOutbox.length = 0;
});

const googleLogin = (email) => h.api().post('/api/auth/google').send({ credential: `google:${email}` });

describe('google sign-in', () => {
  it('creates a verified, password-less account', async () => {
    const res = await googleLogin('new@gmail.com').expect(200);
    expect(res.body.user).toMatchObject({ email: 'new@gmail.com', emailVerified: true, hasPassword: false, googleLinked: true });
  });

  it('defeats account pre-hijacking: an unverified squatter loses password and sessions', async () => {
    const squatter = await h.registerUser({ email: 'victim@gmail.com', password: 'attacker-pass' });

    const res = await googleLogin('victim@gmail.com').expect(200);
    expect(res.body.user.hasPassword).toBe(false);

    await h.api().post('/api/auth/login').send({ email: 'victim@gmail.com', password: 'attacker-pass' }).expect(401);
    await h.api().get('/api/auth/me').set(h.auth(squatter.token)).expect(401);
    await h.api().post('/api/auth/refresh').set('Cookie', squatter.cookie).expect(401);
  });

  it('links to a verified account without touching its password', async () => {
    const owner = await h.registerUser({ email: 'owner@gmail.com' });
    const verifyToken = decodeURIComponent(testOutbox[0].text.match(/token=([^\s&]+)/)[1]);
    await h.api().post('/api/auth/verify-email').send({ token: verifyToken }).expect(200);

    const res = await googleLogin('owner@gmail.com').expect(200);
    expect(res.body.user.hasPassword).toBe(true);
    await h.api().post('/api/auth/login').send({ email: 'owner@gmail.com', password: owner.password }).expect(200);
  });

  it('a stolen access token cannot add a password to a Google-only account', async () => {
    const { body } = await googleLogin('g@gmail.com').expect(200);
    const res = await h.api().put('/api/auth/password').set(h.auth(body.accessToken))
      .send({ currentPassword: 'anything', newPassword: 'attacker-pass-1' });
    expect(res.status).toBe(400);
    await h.api().post('/api/auth/login').send({ email: 'g@gmail.com', password: 'attacker-pass-1' }).expect(401);
  });

  it('password-less accounts need a fresh sign-in to delete themselves', async () => {
    const { body } = await googleLogin('old@gmail.com').expect(200);
    // createdAt is immutable through Mongoose; backdate via the raw collection
    await Session.collection.updateMany({}, { $set: { createdAt: new Date(Date.now() - 60 * 60 * 1000) } });
    await h.api().delete('/api/auth/account').set(h.auth(body.accessToken)).send({ confirm: 'DELETE' }).expect(403);

    const fresh = await googleLogin('old@gmail.com').expect(200);
    await h.api().delete('/api/auth/account').set(h.auth(fresh.body.accessToken)).send({ confirm: 'DELETE' }).expect(200);
  });
});

describe('refresh token reuse', () => {
  it('replaying a rotated-out token after the grace window revokes the session', async () => {
    const { cookie } = await h.registerUser();
    const rotated = await h.api().post('/api/auth/refresh').set('Cookie', cookie).expect(200);
    const newCookie = rotated.headers['set-cookie'];

    // Simulate the replay happening well after rotation
    await Session.updateMany({}, { rotatedAt: new Date(Date.now() - 5 * 60 * 1000) });
    await h.api().post('/api/auth/refresh').set('Cookie', cookie).expect(401);

    // The legitimate holder is now signed out too: the session is burned
    await h.api().post('/api/auth/refresh').set('Cookie', newCookie).expect(401);
  });

  it('tolerates near-simultaneous refreshes from two tabs', async () => {
    const { cookie } = await h.registerUser();
    await h.api().post('/api/auth/refresh').set('Cookie', cookie).expect(200);
    await h.api().post('/api/auth/refresh').set('Cookie', cookie).expect(200);
  });
});

describe('stale reset links', () => {
  it('stop working after the password is changed', async () => {
    const { email, token, password } = await h.registerUser();
    await h.api().post('/api/auth/forgot-password').send({ email }).expect(200);
    const resetToken = decodeURIComponent(testOutbox.at(-1).text.match(/token=([^\s&]+)/)[1]);

    await h.api().put('/api/auth/password').set(h.auth(token)).send({ currentPassword: password, newPassword: 'changed-pass-1' }).expect(200);
    await h.api().post('/api/auth/reset-password').send({ token: resetToken, password: 'attacker-pass-1' }).expect(400);
  });
});

describe('email templates', () => {
  it('escape user-controlled names', async () => {
    await h.registerUser({ name: '<a href="https://evil.example">Click</a>' });
    expect(testOutbox[0].html).not.toContain('<a href="https://evil.example">');
    expect(testOutbox[0].html).toContain('&lt;a href=');
  });
});
