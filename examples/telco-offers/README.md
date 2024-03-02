# Botonic Telco

This example shows you a multi-language conversation flow to acquire an Internet or a cell phone rate using buttons and replies.

**What's in this document?**

- [How to use this example](#how-to-use-this-example)
- [Routes and Actions](#routes-and-actions)
- [Locales](#locales)
- [Webchat Settings](#webchat-settings)

## How to use this example

1. From your command line, download the example by running:
   ```bash
   $ botonic new <botName> telco-offers
   ```
2. `cd` into `<botName>` directory that has been created.
3. Run `botonic serve` to test it in your local machine.

## Routes and Actions

[Routes](https://botonic.io/docs/concepts/routes) map user inputs to [actions](https://botonic.io/docs/concepts/actions) which consist of simple units of logic that your bot can perform and the response that your bot generates.

Here we can see a few examples of how we have captured the user input.

**src/routes.js**

```javascript
import Start from './actions/start'
import ChooseLanguage from './actions/choose_language'
import Phone from './actions/phone'
import BuyPhone from './actions/buy-phone'
import Bye from './actions/bye'

export const routes = [
  { path: 'hi', payload: 'hi', action: ChooseLanguage },
  { path: 'set-language', payload: /language-.*/, action: Start },
  {
    path: 'phone',
    payload: 'phone',
    action: Phone,
    childRoutes: [
      {
        path: 'buyPhone',
        payload: /buyPhone-.*/,
        action: BuyPhone,
      },
    ],
  },
  { path: 'bye', text: /.*/, payload: /bye-.*/, action: Bye },
]
```

If a rule matches it will trigger an action:

**src/actions/choose-language.jsx**

```javascript
import React from 'react'
import { Text, Reply } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Hi! Before we start choose a language: {'\n'}</Text>
        <Text>
          Hola! Antes de empezar elige un idioma:
          <Reply payload='language-es'>Español</Reply>
          <Reply payload='language-en'>English</Reply>
        </Text>
      </>
    )
  }
}
```

## Locales

The [Locales](https://botonic.io/docs/concepts/i18n/) allows us to build a bot that supports different languages. To do so, we have separated our string literals from the code components.
In the `src/locales` folder we have added a js file for each language we want to support.

**src/locales/en.js**

```javascript
export default {
  internet: ['Internet'],
  phone: ['Cell Phone'],
  tv: ['TV'],
  extra_phone: ['Extra Cell Phone'],
  speed: ['Speed'],
  price: ['Price'],

  start_text: [
    'Welcome, I am your virtual assistant of Botonic Telco, select which service you want to hire?',
  ],
  ask_more: ['Do you want to hire any more rate?'],
}
```

**src/locales/es.js**

```javascript
export default {
  internet: ['Fibra'],
  phone: ['Móvil'],
  tv: ['TV'],
  extra_phone: ['Extra móvil'],
  speed: ['Velocidad'],
  price: ['Precio'],

  start_text: [
    'Bienvenido soy tu asistente virtual de Botonic Telco, selecciona que servicio quieres contratar?',
  ],
  ask_more: ['Quieres contratar alguna tarifa más?'],
}
```

Then, we have exported these languages.

**src/locales/index.js**

```javascript
import en from './en'
import es from './es'

export const locales = { en, es }
```

In the initial action we have set the locale and then we can access an object from locales with `this.context.getString` method.

**src/actions/start.jsx**

```javascript
import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const language = request.input.payload.split('-')[1]
    return { language }
  }
  render() {
    this.props.language && this.context.setLocale(this.props.language)
    let _ = this.context.getString
    return (
      <>
        <Text>
          {_('start_text')}
          <Button payload='internet'>{_('internet')}</Button>
          <Button payload='phone'>{_('phone')}</Button>
        </Text>
      </>
    )
  }
}
```

## Webchat Settings

The [Webchat Settings](https://botonic.io/docs/components/webchatsettings/) component can be appended at the end of a message to change Webchat properties dynamically.

We have used it to enable the user input in one of the last actions.

**src/actions/confirm.jsx**

```javascript
import React from 'react'
import { RequestContext, Text, WebchatSettings } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    let _ = this.context.getString
    return (
      <>
        <Text> {_('confirm.text')}</Text>
        <WebchatSettings
          theme={{
            userInput: {
              box: {
                style: {
                  background: '#F5F5F5',
                },
              },
            },
          }}
          enableUserInput={true}
        />
      </>
    )
  }
}
```

...and we are done 🎉
