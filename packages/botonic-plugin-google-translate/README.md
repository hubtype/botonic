# Botonic Plugin Google Translate

## What does this plugin do?
This plugin uses [Google Cloud Translation API](https://cloud.google.com/translate) to translate the user input text and detect its language.

## Setup

### Install the plugin
To install this plugin, you only need to execute the following command:

```bash
npm i @botonic/plugin-google-translate 
```

### Enable Cloud Translation API
Before using this plugin, you need a project that has the Cloud Translation API enabled and its credentials. See [Cloud Translation Set Up Guide](https://cloud.google.com/translate/docs/setup).

### Add the plugin

You need to add the following configuration to your bot's plugins:

```js
export const plugins = [
    {
        id: 'google-translate',
        resolve: require('@botonic/plugin-google-translate'),
        options: {
            credentials: {
                privateKeyId: '',
                privateKey: '',
                projectId: '',
                clientEmail: '',
            },
            translateTo: ['ca', 'it', 'ro'],
            whitelist: ['en', 'es'],
        },
    },
]
```

> **Note:** Credentials definition is case-sensitive: make sure you correctly define them.

This plugin has two parameters:
- **`translateTo`**: languages we want to translate the input text to.
- **`whitelist`**: **optional** parameter that defines the allowed languages for language detection. If the detected language is not included in the whitelist, the `session.__locale` is used.

> **Important**: all languages are specified using its [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code.

## Use

Once the plugin has translated the input text and detected the language, this information will be available in the input object.