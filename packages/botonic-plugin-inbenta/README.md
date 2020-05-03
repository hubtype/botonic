# Botonic Plugin Inbenta

## How it works

This plugin allows you to integrate [Inbenta Knowledge Management API](https://developers.inbenta.io/knowledge-management/km-api/api-setup) in your Botonic project.

It works the same way that all the other plugins for AI/NLU services like Dialogflow, Watson, etc. Once installed in your project, this plugin will send all text inputs that users send your bot and will query Inbenta API. This plugin will use the results of that call to enhance the `input` object so you can use that data in your routes and actions.

This is an example of an `input` object that is received from a user:

```
{
    "type": "text",
    "data": "Where's my order?"
}
```

This is the same `input` obejct after being processed by this plugin:

```
{
    "type": "text",
    "data": "Where's my order?"
    "intent": "order-location"
    "confidence": 0.876545
    "intents": []  // The raw response from Inbenta API
    "entities": []  // Currently not supported
}
```

## Install and configure

1. Install the plugin from npm (or yarn):

```
npm i --save @botonic/plugin-inbenta
```

2. Add it to the `src/plugins.js` file (you'll need the API_KEY and API_SECRET from Inbenta):

```
export const plugins = [
  {
    id: 'inbenta',
    resolve: require('@botonic/plugin-inbenta'),
    options: {
      API_KEY: 'ACB',
      API_SECRET: 'XYZ',
    },
  },
]
```

## How to use

You can use it in you routes as you would with other NLU plugins:

```
export const routes = [{ intent: 'order-location', action: OrderLocation }]
```

Or in your actions:

```
import React from 'react'
import { Text } from '@botonic/react'

export default class OrderLocation extends React.Component {
  static async botonicInit({ input }) {
    if (
      input.intents &&
      input.intents.length > 0 &&
      input.intents[0].score > 0.6
    )
      return { response: input.intents[0].attributeArrays.ANSWER_TEXT }
  }
  render() {
    return this.props.response ? (
      <Text>{this.props.response}</Text>
    ) : (
      <Text>I don't know what you're talking about</Text>
    )
  }
}

```
