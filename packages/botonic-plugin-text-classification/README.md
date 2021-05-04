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

You can use the information added by this plugin to create new routes in **`src/routes.js`**.

```javascript
import Start from './actions/start'
import ShowRestaurants from './actions/show-restaurants'

export const routes = [
  { intent: 'Greetings', action: Start },
  { intent: 'BookRestaurant', action: ShowRestaurants },
]
```
