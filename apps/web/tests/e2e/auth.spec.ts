import { test, expect } from '@playwright/test';

test('signup redirects to dashboard and shows welcome text', async ({ page }) => {
  const seed = Date.now();
  const username = `user${seed}`;

  await page.goto('/signup');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Email').fill(`user${seed}@example.com`);
  await page.getByLabel('Password').fill('password1234');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(`Welcome ${username}`)).toBeVisible();
});

test('login redirects to dashboard and shows welcome text', async ({ page, request }) => {
  const seed = Date.now() + 1;
  const username = `user${seed}`;
  const email = `user${seed}@example.com`;
  const password = 'password1234';

  // Ensure user exists
  await request.post('http://localhost:3001/auth/signup', {
    data: { username, email, password },
  });

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(`Welcome ${username}`)).toBeVisible();
});
