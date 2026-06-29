---
date: 2026-06-29
title: "feat: Add variables attribute to BotConfigJSON"
type: feat
origin: docs/brainstorms/2026-06-29-bot-config-variables-requirements.md
---

# feat: Add variables attribute to BotConfigJSON

## Summary

Add a `variables` attribute to `BotConfigJSON` so bots declare their session variables at deploy time. The hub's feature-flow-builder reads this list to populate the conditional event variable picker.

---

## Problem Frame

The feature-flow-builder picker for conditional events is empty for new bots. Developers must manually know which session variables exist in the bot code — a synchronization gap that grows when `extra_data` fields change. Since `BotConfigJSON` already carries other bot capabilities (`tools`, `payloads`, `webviews`) to the hub at deploy time, `variables` fits the established pattern and closes the gap at the source.

---

## Requirements

(see origin: `docs/brainstorms/2026-06-29-bot-config-variables-requirements.md`)

- R1. `BotConfigJSON` gains an optional `variables` attribute typed as an array of `VariableConfigJSON`.
- R2. `VariableConfigJSON` has a required `keyPath: string` and an optional `type: 'string' | 'number' | 'boolean'`.
- R3. Both standard session variables and `extra_data` variables are declared in `variables`.
- R4. `variables` is optional — bots without it remain valid; the hub treats their picker list as empty.
- R5. `variables` serializes in the `bot_config` JSON payload sent at deploy time.

---

## Key Technical Decisions

**`VariableConfigJSON` defined in core `legacy-types.ts`.** Bot developers import `BotConfigJSON` from `@botonic/core`; the new type belongs alongside its peers `ToolConfigJSON` and `WebviewConfigJSON` in the same file.

**CLI keeps independent local interface definitions.** The CLI's `bot-config.ts` already defines local copies of `ToolConfigJSON` and `WebviewConfigJSON` without importing from core. The plan follows this established pattern — `VariableConfigJSON` and the `variables` field are added independently to the CLI's local types. Unifying ownership is a separate refactor (see Scope Boundaries).

**`loadBotConfig()` uses the same null-safe default pattern.** All existing fields (`tools`, `payloads`, `webviews`) default to `[]` when absent. `variables` follows the same convention.

---

## Implementation Units

### U1. Add VariableConfigJSON and update BotConfigJSON in core

**Goal:** Introduce `VariableConfigJSON` and add `variables?` to the exported `BotConfigJSON`.

**Requirements:** R1, R2, R4

**Dependencies:** none

**Files:**
- `packages/botonic-core/src/models/legacy-types.ts` — modify

**Approach:** Add `VariableConfigJSON` adjacent to `ToolConfigJSON` and `WebviewConfigJSON` at the bottom of the file. Add `variables?: VariableConfigJSON[]` to `BotConfigJSON`. Follow the exact style of the existing adjacent interfaces.

**Patterns to follow:** `ToolConfigJSON` and `WebviewConfigJSON` definitions in `packages/botonic-core/src/models/legacy-types.ts`.

**Test expectation: none** — pure interface addition with no runtime behavior. TypeScript compilation is the verification: existing `botConfig` objects that omit `variables` must still satisfy `BotConfigJSON`.

**Verification:** `tsc --noEmit` in `packages/botonic-core` passes. Existing bot-config examples that omit `variables` continue to typecheck without errors.

---

### U2. Update CLI BotConfigJSON and BotConfig to pass variables through

**Goal:** Extend the CLI's local `BotConfigJSON`, `loadBotConfig()`, and `BotConfig.get()` so that variables declared by the bot appear in the deploy payload.

**Requirements:** R1, R2, R4, R5

**Dependencies:** U1

**Files:**
- `packages/botonic-cli/src/util/bot-config.ts` — modify
- `packages/botonic-cli/tests/util/bot-config.test.ts` — create (new unit test file)

**Approach:**
- Add a local `VariableConfigJSON` interface alongside existing local `ToolConfigJSON` / `WebviewConfigJSON`.
- Add `variables?: VariableConfigJSON[]` to the CLI's local `BotConfigJSON`.
- In `loadBotConfig()`, return `variables: botConfig?.variables || []` alongside existing fields.
- In `BotConfig.get()`, include `variables: configLoaded.variables` in the returned object.

**Patterns to follow:** How `tools`, `payloads`, and `webviews` are handled in `loadBotConfig()` and `BotConfig.get()` in `packages/botonic-cli/src/util/bot-config.ts`.

**Test scenarios:**
- `loadBotConfig()` given a bot config with no `variables` field → returns `{ variables: [] }`
- `loadBotConfig()` given a bot config with two variables (one with `type`, one without) → returns both entries intact and unmodified
- `loadBotConfig()` given a bot config where `variables` is `undefined` → returns `{ variables: [] }` (same as absent)
- Assembled `BotConfigJSON` from `BotConfig.get()` includes a `variables` key at the top level when the source bot config declares variables
- Assembled `BotConfigJSON` from `BotConfig.get()` includes `variables: []` when the source bot config omits the field

**Verification:** New unit tests pass. `tsc --noEmit` in `packages/botonic-cli` passes. The assembled deploy payload includes `variables`.

---

### U3. Update example bot-config with variables declaration

**Goal:** Show bot developers how to declare both standard and `extra_data` variables in `bot-config.ts`.

**Requirements:** R3

**Dependencies:** U1

**Files:**
- `examples/flow-builder-typescript/src/bot-config.ts` — modify

**Approach:** Add a `variables` array to the existing `botConfig` object. Include the three standard variables (`session.user.locale`, `session.user.country`, `session.user.system_locale`) with `type: 'string'`, and one representative `extra_data` variable as an example of a custom declaration.

**Patterns to follow:** Existing `botConfig` shape in `examples/flow-builder-typescript/src/bot-config.ts`.

**Test expectation: none** — example file; typechecked as part of the package build.

**Verification:** `tsc --noEmit` in the example package passes. The `variables` field satisfies the updated `BotConfigJSON` type from `@botonic/core`.

---

## Scope Boundaries

### Deferred to Follow-Up Work

- Unifying the duplicated local type definitions (`ToolConfigJSON`, `WebviewConfigJSON`, `VariableConfigJSON`) between core and CLI — separate refactor, carries risk.
- Adding `label` and `description` fields to `VariableConfigJSON` — deferred per brainstorm decision; addable without a breaking change.

### Out of Scope

- Changes to feature-flow-builder (hub-side consumption of the variables field).
- Runtime validation of session variable values against declared types.
- Zod schema support per variable.

---

## Dependencies / Assumptions

- feature-flow-builder already reads the `bot_config` payload from the deploy endpoint — only the botonic-side addition is in scope here.
- The two `BotConfigJSON` definitions (core and CLI) are independently maintained; the CLI does not import types from core for this interface.

---

## Sources & Research

- `packages/botonic-core/src/models/legacy-types.ts` — core `BotConfigJSON`, `ToolConfigJSON`, `WebviewConfigJSON` definitions
- `packages/botonic-cli/src/util/bot-config.ts` — CLI `BotConfigJSON`, `BotConfig.get()`, `loadBotConfig()` implementation
- `packages/botonic-cli/src/botonic-api-service.ts` — deploy payload serialization
- `examples/flow-builder-typescript/src/bot-config.ts` — reference bot-config example
