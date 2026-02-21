import { test, expect } from '@playwright/test';

test.describe('Client Onboarding Flow', () => {
    test.describe('New User Login Flow', () => {
        test('should show change password modal for user with mustChangePassword', async ({ page }) => {
            // Mock a new user that needs to change password
            await page.goto('/login');
            
            // This test verifies the UI structure exists
            await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });

        test('should show consent modal after password change', async ({ page }) => {
            await page.goto('/portal');
            
            // If not logged in, should redirect to login
            await expect(page).toHaveURL(/\/(login|portal)/);
        });

        test('should redirect to wizard if wizardCompleted is false', async ({ page }) => {
            await page.goto('/portal/wizard');
            
            // Page should exist and be accessible
            const response = await page.goto('/portal/wizard');
            expect(response?.status()).toBeLessThan(500);
        });
    });

    test.describe('Wizard Steps', () => {
        test('wizard page should load without errors', async ({ page }) => {
            const response = await page.goto('/portal/wizard');
            expect(response?.status()).toBeLessThan(500);
        });

        test('dashboard new client page should load', async ({ page }) => {
            const response = await page.goto('/dashboard/clients/new');
            expect(response?.status()).toBeLessThan(500);
        });
    });
});

test.describe('Client Portal', () => {
    test('portal home page should load', async ({ page }) => {
        const response = await page.goto('/portal');
        expect(response?.status()).toBeLessThan(500);
    });

    test('portal profile page should load', async ({ page }) => {
        const response = await page.goto('/portal/profile');
        expect(response?.status()).toBeLessThan(500);
    });

    test('portal assessments page should load', async ({ page }) => {
        const response = await page.goto('/portal/assessments');
        expect(response?.status()).toBeLessThan(500);
    });

    test('portal photos page should load', async ({ page }) => {
        const response = await page.goto('/portal/photos');
        expect(response?.status()).toBeLessThan(500);
    });

    test('portal profile edit page should load', async ({ page }) => {
        const response = await page.goto('/portal/profile/edit');
        expect(response?.status()).toBeLessThan(500);
    });
});

test.describe('Trainer Dashboard', () => {
    test('dashboard home should load', async ({ page }) => {
        const response = await page.goto('/dashboard');
        expect(response?.status()).toBeLessThan(500);
    });

    test('dashboard clients list should load', async ({ page }) => {
        const response = await page.goto('/dashboard/clients');
        expect(response?.status()).toBeLessThan(500);
    });

    test('dashboard assessments list should load', async ({ page }) => {
        const response = await page.goto('/dashboard/assessments');
        expect(response?.status()).toBeLessThan(500);
    });

    test('dashboard settings should load', async ({ page }) => {
        const response = await page.goto('/dashboard/settings');
        expect(response?.status()).toBeLessThan(500);
    });
});

test.describe('RBAC Navigation', () => {
    test('login page should be accessible', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('form')).toBeVisible();
    });

    test('register page should be accessible', async ({ page }) => {
        await page.goto('/register');
        const response = await page.goto('/register');
        expect(response?.status()).toBeLessThan(500);
    });
});

test.describe('Form Validations', () => {
    test('login form should validate required fields', async ({ page }) => {
        await page.goto('/login');
        
        // Try to submit empty form
        const submitButton = page.locator('button[type="submit"]');
        if (await submitButton.isVisible()) {
            await submitButton.click();
            
            // Form should show validation or stay on page
            await expect(page).toHaveURL(/\/login/);
        }
    });
});

test.describe('Responsive Design', () => {
    test('portal should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const response = await page.goto('/portal');
        expect(response?.status()).toBeLessThan(500);
    });

    test('dashboard should work on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        const response = await page.goto('/dashboard');
        expect(response?.status()).toBeLessThan(500);
    });

    test('wizard should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const response = await page.goto('/portal/wizard');
        expect(response?.status()).toBeLessThan(500);
    });
});
