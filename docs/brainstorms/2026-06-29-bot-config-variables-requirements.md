---
date: 2026-06-29
topic: bot-config-variables
---

# BotConfigJSON variables attribute

## Summary

Add a `variables` attribute to `BotConfigJSON` so each bot declares its session variables at deploy time. The hub's feature-flow-builder reads this list to populate the variable picker in the conditional event configuration UI.

---

## Problem Frame

The hub picker for conditional events currently starts empty for new bots. Variables can be defined from the feature-flow-builder frontend, but there is no machine-readable source of truth — the person configuring the flow must know from context which variables exist in the bot code and how they are named. This creates a manual coordination gap that grows whenever `extra_data` fields change.

The bot code is the authoritative source. The deploy payload (`BotConfigJSON`) already carries other bot capabilities (`tools`, `payloads`, `webviews`) to the hub. Adding `variables` to that payload closes the gap at the point where authority already lives.

---

## Key Decisions

- **All variables declared by the bot, not hardcoded by the hub.** Standard session fields (`session.user.locale`, `session.user.country`, `session.user.system_locale`) are included in the declaration rather than treated as hub defaults. Their presence and naming can vary across SDK versions, so the bot remains the authority.

- **`type` is optional, not required.** Bot developers who declare type enable type-aware operator rendering in the picker. Developers who omit it get a working picker without added friction. Making `type` required would be a breaking change for existing bots and adds no value for bots that only use string equality checks.

- **No Zod or JSON Schema per variable.** The picker needs type identity, not structural validation. A union of string literals is sufficient and keeps the deploy payload lean.

---

## Requirements

**Interface definition**

- R1. `BotConfigJSON` gains an optional `variables` attribute typed as an array of `VariableConfigJSON`.
- R2. `VariableConfigJSON` has a required `keyPath: string` field (e.g. `session.user.locale`, `session.user.extra_data.language`) and an optional `type` field constrained to `'string' | 'number' | 'boolean'`.

**Declaration scope**

- R3. Both standard session variables and custom `extra_data` variables are declared in `variables`.
- R4. `variables` is optional in `BotConfigJSON` — bots that omit it remain valid and the hub treats the picker list as empty for those bots.

**Serialization**

- R5. `variables` serializes as part of the `bot_config` JSON payload sent at deploy time, alongside existing `tools`, `payloads`, and `webviews`.

**Data shape (before / after)**

```typescript
// Before
interface BotConfigJSON {
  tools: ToolConfigJSON[]
  payloads: string[]
  webviews: WebviewConfigJSON[]
}

// After
interface VariableConfigJSON {
  keyPath: string
  type?: 'string' | 'number' | 'boolean'
}

interface BotConfigJSON {
  tools: ToolConfigJSON[]
  payloads: string[]
  webviews: WebviewConfigJSON[]
  variables?: VariableConfigJSON[]   // new
}
```

Example declaration in a bot:

```typescript
export const botConfig: BotConfigJSON = {
  tools: [],
  payloads: [],
  webviews: [],
  variables: [
    { keyPath: 'session.user.locale', type: 'string' },
    { keyPath: 'session.user.country', type: 'string' },
    { keyPath: 'session.user.system_locale', type: 'string' },
    { keyPath: 'session.user.extra_data.language', type: 'string' },
    { keyPath: 'session.user.extra_data.isPremium', type: 'boolean' },
  ],
}
```

---

## Scope Boundaries

- `label` and `description` metadata per variable — not needed for the picker; addable in a future iteration without breaking the interface.
- Changes to feature-flow-builder — the hub-side consumption of this data is out of scope for this work.
- Runtime validation of session variable values against declared types — the declaration is informational for the hub UI, not a runtime contract.
- Zod schema per variable — out of scope.

---

## Dependencies / Assumptions

- There are two separate `BotConfigJSON` interface definitions in the repo: one in `packages/botonic-core/src/models/legacy-types.ts` and one in `packages/botonic-cli/src/util/bot-config.ts`. Both need the `variables` attribute; planning should confirm which is the canonical definition and whether one extends the other.
- feature-flow-builder (the hub frontend) already reads the `bot_config` payload from the deploy endpoint — this work assumes that consumption path exists and only needs the new field added to the payload.

---

## Sources

- `packages/botonic-core/src/models/legacy-types.ts:463` — core `BotConfigJSON` definition
- `packages/botonic-cli/src/util/bot-config.ts:34` — CLI `BotConfigJSON` definition with `build_info`
- `packages/botonic-core/src/models/legacy-types.ts:228` — `SessionUser` interface (`locale`, `country`, `system_locale`, `extra_data`)
- `packages/botonic-cli/src/botonic-api-service.ts:306` — `deployBot()` serializes `bot_config` as FormData
- `packages/botonic-cli/src/commands/deploy.ts:401` — deploy command reads config via `BotConfig.get()`
- `examples/flow-builder-typescript/src/bot-config.ts:11` — example `botConfig` declaration
