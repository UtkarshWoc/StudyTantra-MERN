import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { startDb, stopDb, clearDb, api, registerUser, auth } from './helpers.js';
import { testOutbox } from '../src/services/email.js';
import Session from '../src/models/Session.js';

const tokenFromEmail = (email) => decodeURIComponent(email.text.match(/token=([^\s&]+)/)[1]);
const refreshCookie = (cookies) => cookies.find((c) => c.startsWith('st_rt='));

beforeAll(startDb);
afterAll(stopDb);
beforeEach(async () => {
  await clearDb();
  testOutbox.length = 0;
});

describe('register & login', () => {
  it('registers, returns an access token, sets an httpOnly refresh cookie and sends a verification email', async () => {
    const { token, user, cookie, email } = await registerUser();
    expect(token).toBeTruthy();
    expect(user.email).toBe(email);
    expect(user.emailVerified).toBe(false);
    expect(user).not.toHaveProperty('password');
    expect(refreshCookie(cookie)).toMatch(/HttpOnly/i);
    expect(testOutbox).toHaveLength(1);
    expect(testOutbox[0].to).toBe(email);
  });

  it('rejects invalid input with 400', async () => {
    const res = await api().post('/api/auth/register').send({ name: '', email: 'nope', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('rejects duplicate emails (case-insensitive)', async () => {
    const { email } = await registerUser();
    const res = await api().post('/api/auth/register').send({ name: 'X', email: email.toUpperCase(), password: 'password123' });
    expect(res.status).toBe(409);
  });

  it('returns 401 with a message for a wrong password', async () => {
    const { email } = await registerUser();
    const res = await api().post('/api/auth/login').send({ email, password: 'wrong-password' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('protects routes', async () => {
    await api().get('/api/auth/me').expect(401);
    const { token } = await registerUser();
    const res = await api().get('/api/auth/me').set(auth(token)).expect(200);
    expect(res.body.user.hasPassword).toBe(true);
  });
});

describe('sessions', () => {
  it('refresh rotates the refresh token and the old one stops working after the grace window', async () => {
    const { cookie } = await registerUser();
    const first = await api().post('/api/auth/refresh').set('Cookie', cookie).expect(200);
    expect(first.body.accessToken).toBeTruthy();

    const rotated = refreshCookie(first.headers['set-cookie']);
    expect(rotated).not.toBe(refreshCookie(cookie));

    await Session.updateMany({}, { rotatedAt: new Date(Date.now() - 60 * 1000) });
    await api().post('/api/auth/refresh').set('Cookie', cookie).expect(401);
  });

  it('logout revokes the session and its access token', async () => {
    const { cookie, token } = await registerUser();
    await api().post('/api/auth/logout').set('Cookie', cookie).expect(200);
    await api().post('/api/auth/refresh').set('Cookie', cookie).expect(401);
    await api().get('/api/auth/me').set(auth(token)).expect(401);
  });

  it('changing the password invalidates other sessions and old access tokens', async () => {
    const { token, email, password } = await registerUser();
    const other = await api().post('/api/auth/login').send({ email, password }).expect(200);

    const res = await api().put('/api/auth/password').set(auth(token))
      .send({ currentPassword: password, newPassword: 'new-password-456' }).expect(200);

    await api().get('/api/auth/me').set(auth(token)).expect(401);
    await api().get('/api/auth/me').set(auth(other.body.accessToken)).expect(401);
    await api().get('/api/auth/me').set(auth(res.body.accessToken)).expect(200);
    await api().post('/api/auth/login').send({ email, password: 'new-password-456' }).expect(200);
  });

  it('logout-others keeps the current session only', async () => {
    const { token, email, password } = await registerUser();
    const other = await api().post('/api/auth/login').send({ email, password }).expect(200);
    await api().post('/api/auth/logout-others').set(auth(token)).expect(200);
    await api().get('/api/auth/me').set(auth(token)).expect(200);
    await api().get('/api/auth/me').set(auth(other.body.accessToken)).expect(401);
  });
});

describe('email verification & password reset', () => {
  it('verifies email with the emailed token', async () => {
    const { token } = await registerUser();
    const verifyToken = tokenFromEmail(testOutbox[0]);
    const res = await api().post('/api/auth/verify-email').send({ token: verifyToken }).expect(200);
    expect(res.body.user.emailVerified).toBe(true);
    const me = await api().get('/api/auth/me').set(auth(token));
    expect(me.body.user.emailVerified).toBe(true);
    await api().post('/api/auth/verify-email').send({ token: verifyToken }).expect(400);
  });

  it('forgot-password does not reveal whether an email exists', async () => {
    const res = await api().post('/api/auth/forgot-password').send({ email: 'nobody@example.com' }).expect(200);
    expect(res.body.message).toMatch(/if an account exists/i);
    expect(testOutbox).toHaveLength(0);
  });

  it('resets the password with the emailed token and signs out all sessions', async () => {
    const { email, token } = await registerUser();
    testOutbox.length = 0;
    await api().post('/api/auth/forgot-password').send({ email }).expect(200);
    const resetToken = tokenFromEmail(testOutbox[0]);

    await api().post('/api/auth/reset-password').send({ token: resetToken, password: 'brand-new-pass' }).expect(200);
    await api().get('/api/auth/me').set(auth(token)).expect(401);
    await api().post('/api/auth/login').send({ email, password: 'brand-new-pass' }).expect(200);
    // Single use
    await api().post('/api/auth/reset-password').send({ token: resetToken, password: 'another-pass-1' }).expect(400);
  });
});

describe('profile & account', () => {
  it('requires the current password to change email', async () => {
    const { token, password } = await registerUser();
    await api().put('/api/auth/profile').set(auth(token)).send({ email: 'new@example.com' }).expect(400);
    const res = await api().put('/api/auth/profile').set(auth(token))
      .send({ email: 'new@example.com', currentPassword: password }).expect(200);
    expect(res.body.user.email).toBe('new@example.com');
    expect(res.body.user.emailVerified).toBe(false);
  });

  it('will not change email to one that is taken', async () => {
    const a = await registerUser();
    const b = await registerUser();
    await api().put('/api/auth/profile').set(auth(b.token))
      .send({ email: a.email, currentPassword: b.password }).expect(409);
  });

  it('deletes the account with password + DELETE confirmation', async () => {
    const { token, password, email } = await registerUser();
    await api().delete('/api/auth/account').set(auth(token)).send({ password, confirm: 'nope' }).expect(400);
    await api().delete('/api/auth/account').set(auth(token)).send({ password: 'wrong', confirm: 'DELETE' }).expect(400);
    await api().delete('/api/auth/account').set(auth(token)).send({ password, confirm: 'DELETE' }).expect(200);
    await api().post('/api/auth/login').send({ email, password }).expect(401);
  });

  it('google sign-in reports 501 when not configured', async () => {
    await api().post('/api/auth/google').send({ credential: 'x'.repeat(20) }).expect(501);
  });
});
