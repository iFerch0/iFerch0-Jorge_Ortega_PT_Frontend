import { test, expect } from '@playwright/test';

test.describe('Client Onboarding Wizard', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to login page first
        await page.goto('/login');

        // Fill in login form (using mock credentials for test structure)
        // In a real scenario, you'd use a setup file or environment variables
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for navigation to dashboard - adjust selector based on actual dashboard content
        // validation step: await expect(page).toHaveURL('/dashboard');
    });

    test('should complete the onboarding wizard flow', async ({ page }) => {
        // Navigate to New Client page
        await page.goto('/dashboard/clients/new');

        // Step 1: Personal Data
        await expect(page.getByText('Datos Personales')).toBeVisible();
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
        await page.fill('input[name="phone"]', '+573001234567');
        await page.fill('input[name="age"]', '30');
        // Select gender
        await page.click('button[role="combobox"]');
        await page.click('div[role="option"]:has-text("Masculino")');

        await page.fill('input[name="height"]', '175');
        await page.fill('input[name="weight"]', '75');
        await page.click('button:has-text("Siguiente")');

        // Step 2: Objectives
        await expect(page.getByText('Objetivos')).toBeVisible();
        // Select an objective card (assuming cards are clickable)
        // await page.click('text=Perder Grasa'); 
        await page.click('button:has-text("Siguiente")');

        // Step 3: Pathologies (assuming checkboxes)
        await expect(page.getByText('Valoración Física')).toBeVisible();
        // Check none or skip
        await page.click('button:has-text("Siguiente")');

        // Step 4: Bioimpedancia
        await expect(page.getByText('Bioimpedancia')).toBeVisible();
        await page.fill('input[name="bodyFat"]', '20');
        await page.fill('input[name="muscleMass"]', '60');
        await page.click('button:has-text("Siguiente")');

        // Step 5: Photos
        await expect(page.getByText('Fotos')).toBeVisible();
        // Skip photo upload for now or simulate it
        await page.click('button:has-text("Saltar este paso")');

        // Step 6: Review
        await expect(page.getByText('Resumen')).toBeVisible();
        await page.click('button:has-text("Confirmar y Crear Cliente")');

        // Verification: Should disable button and show loading or redirect
        // await expect(page).toHaveURL(/\/dashboard\/clients\/.+/);
    });
});
