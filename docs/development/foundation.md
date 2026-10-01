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

Use these identifiers consistently:

| Surface | Form |
| --- | --- |
| Plugin slug and text domain | `yamabiko-divi-gutenberg-elements` |
| PHP namespace | `YamabikoLab\\DiviGutenbergElements\\` |
| Global PHP function prefix | `yamabiko_divi_gutenberg_elements_` |
| PHP constant prefix | `YAMABIKO_DIVI_GUTENBERG_ELEMENTS_` |
| Action and filter prefix | `yamabiko-divi-gutenberg-elements/` |
| Script and style handle prefix | `yamabiko-divi-gutenberg-elements-` |
| CSS class prefix | `yamabiko-divi-gutenberg-elements-` |

Do not use short project acronyms such as `YE` or `YDGE` for public or persisted identifiers. Acronyms may be used in conversation and documentation prose.

Project-owned CSS class names use the `yamabiko-divi-gutenberg-elements-` prefix, lowercase kebab-case within each segment, `__` for child elements, and `--` for modifiers. Use separate `is-` or `has-` classes for state. Do not rename classes owned by WordPress, Divi, or third-party dependencies.

When a concrete feature introduces another public identifier surface, derive its form from the canonical plugin slug unless an external platform contract requires another form. Do not define identifiers for capabilities that do not yet exist merely for completeness.

Released identifiers, saved markup, persisted keys, and public hooks are compatibility-sensitive contracts.

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
