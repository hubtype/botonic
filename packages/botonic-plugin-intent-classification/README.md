# Botonic Plugin Intent Classification

## What does this plugin do?

Botonic Plugin Intent Classification uses the trained models to predict the intent of the input text.

## Setup

### Install the plugin

From your project, install the plugin by using the following command:

```bash
npm install @botonic/plugin-intent-classification
```

> **Note**: Windows users should first use the command
> `npm install --global --production windows-build-tools --vs2015`

### Requiring the plugin

The plugin must be required in `src/plugins.js` and, the locales of the trained models must be defined in their options.

```javascript
export const plugins = [
  {
    id: 'intent-classification',
    resolve: require('@botonic/plugin-intent-classification'),
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
