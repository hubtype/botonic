# AI Agents — Vitest mock patterns

`@botonic/plugin-ai-agents` uses idiomatic Vitest mocks instead of manual
capture objects (`capturedFoo = { value: null }` plus resets in `beforeEach`).

## Hoisted mock functions

Declare the mock with `vi.hoisted` and pass it into `vi.mock`. Vitest hoists
`vi.mock` calls; the factory must not close over variables defined later in the
file.

```typescript
const mockAgent = vi.hoisted(() =>
  vi.fn(function AgentMock(config: Record<string, unknown>) {
    return { name: config.name, model: config.model }
  })
)

vi.mock('@openai/agents', () => ({ Agent: mockAgent }))
```

Constructor mocks must use named regular functions so Biome does not rewrite
them into non-constructable arrow functions.

## Assertions

Prefer `toHaveBeenCalledWith(expect.objectContaining({ ... }))` over reading
`mock.mock.calls[0][0]` inline.

Use `vi.clearAllMocks()` in `beforeEach`; do not reset capture containers.

## Helpers for edge cases

When a test needs the real argument object (reference equality with `not.toBe`,
or inspecting nested copies), use `tests/helpers/mock-utils.ts`:

- `getLastMockCallArg<T>(mock)` — last call, single argument
- `getAllMockCallArgs<T>(mock)` — every call, e.g. multiple `Runner` instances

Exclude `tests/helpers/**` from the Vitest run in `vitest.config.ts`; the
helpers are imported by test files, not executed as tests.

## Schema vs integration tests

Zod output-schema behaviour lives in `tests/structured-output.test.ts`, calling
`getOutputSchema` and `OutputSchema` directly without mocking `@openai/agents`.
Agent-builder and router-agent-builder integration tests only verify wiring (for
example that `Agent` receives an `outputType` via `expect.any(Object)`). Do not
duplicate schema parsing inside integration tests.

## Per-file mocks

Each test file defines its own `@openai/agents` mock; behaviour differs per
suite. Do not share a global mock module across files.
