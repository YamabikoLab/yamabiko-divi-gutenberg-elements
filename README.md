# Yamabiko Divi Gutenberg Elements

Yamabiko Divi Gutenberg Elements (YDGE) is a WordPress plugin project for editor elements and tools that can be offered through both Gutenberg and Divi 5.

The project includes an experimental Highlight PoC for applying the same semantic `<mark>`-based highlight markup from Gutenberg and Divi 5. The Divi integration currently uses a provisional Visual Builder / TinyMCE adapter and is not yet a stable public feature.

## Development

Install Node.js dependencies and run the current front-end quality checks:

```bash
npm ci
npm test
npm run build
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
