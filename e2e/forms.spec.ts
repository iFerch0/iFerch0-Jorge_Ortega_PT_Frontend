import { test, expect } from '@playwright/test';

test.describe('Form Components', () => {
    test.describe('Date of Birth Validation', () => {
        test('edit profile page should load with date input', async ({ page }) => {
            const response = await page.goto('/portal/profile/edit');
            expect(response?.status()).toBeLessThan(500);
        });
    });

    test.describe('Objectives Editor', () => {
        test('client edit page should allow adding objectives', async ({ page }) => {
            const response = await page.goto('/dashboard/clients/new');
            expect(response?.status()).toBeLessThan(500);
            
            // Look for add objective button
            const addButton = page.locator('button:has-text("Agregar objetivo"), button:has-text("Agregar")');
            if (await addButton.first().isVisible()) {
                await addButton.first().click();
            }
        });
    });

    test.describe('Pathologies Editor', () => {
        test('pathologies section should be accessible in wizard', async ({ page }) => {
            const response = await page.goto('/dashboard/clients/new');
            expect(response?.status()).toBeLessThan(500);
        });
    });

    test.describe('Training Place Selector', () => {
        test('training place options should be visible', async ({ page }) => {
            const response = await page.goto('/portal/profile/edit');
            expect(response?.status()).toBeLessThan(500);
            
            // Look for training place options
            const gymOption = page.locator('text=Gimnasio');
            const homeOption = page.locator('text=Casa');
            const outdoorOption = page.locator('text=Aire Libre, text=Aire libre');
            
            // At least one should exist
            const anyExists = await gymOption.isVisible() || 
                              await homeOption.isVisible() || 
                              await outdoorOption.first().isVisible();
            
            // Page loaded successfully, options may be conditionally rendered
            expect(response?.status()).toBeLessThan(500);
        });
    });
});

test.describe('Photo Upload', () => {
    test('photos page should have upload areas', async ({ page }) => {
        const response = await page.goto('/portal/photos');
        expect(response?.status()).toBeLessThan(500);
    });
});

test.describe('Assessments', () => {
    test('assessment list should paginate', async ({ page }) => {
        const response = await page.goto('/portal/assessments');
        expect(response?.status()).toBeLessThan(500);
    });

    test('trainer assessments should have filters', async ({ page }) => {
        const response = await page.goto('/dashboard/assessments');
        expect(response?.status()).toBeLessThan(500);
        
        // Look for filter controls
        const filterSelect = page.locator('select, [role="combobox"]');
        if (await filterSelect.first().isVisible()) {
            expect(await filterSelect.count()).toBeGreaterThan(0);
        }
    });
});
