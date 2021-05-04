# Botonic Plugin Text Classification

## What does this plugin do?

Botonic Plugin Text Classification uses the trained models defined by the user to classify the input text.

After detecting the locale of the text, and using the corresponding model to predict the class, extra information about the intent of the user is added to the input message.

## Install the plugin

From your project, install the plugin by using the following command:

```bash
npm install @botonic/plugin-text-classification
```

> **Note**: Windows users should first use the command
> `npm install --global --production windows-build-tools --vs2015`

## Require the plugin

The plugin must be required in the `src/plugins.js` and the locales of the trained models must be defined in their options.

**Locales order matters.** In case locale detection fails, the first one in the array will be used as a fallback.

```javascript
export const plugins = [
  {
    id: 'text-classification',
    resolve: require('@botonic/plugin-text-classification'),
    options: {
      locales: ['en', 'es'],
    },
  },
]
```
