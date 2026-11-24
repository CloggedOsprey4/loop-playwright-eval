import { expect, type Locator, type Page } from '@playwright/test';

export class BoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Click a project in the left sidebar and confirm the board switched to it. */
  async openProject(projectName: string) {
    await this.page.getByRole('button', { name: projectName }).click();
    await expect(this.page.getByRole('heading', { level: 1, name: projectName })).toBeVisible();
  }

  /**
   * A column is the container that holds a level-2 heading like "To Do (2)".
   * Matching on the start of the heading ignores the task count in parentheses.
   */
  column(columnName: string): Locator {
    return this.page
      .getByRole('heading', { level: 2, name: new RegExp(`^${columnName}\\b`) })
      .locator('..');
  }

  /** A task card is the container around its level-3 title, searched only inside the given column. */
  taskCard(columnName: string, taskTitle: string): Locator {
    return this.column(columnName)
      .getByRole('heading', { level: 3, name: taskTitle, exact: true })
      .locator('..');
  }

  /** Tags are the pill <span>s in the first <div> directly under the card. */
  tags(card: Locator): Locator {
    return card.locator(':scope > div').first().locator('span');
  }
}
