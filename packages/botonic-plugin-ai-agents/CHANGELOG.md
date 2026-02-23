# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>
  
## [0.44.x] - 2026-mm-dd

### Added

### Changed

### Fixed

</details>

## [0.45.0] - 2026-mm-dd

### Added

- Include tool results in HtEventAiAgent

### Changed

### Fixed

## [0.44.0] - 2026-01-29

### Added

- [PR-3153](https://github.com/hubtype/botonic/pull/3153): Add `enableDebug` option to log AI agent configuration, model settings, and execution details.

### Changed

- [PR-3148](https://github.com/hubtype/botonic/pull/3148): Upgrade openai and openai/agents dependencies.
- [PR-3151](https://github.com/hubtype/botonic/pull/3151): The input.context.campaign_v2 becomes an array and is renamed campaigns_v2.

## [0.43.0] - 2026-01-13

### Added

- [PR-3134](https://github.com/hubtype/botonic/pull/3134): Add Context from campaigns.

## [0.42.4] - 2025-12-19

### Added

- [PR-3136](https://github.com/hubtype/botonic/pull/3136): Allow the AI Agents to return buttons with URLs.

## [0.42.0] - 2025-11-25

### Added

- [PR-3125](https://github.com/hubtype/botonic/pull/3125): Add Azure timeout and retries. Remove custom retries.
- [PR-3128](https://github.com/hubtype/botonic/pull/3128): Add new message Whatsapp Interactive Media Carousel.

## [0.41.0] - 2025-11-11

### Added

- [PR-3115](https://github.com/hubtype/botonic/pull/3115): Update and standardize events to format v4 in botonic.

### Changed

### Fixed

## [0.40.0] - 2025-09-30

### Added

- [PR-3059](https://github.com/hubtype/botonic/pull/3059): Add default tool `retrieve_knowledge`.
- [PR-3109](https://github.com/hubtype/botonic/pull/3109): Add bot request in context for tools. This way you can use session and plugins in a function tool.

### Changed

### Fixed

- Fix TextWithButtons and Carrousel definitions.

## [0.39.0] - 2025-09-03

### Added

- [PR-3086](https://github.com/hubtype/botonic/pull/3086): Generate runner AI Agent responses with all data.

### Changed

### Fixed

## [0.38.0] - 2025-08-20

### Added

- [PR-3076](https://github.com/hubtype/botonic/pull/3076): Add contact_info on AI Agent system prompt.
- [PR-3083](https://github.com/hubtype/botonic/pull/3083): getInference returns an object as InferenceResponse.

### Changed

- [PR-3088](https://github.com/hubtype/botonic/pull/3088): Use types from @botonic/core.

## [0.37.1] - 2025-08-06

### Changed

- [PR-3075](https://github.com/hubtype/botonic/pull/3075): Change type for context to RunContext in tools.

## [0.37.0] - 2025-07-22

### Added

- Publish stable version.
