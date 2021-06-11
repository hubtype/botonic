# Botonic Plugin Google Translate

## What does this plugin do?
This plugin uses [Google Cloud Translation API](https://cloud.google.com/translate) to detect the language of the user input text.

## Setup

### Install the plugin
To install this plugin, you only need to execute the following command:

```bash
npm i @botonic/plugin-google-translate 
```

### Enable Cloud Translation API
Before using this plugin, you need a project that has the Cloud Translation API enabled and its credentials. See [Cloud Translation Set Up Guide](https://cloud.google.com/translate/docs/setup).

### Add the plugin

To being able of using this plugin to detect the language of the user input text, you need to have it installed and added to your plugins.

> **Note:** This is case-sensitive so make sure to correctly define your credentials.

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
        },
    },
]
```

You can also add a **whitelist** parameter to filter the detected languages:

```js
export const plugins = [
    {
        id: 'google-translate',
        resolve: require('@botonic/plugin-google-translate'),
        options: {
            whitelist: ['en', 'es', 'it'],
            credentials: {
                privateKeyId: '',
                privateKey: '',
                projectId: '',
                clientEmail: '',
            },
        },
    },
]
```

If this whitelist is defined and none of the specified languages match the detected ones, `'en'` will be set as default.

## Use

If you want to check the language of the user input text, you only need to take a look at the `__locale` variable of the current session.
