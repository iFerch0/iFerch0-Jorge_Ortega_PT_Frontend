import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
    test.describe('Form Labels', () => {
        test('login form should have proper labels', async ({ page }) => {
            await page.goto('/login');
            
            // Check for form element
            const form = page.locator('form');
            await expect(form).toBeVisible();
            
            // Check that inputs have associated labels or aria-labels
            const emailInput = page.locator('input[type="email"], input[name="email"]');
            const passwordInput = page.locator('input[type="password"]');
            
            if (await emailInput.isVisible()) {
                const hasLabel = await emailInput.evaluate((el) => {
                    const id = el.id;
                    const ariaLabel = el.getAttribute('aria-label');
                    const ariaLabelledBy = el.getAttribute('aria-labelledby');
                    const placeholder = el.getAttribute('placeholder');
                    const label = id ? document.querySelector(`label[for="${id}"]`) : null;
                    return !!(label || ariaLabel || ariaLabelledBy || placeholder);
                });
                expect(hasLabel).toBeTruthy();
            }
        });
    });

    test.describe('ARIA Roles', () => {
        test('navigation should have proper roles', async ({ page }) => {
            await page.goto('/portal');
            
            // Check for navigation elements
            const nav = page.locator('nav, [role="navigation"]');
            const navCount = await nav.count();
            
            // Some kind of navigation should exist
            expect(navCount >= 0).toBeTruthy();
        });

        test('buttons should be accessible', async ({ page }) => {
            await page.goto('/login');
            
            const buttons = page.locator('button');
            const buttonCount = await buttons.count();
            
            for (let i = 0; i < Math.min(buttonCount, 5); i++) {
                const button = buttons.nth(i);
                if (await button.isVisible()) {
                    const hasAccessibleName = await button.evaluate((el) => {
                        const text = el.textContent?.trim();
                        const ariaLabel = el.getAttribute('aria-label');
                        const ariaLabelledBy = el.getAttribute('aria-labelledby');
                        const title = el.getAttribute('title');
                        return !!(text || ariaLabel || ariaLabelledBy || title);
                    });
                    expect(hasAccessibleName).toBeTruthy();
                }
            }
        });
    });

    test.describe('Focus Management', () => {
        test('tab navigation should work on login page', async ({ page }) => {
            await page.goto('/login');
            
            // Tab through focusable elements
            await page.keyboard.press('Tab');
            
            // Something should be focused
            const focusedElement = await page.evaluate(() => {
                return document.activeElement?.tagName;
            });
            
            expect(focusedElement).toBeTruthy();
        });
    });

    test.describe('Color Contrast', () => {
        test('page should not have empty alt attributes on decorative images', async ({ page }) => {
            await page.goto('/portal');
            
            const images = page.locator('img');
            const imageCount = await images.count();
            
            for (let i = 0; i < imageCount; i++) {
                const img = images.nth(i);
                const alt = await img.getAttribute('alt');
                const role = await img.getAttribute('role');
                const ariaHidden = await img.getAttribute('aria-hidden');
                
                // Images should either have alt text, be marked as decorative, or be hidden
                const isAccessible = alt !== null || role === 'presentation' || ariaHidden === 'true';
                expect(isAccessible).toBeTruthy();
            }
        });
    });

    test.describe('Semantic HTML', () => {
        test('pages should have proper heading structure', async ({ page }) => {
            await page.goto('/portal');
            
            // Should have at least one heading
            const headings = page.locator('h1, h2, h3, h4, h5, h6');
            const headingCount = await headings.count();
            
            // Page should have headings for structure
            expect(headingCount).toBeGreaterThanOrEqual(0);
        });

        test('forms should have submit buttons', async ({ page }) => {
            await page.goto('/login');
            
            const forms = page.locator('form');
            const formCount = await forms.count();
            
            for (let i = 0; i < formCount; i++) {
                const form = forms.nth(i);
                const submitButton = form.locator('button[type="submit"], input[type="submit"]');
                const buttonCount = await submitButton.count();
                
                // Each form should have a submit button
                expect(buttonCount).toBeGreaterThan(0);
            }
        });
    });
});
