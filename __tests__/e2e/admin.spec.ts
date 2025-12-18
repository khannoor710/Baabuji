import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const ADMIN_EMAIL = 'admin@baabuji.com';
const ADMIN_PASSWORD = 'Admin123!';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Login as admin user
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to account page
  await page.waitForURL(/\/account/, { timeout: 10000 });
}

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should access admin dashboard with admin role', async ({ page }) => {
    await page.goto('/admin');
    
    // Should not redirect to login (user is authenticated with ADMIN role)
    await expect(page).toHaveURL('/admin');
    
    // Check for admin dashboard heading
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should see admin statistics on dashboard', async ({ page }) => {
    await page.goto('/admin');
    
    // Check for key metrics
    await expect(page.locator('text=/Total Orders/i')).toBeVisible();
    await expect(page.locator('text=/Total Revenue/i')).toBeVisible();
  });
});

test.describe('Admin - Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should list all products', async ({ page }) => {
    await page.goto('/admin/products');
    
    await expect(page.locator('h1')).toContainText('Products');
    
    // Should see product table or grid
    await expect(page.locator('[data-testid=\"product-list\"]').first()).toBeVisible();
  });

  test('should navigate to new product form', async ({ page }) => {
    await page.goto('/admin/products');
    
    // Click "Add Product" button
    await page.click('text=/Add Product|New Product/i');
    
    // Should navigate to new product page
    await expect(page).toHaveURL('/admin/products/new');
    await expect(page.locator('h1')).toContainText('Create Product');
  });

  test('should show validation errors on invalid product submission', async ({ page }) => {
    await page.goto('/admin/products/new');
    
    // Submit form without filling required fields
    await page.click('button[type=\"submit\"]');
    
    // Should see validation errors
    await expect(page.locator('text=/required|invalid/i').first()).toBeVisible();
  });

  test('should delete product', async ({ page }) => {
    await page.goto('/admin/products');
    
    // Get product count before deletion
    const productCountBefore = await page.locator('[data-testid=\"product-list\"]').count();
    
    if (productCountBefore > 0) {
      // Click delete button
      await page.click('[data-testid=\"delete-product-btn\"]');
      
      // Confirm deletion in modal/dialog
      await page.click('button:has-text(\"Confirm\")');
      
      // Wait for deletion to complete
      await page.waitForTimeout(1000);
      
      // Verify product count decreased
      const productCountAfter = await page.locator('[data-testid=\"product-list\"]').count();
      expect(productCountAfter).toBeLessThan(productCountBefore);
    }
  });
});

test.describe('Admin - Order Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should list all orders', async ({ page }) => {
    await page.goto('/admin/orders');
    
    await expect(page.locator('h1')).toContainText('Orders');
    
    // Should see order table
    await expect(page.locator('[data-testid=\"orders-table\"]')).toBeVisible();
  });

  test('should view order details', async ({ page }) => {
    await page.goto('/admin/orders');
    
    // Click on first order if exists
    const orderCount = await page.locator('[data-testid=\"view-order-btn\"]').count();
    
    if (orderCount > 0) {
      await page.click('[data-testid=\"view-order-btn\"]');
      
      // Should see order details
      await expect(page.locator('text=/Order Number/i')).toBeVisible();
      await expect(page.locator('text=/Customer/i')).toBeVisible();
      await expect(page.locator('text=/Total/i')).toBeVisible();
    }
  });
});

test.describe('Admin - Access Control', () => {
  test('should deny access to unauthenticated users', async ({ page }) => {
    // Try to access admin without logging in
    await page.goto('/admin');
    
    // Should redirect to login (middleware redirects to /login)
    await expect(page).toHaveURL(/\/login/);
  });
});
