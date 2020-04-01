# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>
</details>

## [0.11.0] - 2020-25-03

### Added

- [Project](https://github.com/hubtype/botonic)

  - Github Actions workflow which runs linter and tests
  - Development dependencies are centralized in parent folder.
  - Pre-commit for all packages.

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - New ability to deploy specifying the Hubtype credentials as Botonic's CLI command arguments.

* [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - New inspector to debug route matching.

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - General features:
    - Type definitions improvement in `index.d.ts`.
  - New webchat features:
    - New `Multichannel` HOC, which automatically converts your interactive components to text-based components for WhatsApp.
    - New default animations in webchat: Messages are now displayed with a fade-in effect and clickable elements are rescaled with the hovering function. You can disable them in the webchat's `theme` object through `animationsEnabled` or `animations.enabled` properties.
    - New ‘Send’ button (enabled by default). You can disable it by setting `userInput.sendButton.enable` to `false`. You can also use your own created component with `userInput.sendButton.custom`.
    - New `Botonic.clearMessages()` method to force the deletion of the messages stored in the webchat.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Improve tokenization of words containing hyphens and number (eg. covid-19).
  - Improve tokenization of "pronoms febles" in Catalan.
  - New API to update the texts of contentful contents.
  - Tool for translators to translate the content texts through CSV files.
  - Now buttons can refer to contentful queues (or any other top content).
  - Now all Content's have the "id" field.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - Dependabot to check for updates on a weekly basis.
  - Development dependencies are now installed in the repository top folder (parent config).

- [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - **Breaking change**: The Minimal Node version is now `node-v10.19.0`
  - Webpack's resolve configuration is now unified into `resolveConfig` object.

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - **Breaking change**: `emojiPicker` property is renamed `enableEmojiPicker`.
  - All styles of the project are converted into [Styled Components](https://styled-components.com/).

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Upgrade to typescript 3.8
  - **Breaking change**: Refactor TopContent and Content base classes. ModelType renamed to TopContentType.
  - **Breaking change**: Refactor so that SearchResult now returns ContentId's instead of ContentCallback's.
  - Now only the required language-specific [NLP.js](https://www.npmjs.com/package/node-nlp) folders are imported. This enables tree shaking to exclude big sentiment analysis files.
  - Error reporting decorator now also reports the originating exception.
  - Flag to disable the CMS delivery cache.

- [@botonic/plugin-dynamodb](https://www.npmjs.com/package/@botonic/plugin-dynamodb)

  - Upgrade to typescript 3.8
  - **Breaking change**: Move Env to its own file to ease tree-shaking

### Fixed

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Noto Sans JP now does not show up as default typography.
  - `simplebar` deprecation warnings have been resolved
  - Fixed outer page scrolling that produced unstable behavior.
  - Fixed noopener parameter/option to avoid security risk in location links.
  - Fixed `compromise` import in `@botonic/cli`'s `nlu` template.
  - Webviews are now rendered within `div` instead of `iframe` for a better visualization when developing locally without affecting production builds

## [0.10.1] - 2020-14-01

### Added

- Added default config for every template `{ defaultDelay: 0.4, defaultTyping: 0.6 }` to avoid misleading warnings in `botonic serve`.

### Changed

- Upgraded dependencies.
- Change `@botonic/cli`'s templates to upgrade automatically to last patch version.
- Bump [@tensorflow/tfjs](https://www.npmjs.com/package/@tensorflow/tfjs) and [@tensorflow/tfjs-node](https://www.npmjs.com/package/@tensorflow/tfjs-node) to latest versions for [@botonic/nlu](https://www.npmjs.com/package/@botonic/nlu) and [@botonic/plugin-nlu](https://www.npmjs.com/package/@botonic/plugin-nlu).

### Fixed

- Allow calling dynamic routes (routes as a function) in nested routes.
- Fix for issue [#409](https://github.com/hubtype/botonic/issues/409).
- Fix for runtime error produced when a `Text` had empty text and no buttons nor replies.

## [0.10.0] - 2019-12-03

### Added

- Added changelog.
- Native support for mobile devices for Webchat. Customizable breakpoint (`mobileBreakpoint`, **webchat/index.js**).
- Enable media attachments for Webchat (`userInput.attachments.enable` of **webchat/index.js**).
- Enable an emoji picker for Webchat (`userInput.emojiPicker`, **webchat/index.js**).
- Customizable scrollbar for Webchat (`theme.scrollbar` , **webchat/index.js**). Now the default scrollbar's style will be like the one in OS X systems for all platforms (Mac, Linux and Windows).
- New handoff options for handling cases with [Hubtype's Desk](https://app.hubtype.com/). Refer to [Human Handoff](https://docs.botonic.io/main-concepts/human-handoff) section.
- Customization of Webchat's header, userInput bottom area, userInput text box, replies, buttons styles and webview header (`header.style`, `reply.style`, `button.style`, `userInput.style`, `userInput.box.style`, `webchat.header.style`, **webchat/index.js**).
- Cancel's label of the Webchat's persistent menu can now be changed by passing to `persistentMenu` the object `{closeLabel: 'newCloseLabel'}`.
- `export const config = { defaultDelay: 1, defaultTyping: 2 }` can be added to **src/index.js** to define a global configuration for typing and delay options.

### Changed

- Start using "Changelog".
- Rewrite [Human Handoff](https://docs.botonic.io/main-concepts/human-handoff) section.
- Rewrite [Botonic Settings](https://docs.botonic.io/main-concepts/botonic-settings) section.
- Rewrite [Custom Webchat](https://docs.botonic.io/tutorials-and-examples/custom-webchat) section.
- Updated [custom-webchat template](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/custom-webchat).

### Fixed

- Typography now will be changed in a proper way for all Webchat components by passing the `fontFamily` attribute in `theme.style` in **webchat/index.js**.
- Webchat's triangles of messages bubbles (bot/user) are now modified according to `style.background` passed to `botMessageStyle` or `userMessageStyle`.
- Typing indicator not showing up when messages had delay/typing as webchat didn't scroll to bottom.
- Now typing and delay work properly in production.
- Remove errors prompted in browser developer's console by changing dep `@rebass/grid` to `rebass`.
- Carousels with just one element won't be broken.
- Using `staticAsset` in `custom-webchat` template that produced a bug in production.

[0.10.0]: https://github.com/hubtype/botonic/releases/tag/v0.10.0
[0.10.1]: https://github.com/hubtype/botonic/releases/tag/v0.10.1
[0.11.0]: https://github.com/hubtype/botonic/releases/tag/v0.11.0
