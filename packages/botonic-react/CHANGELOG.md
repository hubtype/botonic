# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master-lts but are not yet released.
    Click to see more.
  </summary>

## [0.37.1] - 2025-mm-dd

### Added

- [PR-3074](https://github.com/hubtype/botonic/pull/3074/files): Update Whatsapp CTA URL to accept image, video or document in header.
- [PR-3077](https://github.com/hubtype/botonic/pull/3077): Input panel buttons no need enable attribute to be used.
- [PR-3078](https://github.com/hubtype/botonic/pull/3078): Multichannel change buttons for replies when a text in facebook has more than 3 buttons.

### Changed

### Fixed

</details>

## [0.37.0] - 2025-07-22

### Added

- [PR-3066](https://github.com/hubtype/botonic/pull/3066): Add CustomRatingMessage.

## [0.36.5] - 2025-07-14

### Changed

- [PR-3061](https://github.com/hubtype/botonic/pull/3061): Export everything from src/contexts.tsx file.

## [0.36.4] - 2025-06-30

### Fixed

- [PR-3051](https://github.com/hubtype/botonic/pull/3051): Fix carousel buttons position.

## [0.36.3] - 2025-06-30

### Added

- [PR-3050](https://github.com/hubtype/botonic/pull/3050): Set the default target in bot links to `_self` in iOS/Android webviews.

## [0.36.0] - 2025-06-18

### Added

### Changed

- [PR-3031](https://github.com/hubtype/botonic/pull/3031): Webview get session from backend using new api endpoint.
- [PR-3038](https://github.com/hubtype/botonic/pull/3038): Avoid render webview before fetch session, update WebchatRequestContext with get functions.

## [0.35.0] - 2025-05-06

### Changed

- [PR-3003](https://github.com/hubtype/botonic/pull/3003): ReactBot class with typescript
- [PR-2991](https://github.com/hubtype/botonic/pull/2991): Create Provider WebchatTheme with typescript and add a default theme
- [PR-2995](https://github.com/hubtype/botonic/pull/2995): Add Button style in WebchatTheme
- [PR-2996](https://github.com/hubtype/botonic/pull/2996): ButtonDisabler in typescript

## [0.34.1] - 2025-04-03

### Fixed

- [PR-3002](https://github.com/hubtype/botonic/pull/3002): Fix close webview in default HeaderWebview

## [0.32.0] - 2025-02-18

### Changed

- Refactor components used to render a [webview inside the webchat](https://github.com/hubtype/botonic/pull/2976)
- When channel is not a webchat [Multichannel Carousel](https://github.com/hubtype/botonic/pull/2979) displays an image followed by a text with buttons for each element.

## [0.31.0] - 2025-01-22

### Changed

- Upgrade to [react 18](https://github.com/hubtype/botonic/pull/2939)
- [WebchatApp](https://github.com/hubtype/botonic/pull/2945) with typescript
- [Webchat](https://github.com/hubtype/botonic/pull/2947) component with typescript
- [Header](https://github.com/hubtype/botonic/pull/2949) component with typescript
- Fix [types and tests](https://github.com/hubtype/botonic/pull/2950)
- [WebchatReplies and Reply](https://github.com/hubtype/botonic/pull/2952) with typescript
