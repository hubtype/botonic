# Botonic Plugin NER

## What does this plugin do?

Botonic Plugin NER uses the trained models defined by the user to recognize named entities inside the input text.

First, the text locale is detected. Then, by using the relevant model, extra information about the recognized entities is added to the input message.

## Setup

### Installing the plugin

From your project, install the plugin by using the following command:

```bash
npm install @botonic/plugin-ner
```

> **Note**: Windows users should first use the command
> `npm install --global --production windows-build-tools --vs2015`

### Requiring the plugin

The plugin must be required in `src/plugins.js` and the locales of the trained models must be defined in their options.

**Locales order matters.** If locale detection is ambiguous, the locale defined first in the array will be used as a fallback.

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

## Use

The plugin has just added the recognized entities. Now you can use them within actions to create better conversational flows:

```javascript
import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext

  static async botonicInit({ input }) {
    return { entities: input.entities }
  }

  render() {
    const products = this.props.entities.filter(e => e.label == 'product')
    if (products.length === 0) {
      return (
        <>
          <Text>Which product do you want to return?</Text>
        </>
      )
    } else {
      return (
        <>
          <Text>
            Do you have the ticket of the products:{' '}
            {products.map(e => e.text).join(', ')}?
          </Text>
        </>
      )
    }
  }
}
```
