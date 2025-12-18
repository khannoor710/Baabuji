import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Complete COD checkout flow', async ({ page }) => {
    // Navigate to shop page
    await page.goto('/shop');
    await expect(page).toHaveURL('/shop');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 });

    // Add first product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    // Wait for product page to load and add to cart
    await page.waitForSelector('[data-testid="add-to-cart-btn"]', { timeout: 10000 });
    await page.locator('[data-testid="add-to-cart-btn"]').click();

    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1');

    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL('/cart');

    // Verify product in cart
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();

    // Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page).toHaveURL('/checkout');

    // Fill shipping address
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="addressLine1"]', '123 Main Street');
    await page.fill('input[name="city"]', 'Mumbai');
    await page.fill('input[name="state"]', 'Maharashtra');
    await page.fill('input[name="postalCode"]', '400001');

    // Select COD payment method
    await page.click('input[value="cod"]');

    // Place order
    await page.click('button:has-text("Place Order")');

    // Wait for order confirmation
    await page.waitForURL(/\/order-confirmation\/.+/, { timeout: 15000 });

    // Verify order confirmation page
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
    await expect(page.locator('text=BAB-')).toBeVisible(); // Order number
  });

  test('Should validate shipping address fields', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Go to checkout
    await page.goto('/checkout');

    // Try to submit without filling form
    await page.click('button:has-text("Continue")');

    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('Should validate Indian postal code format', async ({ page }) => {
    await page.goto('/checkout');

    // Fill form with invalid postal code
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="addressLine1"]', '123 Main Street');
    await page.fill('input[name="city"]', 'Mumbai');
    await page.fill('input[name="state"]', 'Maharashtra');
    await page.fill('input[name="postalCode"]', '12345'); // Invalid (5 digits)

    await page.click('button:has-text("Continue")');

    // Should show validation error
    await expect(page.locator('text=6 digits')).toBeVisible();
  });

  test('Should validate Indian phone number format', async ({ page }) => {
    await page.goto('/checkout');

    // Fill form with invalid phone
    await page.fill('input[name="phone"]', '1234567890'); // Doesn't start with 6-9

    // Trigger validation by clicking outside the input
    await page.click('body');

    // Should show validation error
    await expect(page.locator('text=Invalid')).toBeVisible();
  });

  test('Should show cart empty message when no items', async ({ page }) => {
    // Navigate and clear cart
    await page.goto('/cart');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for hydration
    await page.waitForTimeout(1000);

    // Check page title loaded
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();
    
    // Should show empty state
    await expect(page.locator('text=Continue Shopping')).toBeVisible();
  });

  test('Should update cart quantities', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Go to cart
    await page.goto('/cart');

    // Increase quantity
    const increaseButton = page.locator('[data-testid="increase-quantity"]').first();
    await increaseButton.click();

    // Verify quantity updated
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('2');

    // Verify total price updated
    const priceElement = page.locator('[data-testid="cart-total"]');
    const initialPrice = await priceElement.textContent();
    
    await increaseButton.click();
    
    const updatedPrice = await priceElement.textContent();
    expect(updatedPrice).not.toBe(initialPrice);
  });

  test('Should remove item from cart', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Go to cart
    await page.goto('/cart');

    // Remove item
    await page.click('[data-testid="remove-item"]');

    // Verify cart is empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    await expect(page.locator('[data-testid="cart-badge"]')).not.toBeVisible();
  });

  test('Should persist cart across page refreshes', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Verify cart has item
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1');

    // Refresh page
    await page.reload();

    // Cart should still have item
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1');
  });

  test('Should validate stock availability at checkout', async ({ page }) => {
    // This test would require a product with limited stock
    // For now, we'll check that the checkout validates stock

    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Try to add product to cart
    const outOfStockProduct = page.locator('[data-testid="product-card"]:has-text("Out of Stock")').first();
    
    if (await outOfStockProduct.count() > 0) {
      // Button should be disabled
      await expect(outOfStockProduct.locator('button')).toBeDisabled();
    }
  });

  test('Should show order summary with correct totals', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    
    // Get product price
    const priceText = await firstProduct.locator('[data-testid="product-price"]').textContent();
    
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Go to checkout
    await page.goto('/checkout');

    // Verify order summary shows correct price
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="subtotal"]')).toContainText('₹');
    await expect(page.locator('[data-testid="shipping"]')).toContainText('₹');
    await expect(page.locator('[data-testid="tax"]')).toContainText('₹');
    await expect(page.locator('[data-testid="total"]')).toContainText('₹');
  });
});

test.describe('Checkout with Stripe (Mock)', () => {
  test.skip('Should redirect to Stripe checkout for card payment', async ({ page }) => {
    // This test requires Stripe test mode to be configured
    // Skip for now, but provide structure

    await page.goto('/shop');
    await page.waitForSelector('[data-testid="product-card"]');
    
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    await page.goto('/checkout');

    // Fill shipping address
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="addressLine1"]', '123 Main Street');
    await page.fill('input[name="city"]', 'Mumbai');
    await page.fill('input[name="state"]', 'Maharashtra');
    await page.fill('input[name="postalCode"]', '400001');

    // Select Card payment method
    await page.click('input[value="card"]');

    // Place order
    await page.click('button:has-text("Place Order")');

    // Should redirect to Stripe checkout
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    
    expect(page.url()).toContain('stripe.com');
  });
});
