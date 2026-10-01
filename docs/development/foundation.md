# Development foundation

This document defines repository-wide development principles for Yamabiko Divi Gutenberg Elements (YDGE). Working instructions live in `AGENTS.md` files, and validation commands live in `testing.md`.

## Product boundary

YDGE provides editor elements and tools intended to be available through both Gutenberg and Divi 5.

Common code is limited to responsibilities that are genuinely editor-independent, such as feature semantics, pure transformations, validation, stable defaults, and shared style contracts. Gutenberg and Divi remain outer adapters with their own registration APIs, UI integration, state/store APIs, serialization, build contracts, and runtime lifecycle.

Do not abstract merely to make two implementations look alike.

## Source boundaries

Introduce source structure only when a concrete feature requires it. A future shape may include editor-independent code and separate Gutenberg and Divi adapters, but empty directories or placeholder entry points are not part of the foundation.

Gutenberg and Divi builds are independent build targets. Do not assume a single Webpack multi-entry configuration. Select the build shape after the first concrete feature establishes each platform's asset contract.

## Stable identifiers

Use project identifiers based on `yamabiko-divi-gutenberg-elements`, including the WordPress text domain and future public handles. Treat saved content identifiers and other persisted identifiers as compatibility-sensitive once released.

## WordPress lifecycle

The plugin must remain safe to activate when Divi is not installed. Divi-specific APIs must not be called until their availability is established.

Register hooks and assets only when a concrete responsibility requires them. Do not add guards for build products that do not yet exist.

## Security and privacy

- Prefer WordPress capability, nonce, sanitization, escaping, and validation APIs where applicable.
- Treat external input and persisted content according to its trust boundary.
- Do not introduce network requests, telemetry, or storage without a concrete product requirement and documentation.

## Internationalization and accessibility

- Translate user-visible strings using the `yamabiko-divi-gutenberg-elements` text domain.
- Preserve semantic HTML and keyboard accessibility at editor boundaries.
- Do not rely on color alone to communicate state.

## Dependencies and assets

Add dependencies only for concrete responsibilities. Do not copy YTR feature dependencies or the Divi example plugin's dependency set wholesale.

React and other host-provided runtimes should not be duplicated into plugin bundles when the target platform provides a supported external contract.

## Documentation

Keep documentation aligned with current code and commands. Do not describe planned Marker, Caption Box, build, typecheck, Jest, Knip, or E2E behavior as already available.
