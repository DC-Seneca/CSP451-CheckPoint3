# CSP451 GitHub Actions Seed Repo

Seed repository for GitHub Actions CI/CD exercise in CSP451 - Computer Systems Projects.

## Local setup

1. Install Node.js (LTS recommended)
2. Install deps:
   ```bash
   npm ci
   ```
3. Run checks:
   ```bash
   npm run lint
   npm run format:check
   npm test
   ```
4. Run app:
   ```bash
   npm start
   ```
   Visit http://localhost:3000

## GitHub Actions CI

This repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs on:

- Pushes to `main` or `develop`
- Pull requests to `main`
- Manual trigger via GitHub UI

The workflow performs:

- Linting (ESLint)
- Format checking (Prettier)
- Unit tests (Jest)
- Coverage artifact upload

## Exercise Goals

Students will:

1. Clone and run locally
2. Implement new features with tests
3. Push changes and open PRs
4. Interpret GitHub Actions CI results
5. Debug and fix failing pipelines
