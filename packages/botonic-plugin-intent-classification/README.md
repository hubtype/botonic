# Botonic Plugin Text Classification

## What does this plugin do?

Botonic Plugin Text Classification uses the trained models defined by the user to classify the input text.

After detecting the text locale, and using the corresponding model to predict the class, extra information about the user's intent is added to the input object.

## Setup

### Install the plugin

From your project, install the plugin by using the following command:

```bash
npm install @botonic/plugin-text-classification
```

> **Note**: Windows users should first use the command
> `npm install --global --production windows-build-tools --vs2015`

### Requiring the plugin

The plugin must be required in `src/plugins.js` and, the locales of the trained models must be defined in their options.

**Locales order matters.** If locale detection is ambiguous, the locale defined first in the array will be used as a fallback.

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

## Use

You can now create new routes in **`src/routes.js`** depending on the intent information added by this plugin:

```javascript
import BuyProduct from './actions/buy-product'
import NotFound from './actions/not-found'
import ReturnProduct from './actions/return-product'
import Start from './actions/start'

export const routes = [
  { input: i => i.intents[0].confidence < 0.7, action: NotFound },
  { intent: 'Greeting', action: Start },
  { intent: 'BuyProduct', action: BuyProduct },
  { intent: 'ReturnProduct', action: ReturnProduct },
]
```
