# Botonic Plugin NER

## What does this plugin do?

Botonic Plugin NER uses the trained models defined by the user to recognize named entities inside the input text.

After detecting the text locale, and using the corresponding model to recognize the entities, extra information about the recognized entities is added to the input message.

## Install the plugin

From your project, install the plugin by using the following command:

```bash
npm install @botonic/plugin-ner
```

> **Note**: Windows users should first use the command
> `npm install --global --production windows-build-tools --vs2015`

## Require the plugin

The plugin must be required in the `src/plugins.js` and the locales of the trained models must be defined in their options.

**Locales order matters.** In case locale detection fails, the first one in the array will be used as a fallback.

```javascript
export const plugins = [
  {
    id: 'ner',
    resolve: require('@botonic/plugin-ner'),
    options: {
      locales: ['en', 'es'],
    },
  },
]
```
