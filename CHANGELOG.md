# Changelog

All notable changes to Botonic will be documented in this file.

## [Unreleased]

<details>
  <summary>
    Changes that have landed in master but are not yet released.
    Click to see more.
  </summary>
</details>

## [0.18.0] - 2020-02-02

### Added

- [Project](https://github.com/hubtype/botonic)

  - Added configuration to measure code coverage with LCOV [#1232](https://github.com/hubtype/botonic/pull/1232) and [#1233](https://github.com/hubtype/botonic/pull/1233).
  - Updated documentation for `Shadow DOM`, `Webchat Storage` and `Handoff` functionalities, [#1246](https://github.com/hubtype/botonic/pull/1246).

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - [Improved Botonic CLI's telemetry](https://github.com/hubtype/botonic/pull/1243) to track usage of installed CLI and botonic dependencies and [keep track of errors](https://github.com/hubtype/botonic/pull/1290) on project initialization.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Added NLP support [for Slovenian](https://github.com/hubtype/botonic/pull/1247).
  - Added NLP support [for Hungarian](https://github.com/hubtype/botonic/pull/1248).
  - Added NLP support [for Dutch](https://github.com/hubtype/botonic/pull/1249).
  - Added NLP support [for Bulgarian](https://github.com/hubtype/botonic/pull/1250).

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - **New webchat features**:
    - Added [disabling buttons](https://github.com/hubtype/botonic/pull/1245). Configurable at:
      - **Theme level**: `theme.button.autodisable` and `theme.button.disabledstyle`.
      - **Component level**: by passing the props `autodisable` and `disabledstyle` to `Button` components.

### Changed

### Fixed

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - [Reimplemented `StemmerUK`](https://github.com/hubtype/botonic/pull/1289) to provide support for Safari browser.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - [Fixed typings](https://github.com/hubtype/botonic/pull/1262).
  - Fixed scroll to bottom for [mobile devices](https://github.com/hubtype/botonic/pull/1263).

## [0.17.0] - 2020-18-12

### Added

- [Project](https://github.com/hubtype/botonic)

  - Improved [Getting started](https://github.com/hubtype/botonic/pull/1138) docs.
  - Moved templates and examples to [botonic-examples](https://github.com/hubtype/botonic-examples) repo.
  - Added [script](https://github.com/hubtype/botonic/pull/1134) to update releases in docs.
  - Set up `Codecov` for Botonic and trigger Github Workflows only when necessary. [#1177](https://github.com/hubtype/botonic/pull/1177).
  - [Adapted code for Botonic packages](https://github.com/hubtype/botonic/pull/1183) in order to support **Webpack 5** and [upgraded examples](https://github.com/hubtype/botonic-examples/pull/5) to this version.

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - Botonic CLI to [download examples](https://github.com/hubtype/botonic/pull/1134) directly from [botonic-examples](https://github.com/hubtype/botonic-examples).
  - Improved analytics and fixed spawn processes in Windows (`botonic serve`, `botonic train`). Now it is no longer necessary to run `npm run start`. [#1176](https://github.com/hubtype/botonic/pull/1176)

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Added NLP support [for Croatian](https://github.com/hubtype/botonic/pull/1120).
  - Added NLP support [for Slovak](https://github.com/hubtype/botonic/pull/1132).
  - Added [new method](https://github.com/hubtype/botonic/pull/1118) to get all the locales of a contentful space.
  - Lazy loading of language engines. [#1160](https://github.com/hubtype/botonic/pull/1160) and [#1194](https://github.com/hubtype/botonic/pull/1194)

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - **New webchat features**:
    - Added [new Shadow DOM feature](https://github.com/hubtype/botonic/pull/1020) to avoid webchat's CSS conflict with the host page of your website.
    - Added [Facebook's multichannel](https://github.com/hubtype/botonic/pull/1133) converter for texts.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - [Refactored](https://github.com/hubtype/botonic/pull/1121) project scripts and organization.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - [Improved types](https://github.com/hubtype/botonic/pull/1136).

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Improved CSV handling [#1116](https://github.com/hubtype/botonic/pull/1116) and [#1117](https://github.com/hubtype/botonic/pull/1117).
  - Made `buttonStyle` undefined if not specified and added new `renderOption` to specify default `buttonStyle`. [#1174](https://github.com/hubtype/botonic/pull/1174)

### Fixed

- [Project](https://github.com/hubtype/botonic)

  - Fixed [broken links](https://github.com/hubtype/botonic/pull/1172).

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Avoid [circular dependencies](https://github.com/hubtype/botonic/pull/1135).
  - [Fixed webchat behavior](https://github.com/hubtype/botonic/pull/1175) when `user ID` was lost, causing some webchat's to not load correctly.

## [0.16.0] - 2020-20-11

### Added

- [Project](https://github.com/hubtype/botonic)

  - Added [license MIT and keywords](https://github.com/hubtype/botonic/pull/1037) to every package.
  - Enabled [code scaning](https://github.com/hubtype/botonic/commit/36c3d848cec3339da6b40d943eab8ca79254f5b5).
  - Updated [Botonic's README](https://github.com/hubtype/botonic/commit/f5d684a5c4600826278c3e9fd3f6b31f635041b0).
  - Added [Deployment Guide](https://botonic.io/docs/deployment/hubtype).
  - Improved [Continuous Integration](https://github.com/hubtype/botonic/pull/1065) docs.
  - [Configured eslint import sorter](https://github.com/hubtype/botonic/commit/685f15d2f7004fbf118300e9d353c36b1b3ba155).
  - Added [Botonic Examples](https://botonic.io/examples/) section [#1091](https://github.com/hubtype/botonic/pull/1091).
  - Added auto publish script.

* [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - Added **new** matcher `request matcher` and pass `lastRoutePath` to current bot context. [#1086](https://github.com/hubtype/botonic/pull/1086)

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Added NLP support [for Romanian](https://github.com/hubtype/botonic/pull/1109).
  - Added NLP support [for Greek](https://github.com/hubtype/botonic/pull/1110).
  - Added NLP support [for Czech](https://github.com/hubtype/botonic/pull/1113).
  - Added NLP support [for Ukrainian](https://github.com/hubtype/botonic/pull/1114).

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Added [webchat component tests](https://github.com/hubtype/botonic/pull/1023)
  - **New webchat features**:
    - Added [Error Boundary](https://github.com/hubtype/botonic/commit/7a71b3dad31841fea96d800a0369c3c41cabc9d4) for `customMessage`.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - Renamed [`doc-botonic` to `docs`](https://github.com/hubtype/botonic/commit/82ef75b89f1f064ba62912d1fac8a572871eb882).
  - [Rewritten webchat docs and added several updates](https://github.com/hubtype/botonic/pull/1071).

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Improved types:
    - [Fixed types for isMobile, mobileStyle & webchat button](https://github.com/hubtype/botonic/commit/ffd5c4faff7ffe29577a127913bc95437615542c)
    - [Made ScrollbarProps field types optional](https://github.com/hubtype/botonic/commit/776ad92d450c7bcc6103be8c4642fb039945db03)
    - [Typed message.timestamps.enable](https://github.com/hubtype/botonic/commit/d10cd5a9e1a7133691adbc19c5ba92680b08272a)
    - [Added type for ScrollbarProps.autoHide](https://github.com/hubtype/botonic/commit/10f4b15bbeea66ad16333d9a5a0f4c8bf2f617b1)
    - [Added style field to ThemeProps](https://github.com/hubtype/botonic/commit/592427539a0e5d223531186b5c94949f38db74da)
    - [Fixed TS types](https://github.com/hubtype/botonic/pull/1069)
    - [Added `_hubtype_case_status` and `typification` fields](https://github.com/hubtype/botonic/pull/1104)
  - [Refactored utils](https://github.com/hubtype/botonic/pull/1067) for better maintainability.
  - [Improved webchat tests](https://github.com/hubtype/botonic/pull/1066).

- [@botonic/nlu](https://www.npmjs.com/package/@botonic/nlu)

  - Upgrade `tfjs` to [2.7.0](https://github.com/hubtype/botonic/commit/3d42d12562ab5196b5f8a113387a60feb90b3fed).

* [@botonic/plugin-nlu](https://www.npmjs.com/package/@botonic/plugin-nlu)

  - Upgrade `tfjs` to [2.7.0](https://github.com/hubtype/botonic/commit/3d42d12562ab5196b5f8a113387a60feb90b3fed).

### Fixed

- [Project](https://github.com/hubtype/botonic)

  - Fixed [broken links](https://github.com/hubtype/botonic/pull/1037) in READMEs.
  - Fixed [`Was this article useful?` widget](https://github.com/hubtype/botonic/commit/4d1ea02836c4f29a4d51d9aff1081afa7647dc3f).

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - [Fixed params request](https://github.com/hubtype/botonic/pull/1070) failing in `Oauth 3.1.0+`.

- [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - Now `getRoute` [checks correctly](https://github.com/hubtype/botonic/pull/903) if the input matches with a `childRoute`.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Added [missing storage key in constructor](https://github.com/hubtype/botonic/pull/1039), now `storageKey` works as expected.
  - Automatically [call `onMessage`](https://github.com/hubtype/botonic/pull/1056) when receiveng messages coming from server-side.
  - Added missing call to `stringifyWithRegexs` causing some regexes not being updated in local/session storages. Fixed react warnings (produced by `npm run test`), log deprecated props in custom messages. [#1063](https://github.com/hubtype/botonic/pull/1063)
    Deprecated props:
    - **`enableTimestamps` => `enabletimestamps`**
    - **`imagesStyle` => `imagestyle`**
  - Fixed sending of unsent inputs to be [more consistent](https://github.com/hubtype/botonic/pull/1041).
  - [Fixed `onClose`](https://github.com/hubtype/botonic/commit/03ce2ec264181df537fd9c8c3695e362f48bfd05) being called on the very first render of the app.
  - [Fixed](https://github.com/hubtype/botonic/pull/1108) `WebchatSettings` component not updating settings correctly.
  - [Set ack to 1](https://github.com/hubtype/botonic/commit/03e2fa3cac6ee40bb5a83388a5b40b082f26d0ce) for custom user messages by default.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - The csv importer of texts, which was coming from content translator, now groups all the fields from the same content. [#1036](https://github.com/hubtype/botonic/pull/1036).

## [0.15.0] - 2020-27-10

### Added

- [Project](https://github.com/hubtype/botonic)

  - New botonic.io [website](https://github.com/hubtype/botonic/pull/1014).

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - New webchat features:

    - Added new [`target`](https://github.com/hubtype/botonic/pull/970) prop to `Button` component to define the behavior to open links.
    - Added new [`WhatsappTemplate`](https://github.com/hubtype/botonic/pull/972) component for Webchat.
    - New [`getBotonicApp()`](https://github.com/hubtype/botonic/pull/1018) to access `Botonic` methods.
    - Added a new webchat setting [`storageKey`](https://github.com/hubtype/botonic/pull/1019) that indicates the key name to use in order to store the webchat state in `localStorage` (or `sessionStorage`).

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - [Improvements](https://github.com/hubtype/botonic/pull/985) in Content.validate of text & shortText fields

    - Validate text.text even if the content has no keyword (it could be accessed through a button)
    - Before, when shortText was empty, the Contentful driver used to set it with the value of the name field (to ensure buttons did not show blank texts). Now this is managed by the Button model, so that MessageContent.validate() can report it.
    - Improved [ContentsValidator](https://github.com/hubtype/botonic/pull/1001). Now it's possible to report the detected errors into a callback.

  - New [CMS method](https://github.com/hubtype/botonic/pull/1002) to deliver content by id when the content type is unknown.
  - Added NLP support for German.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - [Improved script](https://github.com/hubtype/botonic/pull/971) to automatically bump versions for Botonic packages (it also updates references to other Botonic dependencies).
  - Improved documentation

* [@botonic/nlu](https://www.npmjs.com/package/@botonic/nlu)

  - Refactored and migrated NLU engine to Typescript. Read the new docs [here](https://github.com/hubtype/botonic/blob/master/packages/botonic-nlu/README.md).

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Allow passing properties to [CoverComponent](https://github.com/hubtype/botonic/pull/899).
  - Remove Webchat `user` references in favor of [`session.user`](https://github.com/hubtype/botonic/pull/988).
  - Improved [types](https://github.com/hubtype/botonic/pull/999) for Webchat and Webchat Context.

- [@botonic/plugin-nlu](https://www.npmjs.com/package/@botonic/plugin-nlu)

  - Refactored and migrated plugin to Typescript. Read the new docs [here](https://github.com/hubtype/botonic/blob/master/packages/botonic-plugin-nlu/README.md).

### Fixed

- [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - [Fixed](https://github.com/hubtype/botonic/pull/1015) imports in templates which were broken after 0.14.0 change in entry files.
  - Added validation of templates and examples in CI

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - `session` properties now are [merged and updated](https://github.com/hubtype/botonic/pull/973) correctly.
  - Avoid [customMessage to crash](https://github.com/hubtype/botonic/pull/1000) if they have bad children. Some bots may store no-react objects in children.
  - [Fixed](https://github.com/hubtype/botonic/pull/1017/) error appearing in some tests: `Received true for a non-boolean attribute markdown`. Caused by styled-components.

## [0.14.0] - 2020-01-10

### Added

- [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - New bot template `dynamo` using Botonic dynamoDB plugin from a JS bot.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Improved behavior when end user messages are lost due to connection issues. Missed inputs will be resent when connection is regained.
  - End user messages will be displayed with less opacity until they are correctly delivered to the server.
  - Added classNames to blob messages by default, under the following format:
    `{type}-{from} {customTypeName}`
    e.g.: Text messages from user -> `text-user`
    e.g.: Custom messages from bot -> `custom-bot my-custom-message-name`
  - Passing `mobileStyle` in `webchat/index.js`is now allowed.
  - Added arrow buttons for better interaction with Webchat Carousels. They can be customized.
  - Disabling timestamps in the custom Messages using the `enableTimestamps` prop is now allowed.
  - Defined where to store the botonicState using the variable storage.
  - The methods `openCoverComponent`, `closeCoverComponent` and `toggleCoverComponent` are available in the browser, through the Botonic object, so that the `coverComponent` can be shown/hidden manually.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Decorator for Contentful that can distribute the delivery requests amongst different spaces/environments.
  - Added a new tool to modify the locales of Contentful spaces exported as json file with "contentful space export". The tool is able to change the name of a locale without altering the contents and to remove unwanted locales.
  - Added a tool to duplicate the value of reference fields into a new locale. Reference fields (assets or links to other contents) will typically be the same for all locales, but not always. So we initially link them all to the same target for all locales. The tool is useful to migrate a space where fallback locales are used to another where locales have no fallback.
  - The NLP package now supports locales whose name include the country (eg. es_ES).
  - Added an option for Contentful plugin to be able to change the name of the locale when sent to Contentful.
  - Added `logCall` flag to `contentfulOptions` in order to log creation configuration, as well as all calls performed to the CMS.
  - Added class ContentsValidator, which validates that all contents of a locale can be correctly delivered.
  - Added NLP support for Turkish.
  - Added NLP support for Italian.
  - Added NLP support for French.

* [@botonic/plugin-google-analytics](https://www.npmjs.com/package/@botonic/plugin-google-analytics)

  - New Botonic plugin to track user interaction or bot's behaviour in Google Analytics.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - Upgraded typescript to 4.0.2.
  - Upgraded eslint plugins and fixed new warnings.
  - Improved documentation and reestructure.

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - Improved `index.d.ts` definitions.
  - **Breaking change**: Added `/webpack-entries` to every template to ensure that Webpack's tree-shaking is done and modified `webpack.config.js` as a consequence. This reduces the bundle sizes of every bot. From developers upgrading their projects from version `0.13.0` the following changes will be necessary:
    1. Create a new directory called `webpack-entries` under bot project's root folder. Copy `dev-entry.js`, `node-entry.js`, `webchat-entry.js` and `webviews-entry.js` inside. You can find them [here](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/blank/webpack-entries).
    2. Modify the following lines in `webpack.config.js`:
    - In `botonicDevConfig` modify the line for `entry` to be: `path.resolve('webpack-entries', 'dev-entry.js'),`
    - In `botonicWebchatConfig` modify the line for `entry` to be: `path.resolve('webpack-entries', 'webchat-entry.js'),`
    - In `botonicWebviewsConfig` modify the line for `entry` to be: `path.resolve('webpack-entries', 'webviews-entry.js'),`
    - In `botonicServerConfig` modify the line for `entry` to be: `path.resolve('webpack-entries', 'node-entry.js'),`

- [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - Improved `index.d.ts` definitions.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Refactored timestamps. They can be enabled by setting `theme.message.timestamps.enable` to `true`. (Default format will be as follows: `29 Jun, 12:40:07`). The content can be formatted by defining a function under `theme.message.timestamps.format` which returns a string with the formatted date and their styles under `theme.message.timestamps.style`.
  - Improved `index.d.ts` definitions.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)
  - Check empty text in Text contents.

### Fixed

- [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - Added the export of `getAvailableAgentsByQueue`, which was not accessible.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Removed `moment` dependency to reduce bundle size.
  - Closed `PersistentMenu` automatically when the end user clicks outside.
  - Fixed webchat properties not being properly read by deep merging properties.
  - Disabled text input when `CoverComponent`is shown.
  - Added missing `animationsEnabled` prop.
  - Now Custom Message Types can be used together with the Reply component.
  - Deactivated markdown in webchat when viewing messages using WhatsApp provider.
  - Sending messages with only spaces is now avoided.
  - Renamed theme property `hoverText` to `hoverTextColor` in button.jsx so that changing the text color of a button on hover can work.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Fixed bug in Contentful Schedule, where schedule was miscalculating around midnight. It was not taking the timezone offset into account to calculate the weekday.

## [0.13.0] - 2020-15-06

### Added

- [Project](https://github.com/hubtype/botonic)

  - Scripts to upgrade dependencies, prepare botonic packages and update packages version.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - New webchat features:

    - Added support for custom Cover Component which will be shown when the chat is initiated. You can use it in order to collect information from enduser just before to start the conversation.
    - Now webchat will be displayed depending on the settings present in Hubtype Desk (set `visibility: 'dynamic'` in **webchat/index.js** to enable them, or as a parameter in `Botonic.render({appId:'YOUR_APP_ID', visibility: 'dynamic'})`. You can also pass a custom value or a custom function returning a boolean to handle webchat visbility (also through `visibility` option).
    - Added `Botonic.getVisibility()` function which returns a promise resolving to true or false depending on Hubtype Desk webchat visibility settings.
    - Added new `WebchatSettings` component to allow changing webchat features and styles dynamically.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - Updated breaking `uuid` dependencies.
  - Migrated documentation from Docusaurus v1 to v2 for better support.

### Fixed

- [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)

  - Optimized bundle sizes for templates by using moment-locales-webpack-plugin: updated template dependencies and webpack.config
  - Updated intent template (improved flow and more detailed descriptions to be less confusing for the developer)

- [@botonic/core](https://www.npmjs.com/package/@botonic/core)

  - Construct headers dynamically to ensure bad headers are not sent to the backend

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Fixed enduser inputs to only process links instead of full markdown. Allow also custom messages defined with from `user` props.
  - Fixed wrong value being send when button of persistent menu is clicked and its text is send to the chat.
  - Fixed and updated Facebook `Messenger Extensions SDK` which was causing issues with Webviews.
  - Added missing webchat property `enableUserInput`.
  - Fixed carousel disaligned buttons styles to be at same height

* [@botonic/nlu](https://www.npmjs.com/package/@botonic/nlu)

  - Fixed nlu processing hidden files. This affected on the results obtained in development mode.
  - Updated and freezed `@tensorflow/tfjs-node` and `@tensorflow/tfjs` dependencies to 1.7.3 which were automatically updating to higher versions with bugs, introducing bugs to training processes.

- [@botonic/plugin-inbenta](https://www.npmjs.com/package/@botonic/plugin-inbenta)

  - Added a session token to Inbenta search queries to track user actions.

- [@botonic/plugin-nlu](https://www.npmjs.com/package/@botonic/plugin-nlu)

  - Updated and freezed `@tensorflow/tfjs` to 1.7.3.

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

  - Transferring conversations to an agent is allowed with its identifier (id or email) with `withAgentId(agentId)` or `withAgentEmail(agentEmail)` method of `HandOffBuilder`. Now queue is not mandatory. The case will be assigned to the first queue which agent belongs.
  - `getAgentVacationRanges` is added to know availability of agents.
  - More router tests.
  - Type definitions improvement in `index.d.ts`.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - General features:

    - Type definitions improvement in `index.d.ts`.
    - Improved `Text.serialize` method.

  - New webchat features:

    - **Breaking change**: The text of a Button/Reply is now sent along with its payload. You can use `button: {messageType: 'postback'}` in `webchat/index.js` to enable the previous behavior.
    - **Breaking change**: Markdown is rendered by default within all the Text components. To disable it, you can declare the component as follows:
      <Text markdown={false}>Your text</Text>.
    - Be able to pass additional styles to `Custom Messages`.
    - Persistent Menu customizable with property `customPersistentMenu` in `webchat/index.js`.
    - Persistent Menu button customizable with property `customMenuButton`.
    - Possibility to enable timestamps in messages.
    - More unit tests added for Webchat.
    - More adaptable Webchat in iOS.

  - Multichannel:

    - Customize `Multichannel` visualization.
    - `Multichannel` to support letter indexes.
    - Compact `Multichannel` `Text` and `Carousel`.
    - `Multichannel` to allow separating messages with custom string.

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Passing Normalizer to CMS is now allowed.
  - Markup support for WhatsApp and Markdown.
  - Stemmers/tokens for Russian.
  - Normalizer now throws an exception for empty texts.
  - Keyword search now sets the result's score field

* [@botonic/plugin-inbenta](https://www.npmjs.com/package/@botonic/plugin-inbenta)

  - Added new package `@botonic/plugin-inbenta` to integrate the Inbenta Knowledge Management API. Please refer to its README for more information.

### Changed

- [Project](https://github.com/hubtype/botonic)

  - Most eslint rules config have been moved to root `.eslintrc.js`.

* [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - `webchatReducer` moved to its own file.
  - `webchatReducer` split to reduce complexity.
  - Calls to `renderBrowser`/`renderNode` unified.
  - `emoji-picker-react` updated to latest version 3.7.1 (visual changes).

- [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)

  - Upgraded `node-nlp` dependency.
  - Use of `ContextWithLocale` if locale required.

### Fixed

- [Project](https://github.com/hubtype/botonic)

  - pre-commit was not aborting when lint failed.
  - Fixed several eslint warnings.

* [@botonic/cli](https://www.npmjs.com/package/@botonic/cli)
  - Preserved `src/nlu` directories for all templates (added `.gitkeep` file). Remove these files before running botonic train.
  - Added missing calls with `await`.
  - Used `rimraf` in favor of `fs.rmdirSync`.
  - Templates: Call `CleanWebpackPlugin` with  
    `{ cleanOnceBeforeBuildPatterns: ['dist'] }` to prevent occasional builds from crashing. We strongly suggest to add this line in your bot's `webpack.config.js` if updating from previous versions.

- [@botonic/react](https://www.npmjs.com/package/@botonic/react)

  - Fixed sending wrong payloads when a handover was ended in `botonic serve` mode.
  - `postMessage` promises are now forwarded.
  - Better scrollbar handling when Webchat is hovered.
  - Limit attachment sizes to 10MB.
  - Fixed attachments crashing in production build for Webchat (media messages will be no longer stored as binary data in local storage, so the content will only be available temporarily in `botonic serve` mode).
  - Webchat's theme properties such `message.bot.image`, `header.image`, `intro.image` and `triggerButton.image` are now accepting URLs.
  - Fixed issue causing Botonic Logo to be visible during few milliseconds in production.
  - Handled parent page scrolling issues in Webchat for iOS.

* [@botonic/plugin-contentful](https://www.npmjs.com/package/@botonic/plugin-contentful)
  - `BotonicMsgConverter` is now using `replaceEmptyStringsWith` option with value.
  - New operations are available to clone Contents performing composable transformations.
  - New operations are available to traverse the chain of followUp fields of MessageContent.
  - When calculating the match substring and score between an utterance and a keyword, tokens are preferred to stems when comparing to keywords.

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
[0.13.0]: https://github.com/hubtype/botonic/releases/tag/v0.13.0
[0.14.0]: https://github.com/hubtype/botonic/releases/tag/v0.14.0
[0.15.0]: https://github.com/hubtype/botonic/releases/tag/v0.15.0
[0.16.0]: https://github.com/hubtype/botonic/releases/tag/v0.16.0
[0.17.0]: https://github.com/hubtype/botonic/releases/tag/v0.17.0
[0.18.0]: https://github.com/hubtype/botonic/releases/tag/v0.18.0
