# Jest test guidelines

These guidelines apply when Jest tests are introduced into YDGE.

## Organization

- Organize tests around externally observable behavior and responsibility boundaries.
- Prefer test names in the form `when ..., should ...`.
- Keep tests adjacent to the source they verify unless a later architecture establishes another boundary.
- Follow `test-case-documentation.md` for the shared Japanese test-case comment format.

## Production dependencies

Use real production dependencies whenever practical. Replace them with test doubles only when the real dependency is technically impractical or the required condition cannot be reproduced deterministically through a reasonable public boundary.

For WordPress data behavior, prefer real stores, selectors, and dispatch through `@wordpress/data`. Do not mock `@wordpress/data` itself merely for convenience.

## Production API boundaries

Do not add or widen production exports solely for tests. Verify private implementation details through observable behavior exposed by the owning responsibility.

## React Testing Library

Prefer React Testing Library for React components and hooks. Test user-observable behavior and lifecycle contracts rather than internal React state or incidental DOM structure.

Verify mount/unmount cleanup, remount behavior, subscriptions, and shared-state integration when those behaviors are part of the responsibility.

## Test doubles

A test double is appropriate for browser/layout facilities absent from Jest, deterministic failure injection that cannot reasonably be reached through production APIs, or other true environment boundaries.

When replacing a production dependency, make the reason clear in the test or related documentation.
