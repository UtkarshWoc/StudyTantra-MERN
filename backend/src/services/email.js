import nodemailer from 'nodemailer';
import { env, isTest, isProd } from '../config/env.js';
import { logger } from '../config/logger.js';

// Sent emails are kept here in tests so specs can read links out of them.
export const testOutbox = [];

let smtpTransporter = null;
const getSmtpTransporter = () => {
  if (smtpTransporter) return smtpTransporter;

  const service = env.SMTP_SERVICE || env.EMAIL_SERVICE;
  const user = env.SMTP_USER || env.EMAIL_USER;
  const pass = env.SMTP_PASS || env.EMAIL_PASS;
  const host = env.SMTP_HOST;
  const port = env.SMTP_PORT || (env.SMTP_SECURE ? 465 : 587);

  if (service || (user && user.includes('@gmail.com'))) {
    if (!user || !pass) return null;
    smtpTransporter = nodemailer.createTransport({
      service: service || 'gmail',
      auth: { user, pass },
    });
  } else if (host) {
    smtpTransporter = nodemailer.createTransport({
      host,
      port,
      secure: Boolean(env.SMTP_SECURE),
      auth: user ? { user, pass } : undefined,
    });
  } else if (user && pass) {
    smtpTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return smtpTransporter;
};

const printDevFallback = (to, subject, text, reason = '') => {
  const line = '═'.repeat(68);
  console.log(`\n${line}`);
  console.log(`  📩 [STUDYTANTRA EMAIL DEV FALLBACK]`);
  console.log(`${line}`);
  console.log(`  To:      ${to}`);
  console.log(`  Subject: ${subject}`);
  if (reason) console.log(`  Reason:  ${reason}`);
  console.log(`  Content:`);
  console.log(`  ${text.replace(/\n/g, '\n  ')}`);
  console.log(`${line}\n`);
};

/**
 * Send a transactional email.
 * Priority:
 * 1. Test environment -> testOutbox
 * 2. Nodemailer (Gmail / SMTP) if configured
 * 3. Resend API if RESEND_API_KEY is configured
 * 4. Dev console fallback if neither is configured or if delivery fails
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  if (isTest) {
    testOutbox.push({ to, subject, text, html });
    return;
  }

  // 1. Check if Nodemailer (SMTP / Gmail) is configured
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const smtpUser = env.SMTP_USER || env.EMAIL_USER;
      const from = (smtpUser && env.EMAIL_FROM.includes('onboarding@resend.dev'))
        ? `StudyTantra <${smtpUser}>`
        : env.EMAIL_FROM;

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      logger.info({ to, subject, messageId: info.messageId }, 'Email sent via Nodemailer');
      return;
    } catch (err) {
      logger.error({ err: err.message, to, subject }, 'Failed to send email via Nodemailer');
      if (!isProd) {
        printDevFallback(to, subject, text, `Nodemailer delivery failed: ${err.message}`);
      }
      return;
    }
  }

  // 2. Check if Resend is configured
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text, html }),
      });
      if (res.ok) {
        logger.info({ to, subject }, 'Email sent via Resend');
        return;
      }

      const errText = await res.text();
      let errMsg = errText;
      try {
        const json = JSON.parse(errText);
        errMsg = json.message || errText;
      } catch {}

      logger.error({ status: res.status, body: errMsg }, 'Failed to send email via Resend');

      if (!isProd) {
        const isSandboxError = res.status === 403 || res.status === 422;
        const reason = isSandboxError
          ? `Resend sandbox restriction (only sends to account owner email). Add a verified domain at resend.com or use Nodemailer/Gmail.`
          : `Resend error: ${errMsg}`;
        printDevFallback(to, subject, text, reason);
      }
    } catch (err) {
      logger.error({ err: err.message }, 'Resend request failed');
      if (!isProd) {
        printDevFallback(to, subject, text, `Resend connection failed: ${err.message}`);
      }
    }
    return;
  }

  // 3. Fallback when neither Nodemailer nor Resend is configured
  logger.info({ to, subject, text }, 'Email (not sent: no email provider configured)');
  if (!isProd) {
    printDevFallback(to, subject, text, 'No email provider configured (local development)');
  }
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// All interpolated values are escaped — user-controlled names must not inject markup/links.
const layout = (title, body, cta) => `
<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
  <h2 style="margin:0 0 16px">${escapeHtml(title)}</h2>
  <p style="line-height:1.6">${escapeHtml(body)}</p>
  <p><a href="${escapeHtml(cta.url)}" style="display:inline-block;background:#f59e0b;color:#0b1120;padding:10px 18px;border-radius:8px;font-weight:700;text-decoration:none">${escapeHtml(cta.label)}</a></p>
  <p style="font-size:12px;color:#64748b">If the button doesn't work, open this link: ${escapeHtml(cta.url)}</p>
</div>`;

export const sendVerificationEmail = (user, token, to = user.email) => {
  const url = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to,
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
