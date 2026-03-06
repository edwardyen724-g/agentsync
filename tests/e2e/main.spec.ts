import { test, expect } from '@playwright/test';

test.describe('AgentSync End-to-End Tests', () => {
  
  test.describe('User Authentication', () => {
    test('should allow user to log in securely', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      await page.click('text=Login');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('text=Submit');
      await expect(page).toHaveURL('http://localhost:3000/dashboard');
    });

    test('should allow user to reset password', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      await page.click('text=Login');
      await page.click('text=Forgot Password?');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.click('text=Send Reset Link');
      await expect(page.locator('text=Reset link sent!')).toBeVisible();
    });
  });

  test.describe('Dashboard Task Overview', () => {
    test('should display all current tasks and allow filtering', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await expect(page.locator('text=Current Tasks')).toBeVisible();
      await expect(page.locator('.task-card')).toHaveCount(5); // Assuming there are 5 tasks
      await page.selectOption('select[name="filterByAgent"]', 'Agent1');
      await expect(page.locator('.task-card')).toHaveCount(2); // Assuming 2 tasks for selected agent 
    });

    test('should update dashboard in real-time', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await expect(page.locator('text=Task 1')).toBeVisible();
      await page.waitForTimeout(5000); // Simulate waiting for a task to complete
      await expect(page.locator('text=Task 1 completed')).toBeVisible(); // Confirmation for task completion
    });
  });

  test.describe('Pre-built Workflow Templates', () => {
    test('should display available templates and allow customization', async ({ page }) => {
      await page.goto('http://localhost:3000/templates');
      await expect(page.locator('.template-card')).toHaveCount(5); // Checking for 5 templates
      await page.click('.template-card:first-child button');
      await page.fill('input[name="templateName"]', 'Customized Template');
      await page.click('text=Deploy Template');
      await expect(page.locator('text=Template deployed successfully!')).toBeVisible();
    });
  });

  test.describe('Customizable Automation Triggers', () => {
    test('should allow user to create and manage triggers', async ({ page }) => {
      await page.goto('http://localhost:3000/settings');
      await page.click('text=Automation Triggers');
      await page.click('text=Create New Trigger');
      await page.fill('input[name="triggerName"]', 'New Trigger');
      await page.click('text=Save Trigger');
      await expect(page.locator('text=Trigger created successfully!')).toBeVisible();
      await page.check('input[name="triggerEnabled"]');
      await expect(page.locator('text=Trigger is active')).toBeVisible();
    });
  });

  test.describe('AI Tool Integrations', () => {
    test('should allow integration with popular AI tools', async ({ page }) => {
      await page.goto('http://localhost:3000/settings');
      await page.click('text=Integrations');
      await page.selectOption('select[name="aiTool"]', 'Tool 1');
      await page.click('text=Connect');
      await expect(page.locator('text=Connected to Tool 1!')).toBeVisible();
    });
  });

  test.describe('Notification System', () => {
    test('should allow users to customize notification preferences', async ({ page }) => {
      await page.goto('http://localhost:3000/settings');
      await page.click('text=Notifications');
      await page.check('input[name="emailNotifications"]');
      await page.click('text=Save Preferences');
      await expect(page.locator('text=Preferences saved successfully!')).toBeVisible();
    });
  });

  test.describe('Subscription Management', () => {
    test('should allow user to view and manage subscription', async ({ page }) => {
      await page.goto('http://localhost:3000/settings');
      await page.click('text=Subscription');
      await expect(page.locator('text=Your Plan: Basic')).toBeVisible();
      await page.click('text=Upgrade Plan');
      await expect(page.locator('text=Choose your plan')).toBeVisible();
      await page.click('text=Confirm Upgrade');
      await expect(page.locator('text=Subscription updated successfully!')).toBeVisible();
    });
  });
});