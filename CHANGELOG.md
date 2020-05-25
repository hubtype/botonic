# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>
</details>

## [0.12.0] - 2020-26-05

### Added

- [Project](https://github.com/hubtype/botonic)

  - Added [ESLint Limit Cyclomatic Complexity](https://eslint.org/docs/rules/complexity) for all projects.
  - Added Pull Request Templates.
  - Scripts to count lines of code on each package.
  - Added new documentation built with `Docusaurus`. Check it out at https://docs.botonic.io/.

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - Enable more checks in `tsconfig.json`.

- [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - Allow transferring conversations to an agent with its identifier (id or email) with `withAgentId(agentId)` or `withAgentEmail(agentEmail)` method of `HandOffBuilder`. Now `queue`is not mandatory. The case will be assigned to the first queue which agent belongs.
  - Added `getAgentVacationRanges` to know availability of agents.
  - Added more `router`tests.
  - Type definitions improvement in `index.d.ts`.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - General features:

    - Type definitions improvement in `index.d.ts`.
    - Improved `Text.serialize` method.

  - New webchat features:

    - **Breaking change**: Now the text of a `Button/Reply` is sent along with its payload. You can use `button: {messageType: 'postback'}` in `webchat/index.js` to enable the previous behavior.
    - **Breaking change**: Markdown will be rendered by default within all the `Text` components. If you want to disable it, you can declare the component as follows:  
      `<Text markdown={false}>Your text</Text>`.
    - Be able to pass additional styles to `Custom Messages`.
    - Persistent Menu customizable with property `customPersistentMenu` in `webchat/index.js`.
    - Persistent Menu button customizable with property `customMenuButton`.
    - Possibility to enable timestamps in messages.
    - Added unit tests for Webchat.
    - More adaptable Webchat in iOS.

  - Multichannel:

    - Customize `Multichannel` visualization.
    - `Multichannel` to support letter indexes.
    - Compact `Multichannel` `Text` and `Carousel`.
    - `Multichannel` to allow separating messages with custom string.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Allow passing `Normalizer` to `CMS`.
  - Added markup support for WhatsApp and Markdown.
  - Added stemmers/tokens for Russian.
  - Now normalizer throws an exception for empty texts.
  - Keyword search now sets the result's score field

* [@botonic/plugin-inbenta](https://www.npmjs.com/package/@botonic/plugin-inbenta)

  - Added new package `@botonic/plugin-inbenta` to integrate the Inbenta Knowledge Management API. Please refer to its README for more information.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - Move most `eslint` rules config to root `.eslintrc.js`.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Move `webchatReducer` to its own file.
  - Split `webchatReducer` to reduce its complexity.
  - Unify calls to `renderBrowser`/`renderNode`.
  - Update `emoji-picker-react` to latest version `3.7.1` (it changes visually).

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Upgrade `node-nlp` dependency.
  - Use `ContextWithLocale` if locale required.

### Fixed

- [Project](https://github.com/hubtype/botonic)

  - `pre-commit` was not aborting when `lint` failed
  - Fix several `eslint` warnings.

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)
  - Preserve `src/nlu` directories for all templates (added `.gitkeep` file). Remove these files before running `botonic train`.
  - Add missing calls with `await`.
  - Use `rimraf` in favor of `fs.rmdirSync`.
  - Templates: Call `CleanWebpackPlugin` with  
    `{ cleanOnceBeforeBuildPatterns: ['dist'] }` to prevent occasional builds from crashing. We strongly suggest to add this line in your bot's `webpack.config.js` if updating from previous versions.

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Fixed sending wrong payloads when a handover was ended in `botonic serve` mode.
  - `postMessage` promises were not forwarded.
  - Better scrollbar handling when Webchat is hovered.
  - Limit attachment sizes to 10MB.
  - Fix attachments crashing in production build for Webchat (media messages will be no longer stored as binary data in local storage, so the content will only be available temporarily in `botonic serve` mode).
  - Now the Webchat's theme properties `message.bot.image`, `header.image`, `intro.image` and `triggerButton.image` accept URLs.
  - Fix issue causing Botonic Logo to be visible during few milliseconds in production.
  - Handle parent page scrolling issues in Webchat for iOS.

* [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)
  - `BotonicMsgConverter` was not using `replaceEmptyStringsWith` option with value.
  - New operations to clone Contents performing composable transformations.
  - New operations which traverse the chain of followUp fields of MessageContent's
  - When calculating the match substring and score between an utterance and a keyword, prefer tokens to stems when comparing to keywords.

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
[0.12.0]: https://github.com/hubtype/botonic/releases/tag/v0.12.0
