# Botonic Plugin Hubtype Babel

## What Does This Plugin Do?

This plugin allows you to integrate Hubtype Babel in your Botonic project. It works like any other AI/NLU services plugin, like Dialogflow, Watson, etc.

Once installed within your project, this plugin sends all text inputs that users are sending to your bot and queries Hubtype Babel API.
The plugin retrieves the call results to enhance the `input` object. You can then use this data in your routes and actions.

Here is an example of an `input` object received from a user:

```
{
    "type": "text",
    "data": "Where is my order?"
}
```

Example of the same `input` object after being processed by this plugin:

```
{
    "type": "text",
    "data": "Where's my order?"
    "intent": "order-location"
    "confidence": 0.9987
    "intents": []  // The raw response from Hubtype Babel API
    "entities": []  // Currently not supported
}
```

## Setup

1. Install the plugin from npm (or yarn):

```
npm i --save @botonic/plugin-hubtype-babel
```

2. Add it to the `src/plugins.js` file defining the projectId of the Project you want to use:

```
export const plugins = [
  {
    id: 'hubtype-babel',
    resolve: require('@botonic/plugin-hubtype-babel'),
    options: {
      projectId: '6800762a-03b5-419e-be97-67feac7bc5b9',
    },
  },
]
```

## Use

You can use it in your routes like any other NLP plugins:

```
export const routes = [{ intent: 'order-location', action: OrderLocation }]
```

Or you can use it in your actions:

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
