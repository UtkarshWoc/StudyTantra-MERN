import { test, expect } from '@playwright/test';

// Smallest valid one-page PDF with extractable text.
const samplePdf = () => {
  const stream = 'BT /F1 12 Tf 20 200 Td (Photosynthesis converts light energy into chemical energy) Tj ET';
  return Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 600 300]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
    `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream endobj\n` +
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R>>'
  );
};

test('register → upload → flashcards → quiz', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  // Register
  await page.goto('/register');
  await page.locator('#name').fill('E2E Student');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill('password123');
  await page.locator('#confirm').fill('password123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // Session survives a reload (refresh cookie, no token in localStorage)
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard/);
  expect(await page.evaluate(() => localStorage.getItem('userInfo'))).toBeNull();

  // Upload a PDF
  await page.goto('/documents');
  await page.getByRole('button', { name: /upload document/i }).first().click();
  await page.locator('input[type="file"]').setInputFiles({ name: 'biology.pdf', mimeType: 'application/pdf', buffer: samplePdf() });
  await expect(page).toHaveURL(/\/documents\/[a-f0-9]{24}$/, { timeout: 15_000 });

  // Background processing finishes, then chat answers with a page citation
  await expect(page.getByText(/^Ready/)).toBeVisible({ timeout: 20_000 });
  await page.getByLabel('Ask a question').fill('What does photosynthesis convert?');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText(/Mock response based on the document/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'p. 1' }).first()).toBeVisible();

  // Flashcards (mock AI)
  await page.goto('/flashcards');
  await page.getByRole('button', { name: /generate deck/i }).click();
  await expect(page.getByText('Mock question 1?')).toBeVisible();

  // Quiz: answer every question with "A" (the mock's correct option)
  await page.goto('/quizzes');
  await page.getByRole('button', { name: /generate new quiz/i }).click();
  await page.getByRole('button', { name: /start quiz/i }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'A', exact: true }).click();
    await page.getByRole('button', { name: /submit answer/i }).click();
    await expect(page.getByText('Correct!')).toBeVisible();
    await page.getByRole('button', { name: i < 4 ? /next question/i : /view results/i }).click();
  }
  await expect(page.getByText(/you scored 5 out of 5/i)).toBeVisible();

  // Sign out returns to login and the session is gone after reload
  await page.getByRole('button', { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

test('wrong password shows an error without reloading', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill('nobody@example.com');
  await page.locator('#password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Invalid email or password')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});
