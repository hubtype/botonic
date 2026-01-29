# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master-lts but are not yet released.
    Click to see more.
  </summary>
  
## [0.44.x] - 2026-mm-dd

### Added

### Changed

### Fixed

</details>

## [0.44.0] - 2026-01-29

### Added

- [PR-3146](https://github.com/hubtype/botonic/pull/3146): Add CaptureUserInput node.

## [0.43.1] - 2026-01-15

### Added

- [PR-3145](https://github.com/hubtype/botonic/pull/3145): Add video header support for WhatsApp template

## [0.43.0] - 2026-01-13

### Added

- [PR-3140](https://github.com/hubtype/botonic/pull/3140): Carousel node accepts a new text for Whatsapp Interactive Media Carousel.
- [PR-3134](https://github.com/hubtype/botonic/pull/3134): Add Whatsapp Template node to send campaigns.
- [PR-3134](https://github.com/hubtype/botonic/pull/3134): Use AiAgent with context campaign.

## [0.42.5] - 2025-12-19

### Added

- [PR-3136](https://github.com/hubtype/botonic/pull/3136): Allow FlowButton to return buttons with URLs.

## [0.42.2] - 2025-12-02

### Added

- [PR-3132](https://github.com/hubtype/botonic/pull/3132): Allow using a Boolean condition of a Bot variable conditional to check non boolean variables.

## [0.42.1] - 2025-11-27

### Fixed

- [PR-3131](https://github.com/hubtype/botonic/pull/3131): Fix payload of AI Agent generated Text with buttons

## [0.42.0] - 2025-11-25

### Changed

- [PR-3129](https://github.com/hubtype/botonic/pull/3129): Send new events for bot-action, conditionals, redirect and webview triggered.
- [PR-3128](https://github.com/hubtype/botonic/pull/3128): Add new message Whatsapp Interactive Media Carousel.

## [0.41.0] - 2025-11-11

### Added

- [PR-3115](https://github.com/hubtype/botonic/pull/3115): Update and standardize events to format v4 in botonic.
- [PR-3116](https://github.com/hubtype/botonic/pull/3116): Fix getValueFromKeyPath function to get variables from `input` and `session` correctly.

### Changed

### Fixed

## [0.40.0] - 2025-09-30

### Added

- [PR-3086](https://github.com/hubtype/botonic/pull/3086): Create and send AI Agent events.

### Changed

### Fixed

- Do not execute postbacks on AI Agent generated buttons execution.

## [0.39.0] - 2025-09-03

### Added

- [PR-3095](https://github.com/hubtype/botonic/pull/3095): Add FlowWebview node to open a webview.
- [PR-3097](https://github.com/hubtype/botonic/pull/3097): Add provider_id in useWebviewContents.

## [0.38.2] - 2025-08-28

### Added

- [PR-3094](https://github.com/hubtype/botonic/pull/3094): Extract the logic that obtains the submitted rating information into a function so it can be exported and used in the bots.

## [0.38.1] - 2025-08-26

### Fixed

- [PR-3093](https://github.com/hubtype/botonic/pull/3093): Fix payload in toBotonic method of FlowWhatsappButtonList component.

## [0.38.0] - 2025-08-20

### Added

- [PR-3084](https://github.com/hubtype/botonic/pull/3084): Allow to use input guardrails in ai agent node.

### Changed

- [PR-3081](https://github.com/hubtype/botonic/pull/3081): plugin-flow-builder not respond with first interaction if it receive a contentID.
- [PR-3091](https://github.com/hubtype/botonic/pull/3091): plugin-flow-builder not to use specific WhatsApp messages when the channel is not WhatsApp.
- [PR-3092](https://github.com/hubtype/botonic/pull/3092): Change do-nothing payload.

## [0.37.1] - 2025-08-06

### Added

-[PR-3074](https://github.com/hubtype/botonic/pull/3074/files): Use Whatsapp CTA URL with image, video or document in header.

## [0.37.0] - 2025-07-22

### Added

- [PR-3063](https://github.com/hubtype/botonic/pull/3063): Add rating flow to resolve rating nodes.
- [PR-3066](https://github.com/hubtype/botonic/pull/3066): Allow to enable CustomRatingMessage.

## [0.36.1] - 2025-07-09

### Added

- [PR-3056](https://github.com/hubtype/botonic/pull/3056): Ai agent can generate some messages, using array and each message can be of type text, textWithButtons or carousel.

## [0.36.0] - 2025-06-18

### Added

- [PR-3022](https://github.com/hubtype/botonic/pull/3022): Add an ai agent from flow builder.

### Fixed

- [PR-3037](https://github.com/hubtype/botonic/pull/3037): update system_locale when resolveLocale.
- [PR-3037](https://github.com/hubtype/botonic/pull/3037): not fill Multichannel with FlowBuilderAction to not add more children in React tree.

## [0.35.3] - 2025-06-03

### Added

- [PR-3029](https://github.com/hubtype/botonic/pull/3029): Add contentFilters before tracking contents.
- [PR-3030](https://github.com/hubtype/botonic/pull/3030): Allow webchatSettingsParams as a prop in FlowBuilderAction.

## [0.35.2] - 2025-05-26

### Added

- [PR-3026](https://github.com/hubtype/botonic/pull/3026): Add target and webview in FlowButton

## [0.35.1] - 2025-05-13

### Changed

- [PR-3018](https://github.com/hubtype/botonic/pull/3018): FlowBuilder.executeConversationStart always add match with keywords or smart-intent.

## [0.35.0] - 2025-05-06

### Added

- [PR-3008](https://github.com/hubtype/botonic/pull/3008/files): Use new user fields and default_locale_code
- [PR-3013](https://github.com/hubtype/botonic/pull/3013): no need to receive the locale in any function

### Changed

- [PR-3010](https://github.com/hubtype/botonic/pull/3010): Remove all logic related with intents babel.

## [0.34.2] - 2025-04-02

- [PR-3004](https://github.com/hubtype/botonic/pull/3004/files): nluResolution available in first interaction

## [0.34.1] - 2025-04-02

### Added

- [PR-3001](https://github.com/hubtype/botonic/pull/3001): Allow shadowing configuration

## [0.34.0] - 2025-04-01

### Added

- [PR-2292](https://github.com/hubtype/botonic/pull/2992): Allow create handoff test cases

## [0.33.1] - 2025-04-01

### Added

- [PR-2298](https://github.com/hubtype/botonic/pull/2998): set and unset `request.input.nluResult in Input`

## [0.33.0] - 2025-03-04

### Added

- Do call `getKnowledgeBaseResponse` with new knowledge base settings (memory + instructions).

### Changed

- Use the queue's availability endpoint from external API instead of public API (deprecated)

## [0.32.0] - 2025-02-18

### Added

- Add logic to conditionally [subscribe to `InitialQueuePosition` helpdesk event](https://github.com/hubtype/botonic/pull/2975) when doing a handoff.

### Changed

- Plugin endpoints to point to [new hubtype backend flow builder app](https://github.com/hubtype/botonic/pull/2972).

### Fixed

## [0.31.2] - 2025-02-07

### Changed

- No track FlowNode events for texts [generated by knowledgebase](https://github.com/hubtype/botonic/pull/2977)

## [0.31.1] - 2025-01-28

### Changed

- Fix [isLoading in useWebviewContents](https://github.com/hubtype/botonic/pull/2973)

## [0.31.0] - 2025-01-22

### Changed

- Create nlu and knowledgebase events with [flow_thread_id, flow_node_id and flow_id attributes](https://github.com/hubtype/botonic/pull/2960)
