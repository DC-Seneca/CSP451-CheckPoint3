Below is a **ready-to-use “seeding repo” plan** plus a **student exercise** that takes them from **local setup → code build/test → GitHub push → GitHub Actions runs**.

You can copy/paste this directly into your course notes.

---

# 1) Seeding Repo (Instructor Starter Repository)

## A. Repo goal

A small app that:

- builds successfully
- has unit tests + linting
- produces an artifact
- runs a GitHub Actions workflow on PR + push

I recommend a **Node/Express API** with **Jest** + **ESLint/Prettier** because it’s simple and very “CI-friendly”.

---

## B. Suggested folder structure

```
csp451-actions-seed/
  .github/
    workflows/
      ci.yml
  src/
    app.js
  test/
    app.test.js
  .editorconfig
  .gitignore
  .prettierrc
  eslint.config.mjs
  package.json
  package-lock.json
  README.md
```

---

## C. Seed code (minimal but complete)

### 1) `package.json`

```json
{
  "name": "csp451-actions-seed",
  "version": "1.0.0",
  "description": "Seed repo for GitHub Actions CI exercise",
  "main": "src/app.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/app.js",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "test": "jest --ci --coverage",
    "build": "node -e \"console.log('Build step OK')\""
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "supertest": "^6.3.4"
  }
}
```

### 2) `src/app.js`

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Hello from CSP451" });
});

module.exports = app;

// Allow running locally: `npm start`
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on ${port}`));
}
```

### 3) `test/app.test.js`

```js
const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  it("returns ok status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
```

### 4) `eslint.config.mjs` (ESLint v9 flat config)

```js
export default [
  {
    ignores: ["coverage/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
```

### 5) `.prettierrc`

```json
{
  "singleQuote": false,
  "printWidth": 100
}
```

### 6) `.gitignore`

```gitignore
node_modules/
coverage/
.env
.DS_Store
```

### 7) `README.md` (seed instructions)

```md
# CSP451 GitHub Actions Seed Repo

## Local setup

1. Install Node.js (LTS recommended)
2. Install deps:
   npm ci
3. Run checks:
   npm run lint
   npm run format:check
   npm test
4. Run app:
   npm start
   Visit http://localhost:3000
```

---

## D. Seed GitHub Actions Workflow (`.github/workflows/ci.yml`)

This is a clean “CI only” workflow for your students to trigger reliably.

```yaml
name: CI

on:
  push:
    branches: ["main", "develop"]
  pull_request:
    branches: ["main"]
  workflow_dispatch:

env:
  NODE_VERSION: "18"

jobs:
  lint-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Format check
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Upload coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 7
```

---

# 2) Student Exercise: Local → GitHub → Actions CI

## Learning outcomes

Students will:

1. Clone a repo and run locally
2. Create a feature branch
3. Make a change + tests
4. Push to GitHub
5. Open a PR and interpret GitHub Actions results
6. Fix a failing pipeline and re-run

---

## Exercise brief (give this to students)

### Part A — Local setup (must show evidence)

1. **Fork** the instructor seed repo to your own GitHub.
2. Clone your fork:

   ```bash
   git clone <your-fork-url>
   cd csp451-actions-seed
   ```

3. Install and run checks:

   ```bash
   npm ci
   npm run format:check
   npm run lint
   npm test
   npm start
   ```

4. Screenshot or copy output of **passing `npm test`**.

Deliverable: screenshot/paste of passing tests + app running.

---

### Part B — Implement a new endpoint (code + tests)

**Task:** Add a new endpoint:

- `GET /health`
- returns JSON: `{ "status": "healthy", "uptime": <number> }`
  - `uptime` should be from `process.uptime()` (seconds)

**Requirements**

- Add the route in `src/app.js`
- Add at least **2 Jest tests** in `test/app.test.js`:
  1. returns status 200 and `status === "healthy"`
  2. `uptime` exists and is a number

Deliverable: commit with code + tests.

---

### Part C — Trigger GitHub Actions via push

1. Create a branch:

   ```bash
   git checkout -b feature/health-endpoint
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "Add /health endpoint with tests"
   ```

3. Push branch:

   ```bash
   git push -u origin feature/health-endpoint
   ```

4. Open a PR to `main`.

Deliverable: PR link + screenshot of **green check** in Actions/PR.

---

### Part D — Debug a failing workflow (intentional break)

Now intentionally break formatting and fix it.

1. Introduce a formatting issue (example: messy spacing, long line)
2. Commit and push again to the same branch
3. Confirm Actions fails
4. Fix by running:

   ```bash
   npm run format
   npm run lint
   npm test
   ```

5. Commit the fix and push
6. Confirm Actions turns green

Deliverable: PR timeline showing **failure → fix → success**.

---

# 3) Marking rubric (quick + objective)

| Category             | Points | What to check                   |
| -------------------- | -----: | ------------------------------- |
| Local setup evidence |     10 | `npm test` passes locally       |
| Endpoint implemented |     20 | `/health` returns required JSON |
| Tests quality        |     20 | 2+ tests, meaningful assertions |
| Git usage            |     10 | branch + commits + PR           |
| Actions pipeline     |     20 | CI runs on push/PR and passes   |
| Debug cycle          |     20 | show fail → fix → pass          |

Total: **100**

---

# 4) Instructor Notes (to make this run smoothly)

## Common pitfalls to warn students about

- Not running `npm ci` (they use `npm i` and lockfile differs)
- Committing `node_modules/`
- Pushing to `main` instead of a branch
- PR created from the wrong repo/branch
- Actions not running because they didn’t push or PR is not to `main`

## Optional “challenge extensions” (extra credit)

- Add `GET /version` returning `name` and `version` from `package.json`
- Add matrix testing (Node 18 + 20)
- Add `npm audit --audit-level=high` step and discuss tradeoffs

---

If you want, I can also produce a **second version** of the seeding repo that matches your Week 3 “full CI/CD” theme (adds Docker build + deploy placeholders) but still stays student-friendly.
