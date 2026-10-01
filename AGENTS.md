# Yamabiko Divi Gutenberg Elements repository instructions

These instructions apply to the entire repository.

## Repository boundaries

- The repository root is the WordPress plugin root.
- Product source under `src/` must follow `src/AGENTS.md`.
- Read `docs/development/foundation.md` for repository-wide development principles.
- Read `docs/development/testing.md` before selecting validation commands.
- Do not create placeholder source, directories, build targets, or commands for responsibilities that do not exist yet.

## Working rules

- Make the smallest change that fully satisfies the current issue.
- Keep documentation aligned with code, commands, dependencies, and directories that exist on the current branch.
- Introduce shared abstractions only after a concrete shared responsibility exists.
- Keep Gutenberg-specific and Divi-specific integration responsibilities outside shared logic.
- Prefer public WordPress and Divi APIs at integration boundaries.
- Do not commit generated dependencies or build output such as `node_modules/`, `vendor/`, or `build/`.
- Do not commit secrets, credentials, personal paths, machine names, or other local-only environment details.

## Communication and reporting

- Surface blocking issues, material assumption changes, and required scope changes.
- Keep routine implementation communication concise.
- At handoff, report work performed, changed areas, validation results, and open items.
- Never report validation as successful unless it actually ran successfully.

## Review

- Prioritize correctness, data integrity, lifecycle, state ownership, accessibility, security, and meaningful performance issues.
- Avoid required fixes for low-frequency, low-impact presentation edge cases when the proposed complexity outweighs the impact.
- Do not add coordination layers, state, IDs, queues, or abstractions solely to eliminate negligible edge cases.

## GitHub Actions

- Keep workflows narrowly scoped to their intended validation or security purpose.
- When `.github/workflows/` changes, review the final diff for unrelated changes and obsolete assumptions.
- Treat GitHub-hosted Actions as the authoritative CI result.

## Validation

- Use only commands documented in `docs/development/testing.md`.
- Run the narrowest applicable checks while iterating.
- Do not invent commands for build, typecheck, Jest, Knip, or E2E before those responsibilities exist.
