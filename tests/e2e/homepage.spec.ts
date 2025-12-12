import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.locator('header')).toContainText('SKINCARE & WELLNESS');
    
    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    
    // Click blog link
    await page.click('a[href="/blog"]');
    
    // Verify we're on blog page
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('h1')).toContainText('All Articles');
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');
    
    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Categories');
  });
});
