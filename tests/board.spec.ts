import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import testCases from '../data/testCases.json';

// Demo credentials from the evaluation doc. Environment variables can override them.
const USERNAME = process.env.APP_USERNAME ?? 'admin';
const PASSWORD = process.env.APP_PASSWORD ?? 'password123';

test.describe('Project board: task placement and tags', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
  });

  // One test body, six rows of data. Adding a new case means adding a JSON object, not new code.
  for (const tc of testCases) {
    test(`TC${tc.id}: "${tc.task}" is in "${tc.column}" on ${tc.project}`, async ({ page }) => {
      const board = new BoardPage(page);

      await test.step(`Open project "${tc.project}"`, async () => {
        await board.openProject(tc.project);
      });

      const card = board.taskCard(tc.column, tc.task);

      await test.step(`Verify task is in the "${tc.column}" column`, async () => {
        await expect(card).toBeVisible();
      });

      await test.step(`Verify tags: ${tc.tags.join(', ')}`, async () => {
        // Exact list match: fails on a missing tag AND on an unexpected extra tag.
        await expect(board.tags(card)).toHaveText(tc.tags);
      });
    });
  }
});
