# Test case documentation

These guidelines apply when documenting individual test cases in this repository.

Each test case should be understandable without reading the implementation in detail.

## Required documentation

- Add a Japanese comment immediately before each test case.
- As a rule, include:
  - 概要: 何を確認するテストなのか
  - 事前条件: テスト実行前に成立している状態
  - 操作: テスト対象に対して何を行うのか
  - 期待結果: 操作の結果として何が成立すべきか
- Omit a section when it does not meaningfully apply.
- Describe product, user-visible, or responsibility-boundary behavior rather than helper names, selectors, mocks, coordinates, or internal processing steps.

## Default structure

```ts
/**
 * <概要>
 *
 * 事前条件:
 * - <テスト実行前の状態>
 *
 * 操作:
 * - <テスト対象に対して行うこと>
 *
 * 期待結果:
 * - <成立すべき結果>
 */
```
