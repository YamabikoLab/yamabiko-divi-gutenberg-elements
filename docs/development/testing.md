# Testing and validation

Run commands from the repository root. This document is the source of truth for validation commands that currently exist.

## Node.js

Install locked dependencies:

```bash
npm ci
```

Build the Gutenberg and Divi Highlight assets:

```bash
npm run build
```

Run the TypeScript type check:

```bash
npm run typecheck
```

Run the current Node.js quality gate:

```bash
npm test
```

`npm test` runs:

```bash
npm run format:check
npm run lint:js
npm run lint:css
npm run typecheck
```

TypeScript and TSX product source are included in the existing `format` / `format:check` quality gate.

Run the dependency security audit:

```bash
npm run audit:security
```

`npm run format` and `npm run format:css` modify files and should be used only intentionally.

YDGE does not yet have Jest tests, Knip, or Playwright E2E. Add those commands here only when the corresponding real source and configuration are introduced.

## PHP

Install locked development dependencies:

```bash
composer install
```

Validate Composer metadata:

```bash
composer validate --strict
```

Run the dependency security audit:

```bash
composer run audit:security
```

Check syntax:

```bash
php -l yamabiko-divi-gutenberg-elements.php
```

Run WordPress Coding Standards:

```bash
composer lint:php
```

Run PHPStan:

```bash
composer analyse:php
```

`composer format:php` modifies files and should be used only intentionally.

## Repository check

Check changed lines for whitespace errors:

```bash
git diff --check origin/main...HEAD
```

## Handoff matrix

- Documentation only: repository check.
- JavaScript/TypeScript/JSON/YAML/CSS/SCSS or Node configuration: `npm test`, `npm run build`, and repository check.
- PHP or Composer changes: Composer validation, PHP syntax, PHPCS, PHPStan, and repository check.
- Dependency manifest or lock-file changes: add the relevant security audit.
- GitHub Actions changes: repository check and GitHub-hosted workflow result.
- Mixed changes: combine the applicable checks.

Do not claim checks ran when they were skipped or unavailable.
