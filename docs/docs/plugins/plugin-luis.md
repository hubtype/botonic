---

title: Plugin Luis
id: plugin-luis

---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-luis)**.

---

## What Does This Plugin Do?

Botonic plugin that use [LUIS](https://www.luis.ai/) as NLU service. The variables `intent`, `confidence`, `entities` and `intents` will be automatically available inside the `input` object.

## Setup

To integrate your bot with Luis, you must use the `intent` template, which comes with @botonic/plugin-luis by default.

1. Run `botonic new test-bot intent` to install the plugin automatically.
2. Add the plugin to the `src/plugins.js` file.

```javascript
export const plugins = [
  {
    id: 'luis',
    resolve: require('@botonic/plugin-luis'),
    options: {
      region: 'YOUR_REGION',
      appID: 'YOUR_APP_ID',
      endpointKey: 'YOUR_ENDPOINT_KEY',
    },
  },
]
```

## Use

1. Import the plugin in **src/index.js**.
   **src/index.js**
   ```javascript
   export { routes } from './routes'
   export { locales } from './locales'
   export { plugins } from './plugins'
   export { webchat } from './webchat'
   export { webviews } from './webviews'
   ```
