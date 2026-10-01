# Yamabiko Divi Gutenberg Elements

Yamabiko Divi Gutenberg Elements (YDGE) is a WordPress plugin project for editor elements and tools that can be offered through both Gutenberg and Divi 5.

The project is currently in its foundation stage. Product features such as markers or caption boxes are not implemented yet. Shared behavior will be introduced only when a concrete feature establishes a real common responsibility, while Gutenberg and Divi integrations remain separate adapters.

## Development

Install Node.js dependencies and run the current front-end quality checks:

```bash
npm ci
npm test
npm run audit:security
```

Install PHP development dependencies and run the current PHP checks:

```bash
composer install
composer validate --strict
composer run audit:security
php -l yamabiko-divi-gutenberg-elements.php
composer lint:php
composer analyse:php
```

See [docs/development/testing.md](docs/development/testing.md) for the source of truth for validation commands.

## License

GPL-2.0-or-later. See [LICENSE](LICENSE).
