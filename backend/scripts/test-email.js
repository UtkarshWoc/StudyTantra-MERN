import { sendEmail } from '../src/services/email.js';

const to = process.argv[2] || 'test@example.com';
console.log(`\nTesting StudyTantra Email Service...`);
console.log(`Recipient: ${to}\n`);

try {
  await sendEmail({
    to,
    subject: 'StudyTantra Email Service Test',
    text: 'Congratulations! Your StudyTantra email service with Nodemailer is working properly.',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
        <h2 style="color:#0f172a;margin-top:0">StudyTantra Email Test</h2>
        <p style="color:#334155;line-height:1.5">If you received this email, your Nodemailer email service is working properly!</p>
      </div>
    `,
  });
  console.log('Email test function finished.');
} catch (err) {
  console.error('Email test failed:', err);
}

