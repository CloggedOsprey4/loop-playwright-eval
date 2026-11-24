# Loop Technical Evaluation: Data-Driven Playwright Suite

Playwright + TypeScript tests for the demo project board app. All six scenarios run from a single test body that loops over `data/testCases.json`.

## Structure

```
data/testCases.json   # test data: project, task, expected column, expected tags
pages/LoginPage.ts    # page object for the login form
pages/BoardPage.ts    # page object for projects, columns, task cards and tags
tests/board.spec.ts   # data-driven spec: one test generated per JSON entry
playwright.config.ts  # baseURL, reporters, browser
```

## Run it

```bash
npm install
npx playwright install chromium
npx playwright test
npx playwright show-report   # optional HTML report
```

## Adding a test case

Add an object to `data/testCases.json`

```json
{ "id": 7, "project": "Web Application", "task": "API integration", "column": "Review", "tags": ["Feature", "High Priority"] }
```

## Design notes

- **Data-driven:** a `for...of` loop over the JSON generates one named test per case.
- **Login in `beforeEach`:** written once, and it asserts the Logout button appears so a failed login fails fast.
- **Scoped locators:** the task card is searched only inside its expected column, so a task in the wrong column fails.
- **Exact tag check:** `toHaveText([...])` compares the full tag list, catching both missing and unexpected tags.
- **User-facing locators:** labels, roles and headings instead of CSS classes, since the app has no test IDs.
