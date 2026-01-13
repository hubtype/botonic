# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>
  
## [0.43.x] - 2026-mm-dd

### Added

### Changed

### Fixed

</details>

## [0.43.0] - 2026-01-13

### Changed

- [PR-3134](https://github.com/hubtype/botonic/pull/3134): Change ContactInfo format in Session.

## [0.42.0] - 2025-11-25

### Changed

- [PR-3126](https://github.com/hubtype/botonic/pull/3126): Change hubtype analytics to use format v5.
- [PR-3128](https://github.com/hubtype/botonic/pull/3128): Update Ai Agent CarouselMessage to accept a text.

## [0.41.0] - 2025-11-11

### Added

- [PR-3115](https://github.com/hubtype/botonic/pull/3115): Update and standardize events to format v4 in botonic.

### Changed

### Fixed

## [0.40.0] - 2025-09-30

### Added

- [PR-3086](https://github.com/hubtype/botonic/pull/3086): Add AI Agent events types.

### Changed

### Fixed

- Fix Button model for AI Agents.

## [0.38.0] - 2025-08-20

## Added

- [PR-3088](https://github.com/hubtype/botonic/pull/3088): plugin-ai-agent types declared and exported from @botonic/core.
- [PR-3087](https://github.com/hubtype/botonic/pull/3087): plugin-hubtype-analytics types declared and exported from @botonic/core.
- [PR-3088](https://github.com/hubtype/botonic/pull/3088): plugin-knowledge-bases types declared and exported from @botonic/core.

## [0.37.0] - 2025-07-22

### Changed

-[PR-3068](https://github.com/hubtype/botonic/pull/3068): Store case rating for test integrations.

## [0.35.2] - 2025-05-27

### Fixed

- [PR-3027](https://github.com/hubtype/botonic/pull/3027): Infer type from Route to matchers

## [0.35.1] - 2025-05-26

### Fixed

- [PR-3026](https://github.com/hubtype/botonic/pull/3026): Use BotContext for routes function and RequestMatcher

## [0.35.0] - 2025-05-06

### Changed

- [PR-3006](https://github.com/hubtype/botonic/pull/3006): Infer Plugins type in BotContext
- [PR-3007](https://github.com/hubtype/botonic/pull/3007): BotContext with getUserLocale, geUserCountry and getSystemLocale functions
- [PR-3011](https://github.com/hubtype/botonic/pull/3011): Remove getString function from request BotContext and locales from BotCore
- [PR-3012](https://github.com/hubtype/botonic/pull/3012): Infer ExtraData type for session.user.extra_data in BotContext
- [PR-3016](https://github.com/hubtype/botonic/pull/3016): Change `session._hubtype_case_status` for `session._hubtype_case_resolution`

## [0.34.0] - 2025-04-01

### Added

- [PR-2292](https://github.com/hubtype/botonic/pull/2992): Allow create handoff test cases

## [0.33.2] - 2025-04-01

### Added

- [PR-2298](https://github.com/hubtype/botonic/pull/2998): Add `request.input.nluResult in Input`

## [0.33.1] - 2025-03-31

### Added

- [PR-2997](https://github.com/hubtype/botonic/pull/2997): add interfaces for `event Inputs`

## [0.32.0] - 2025-02-18

### Added

- [BLT-1369](https://hubtype.atlassian.net/browse/BLT-1369): Add new `SubscribeHelpdeskEvents` event `InitialQueuePosition`.
