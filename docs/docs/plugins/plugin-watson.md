---
title: Plugin Watson
id: plugin-watson
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-watson)**.

---

## What Does This Plugin Do?

This plugin allows you to integrate [Watson Assistant v1](https://cloud.ibm.com/apidocs/assistant/assistant-v1) in your Botonic project. It works like any other AI/NLU services plugin, like Dialogflow, LUIS, etc.

Once installed within your project, this plugin will send the user input to a workspace and receive a response.

The plugin retrieves the call results to enhance the `input` object. You can then use this data in your routes and actions.

Example of an `input` object received from a user:

```
{
    "type": "text",
    "data": "What's the weather?"
}
```

Example of the same `input` object after being processed by this plugin:

```
{
    "type": "text",
    "data": "What's the weather?",
    "intent": "getWeather",
    "confidence": 0.9485,
    "intents": [],
    "entities": []
}
```

## Setup

1. Install the plugin from npm (or yarn):

```
npm i --save @botonic/plugin-watson
```

2. Add it to the `src/plugins.js` file by using the `apikey`, the `url` and `workspace_id` from Watson:

```
export const plugins = [
  {
    id: 'watson',
    resolve: require('@botonic/plugin-watson'),
    options: {
      apiKey: 'apikey',
      url: 'url',
      workspaceId: 'workspace_id',
    },
  },
]
```

## Use

You can use it in your routes like any other NLU plugins:

```
export const routes = [{ intent: 'getWeather', action: ShowForecast }]
```
