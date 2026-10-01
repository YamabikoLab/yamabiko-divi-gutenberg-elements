# Yamabiko Divi Gutenberg Elements source guidelines

These instructions apply to product source under `src/`.

## Source organization

- Add source files only when a concrete product responsibility requires them.
- Do not create generic `shared/`, `utils/`, or `helpers/` directories without a concrete shared reason for change.
- Keep editor-independent behavior separate from Gutenberg and Divi adapters.
- Do not commonize Gutenberg and Divi registration APIs, stores, hooks, serialization, Visual Builder integration, or Divi PHP rendering merely because their outcomes look similar.

## React and state ownership

- Keep render logic pure and state ownership explicit.
- Use Effects only for synchronization or lifecycle responsibilities and clean up listeners, observers, timers, subscriptions, and similar resources.
- Avoid duplicated or derived state that can become inconsistent.
- Ensure mount, unmount, remount, and editor-context changes do not rely on stale DOM references or one-time assumptions.
- Treat memoization as a response to meaningful cost, not a default abstraction.

## WordPress and Divi boundaries

- Prefer public WordPress APIs.
- Follow Divi 5's supported runtime and package-build APIs for Divi-specific integration.
- Divi-specific behavior must be guarded so the plugin remains safe when Divi is not installed.
- Keep shared logic free of editor-specific API calls.

## Tests

- Follow `../docs/development/jest-test-guidelines.md` when Jest is introduced.
- Follow `../docs/development/test-case-documentation.md` for test-case comments.
- Do not widen production exports solely for tests.
- Prefer real production dependencies where practical, including real WordPress data stores rather than mocking `@wordpress/data` itself.

## Internationalization and accessibility

- Use the `yamabiko-divi-gutenberg-elements` text domain for user-visible strings.
- Do not communicate meaning through color alone.

## Validation

Use the applicable commands documented in `../docs/development/testing.md`.
