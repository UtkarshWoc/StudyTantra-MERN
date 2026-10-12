import { env, isTest } from '../config/env.js';
import { logger } from '../config/logger.js';

// Sent emails are kept here in tests so specs can read links out of them.
export const testOutbox = [];

/**
 * Send a transactional email via Resend. Without RESEND_API_KEY (local dev) the
 * email is logged instead so links can be copied from the console.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  if (isTest) {
    testOutbox.push({ to, subject, text, html });
    return;
  }
  if (!env.RESEND_API_KEY) {
    logger.info({ to, subject, text }, 'Email (not sent: RESEND_API_KEY not configured)');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text, html }),
  });
  if (!res.ok) {
    // Email failures must not break the request that triggered them.
    logger.error({ status: res.status, body: await res.text() }, 'Failed to send email');
  }
};

const layout = (title, body, cta) => `
<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
  <h2 style="margin:0 0 16px">${title}</h2>
  <p style="line-height:1.6">${body}</p>
  <p><a href="${cta.url}" style="display:inline-block;background:#f59e0b;color:#0b1120;padding:10px 18px;border-radius:8px;font-weight:700;text-decoration:none">${cta.label}</a></p>
  <p style="font-size:12px;color:#64748b">If the button doesn't work, open this link: ${cta.url}</p>
</div>`;

export const sendVerificationEmail = (user, token) => {
  const url = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to: user.email,
    subject: 'Verify your StudyTantra email',
    text: `Hi ${user.name}, verify your email: ${url}`,
    html: layout('Verify your email', `Hi ${user.name}, confirm this is your email address to secure your account.`, { url, label: 'Verify email' }),
  });
};

export const sendPasswordResetEmail = (user, token) => {
  const url = `${env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to: user.email,
    subject: 'Reset your StudyTantra password',
    text: `Reset your password (valid for 1 hour): ${url}\nIf you didn't request this, ignore this email.`,
    html: layout('Reset your password', 'This link is valid for 1 hour. If you didn\'t request a reset, you can ignore this email.', { url, label: 'Reset password' }),
  });
};
