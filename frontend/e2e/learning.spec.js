import { test, expect } from '@playwright/test';

const samplePdf = () => {
  const stream = 'BT /F1 12 Tf 20 200 Td (Mitochondria produce ATP through cellular respiration) Tj ET';
  return Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 600 300]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
    `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream endobj\n` +
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R>>'
  );
};

const isoDaysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA');
};

test('spaced repetition, streak, planner and collections', async ({ page }) => {
  // Register and upload
  await page.goto('/register');
  await page.locator('#name').fill('Learner');
  await page.locator('#email').fill(`learn-${Date.now()}@example.com`);
  await page.locator('#password').fill('password123');
  await page.locator('#confirm').fill('password123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto('/documents');
  await page.getByRole('button', { name: /upload document/i }).first().click();
  await page.locator('input[type="file"]').setInputFiles({ name: 'cells.pdf', mimeType: 'application/pdf', buffer: samplePdf() });
  await expect(page.getByText(/^Ready/)).toBeVisible({ timeout: 20_000 });

  // Generate a deck, then review it with spaced repetition
  await page.goto('/flashcards');
  await page.getByRole('button', { name: /generate deck/i }).click();
  await expect(page.getByText('Mock question 1?')).toBeVisible();
  await page.getByRole('link', { name: /review with spaced repetition/i }).click();
  await expect(page).toHaveURL(/\/review\?document=/);
  await expect(page.getByRole('button', { name: 'Show answer' })).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.getByText('Mock answer 1.')).toBeVisible();
  await page.getByRole('button', { name: /^Good/ }).click();
  await expect(page.getByText(/1 done/)).toBeVisible();

  // Dashboard reflects the study session
  await page.goto('/dashboard');
  await expect(page.getByText('1 day', { exact: true })).toBeVisible();
  await expect(page.getByRole('meter', { name: 'Cards reviewed today' })).toHaveAttribute('aria-valuenow', '1');
  await expect(page.getByRole('img', { name: /study activity over the last year/i })).toBeVisible();

  // Study plan
  await page.goto('/planner');
  await page.getByRole('button', { name: /new plan/i }).click();
  await page.locator('#plan-title').fill('Biology final');
  await page.locator('#plan-exam').fill(isoDaysFromNow(4));
  await page.getByRole('button', { name: 'cells', exact: true }).click();
  await page.getByRole('button', { name: /create plan/i }).click();
  await expect(page.getByRole('heading', { name: 'Biology final' })).toBeVisible();
  await page.getByRole('checkbox').first().check();
  await expect(page.getByText(/1\/\d+ done/)).toBeVisible();

  // Collection with cross-document chat
  await page.goto('/documents');
  await page.getByRole('button', { name: /new collection/i }).click();
  await page.getByLabel('Collection name').fill('Biology');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByLabel('Collection for cells').selectOption({ label: 'Biology' });
  await page.getByRole('button', { name: /^Biology · 1/ }).click();
  await page.getByRole('link', { name: /open/i }).click();
  await expect(page.getByRole('heading', { name: /Biology/ })).toBeVisible();
  await page.getByLabel('Ask a question').fill('What produces ATP?');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText(/Mock response based on the document/)).toBeVisible();
  await expect(page.getByRole('button', { name: /cells · p\. 1/ })).toBeVisible();
});
