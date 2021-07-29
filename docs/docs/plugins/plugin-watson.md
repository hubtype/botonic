---
title: Plugin Watson
id: plugin-watson
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-watson)**.

---

## What Does This Plugin Do?

This plugin allows you to integrate [Watson Assistant v2](https://cloud.ibm.com/apidocs/assistant/assistant-v2) in your Botonic project.

Once installed within your project, this plugin will send the user input to a workspace and receive a response.

The plugin retrieves the call results to enhance the `input` object. You can then use this data in your routes and actions.

Example of an `input` object received from a user:

```typescript
{
  type: "text",
  data: "I want to return this jacket."
}
```

Example of the same `input` object after being processed by this plugin:

```typescript
{
  type: 'text',
  data: 'I want to return this jacket.',
  intent: 'return-product',
  confidence: 0.9556,
  intents: [{ intent: 'return-product', confidence: 0.9556 }]
  entities: [{ entity: 'product', location: [22, 28], value: 'jacket', confidence: 1 }],
}
```

## Setup

1. Install the plugin from npm (or yarn):

```
npm i --save @botonic/plugin-watson
```

2. Add it to the `src/plugins.js` file by using the following options from Watson:

- `apikey`
- `url`
- `assistant_id`
- `version` (optional)

```typescript
export const plugins = [
  {
    id: 'watson',
    resolve: require('@botonic/plugin-watson'),
    options: {
      apikey: 'apikey',
      url: 'url',
      assistant_id: 'assistant_id',
      version: 'version',
    },
  },
]
```

## Use

You can use it in your routes like any other NLU plugins:

```typescript
export const routes = [{ intent: 'return-product', action: ReturnProduct }]
```
