---
id: create-plugin2
title: Create a Botonic Plugin
---

For a better understanding, we will start with the most essential parts our plugin must have.  
In order to develop a plugin for Botonic, you will have to create a new directory structured as explained before.
Once created, you will have to copy this boilerplate code in your **`index.js`**:

**botonic-plugin-{my-plugin-name}/src/index.js**

```javascript
// By default, we suggest that you name your class with UpperCamelCase
export default class BotonicPluginMyPluginName {
  constructor(options) {
    this.options = options
  }

  async pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath }
  }

  async post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response }
  }
}
```

As seen, in our plugin we have three basic methods:

- `constructor`: used to give to our plugin the necessary options (JS Objects) needed to run our code,
  such as tokens, authentication keys, etc.
- `pre`: stands for all these kinds of operations that we want to preprocess of our input, such as applying NLU to extract intents or entities.
- `post`: stands for all these kind of operations that we want to process ex-post, such as adding a tracking id to our session.

Botonic will look for pre and post methods and will execute them before or after the input is processed, correspondingly.

**Note:** It's crucial that `pre` and `post` methods are declared with the **async** keyword for an expected behaviour.

Let's take a closer look at **[Botonic LUIS Plugin](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-luis)**:

```js
import axios from 'axios'

export default class BotonicPluginLUIS {
  constructor(options) {
    this.options = options
  }

  async pre({ input, session, lastRoutePath }) {
    let intent = null
    let confidence = 0
    let intents = []
    let entities = []

    try {
      let luis_resp = await axios({
        url: `https://${this.options.region}.api.cognitive.microsoft.com/luis/v2.0/apps/${this.options.appID}`,
        params: {
          'subscription-key': this.options.endpointKey,
          q: input.data,
          verbose: true,
        },
      })
      if (luis_resp && luis_resp.data) {
        intent = luis_resp.data.topScoringIntent.intent
        confidence = luis_resp.data.topScoringIntent.score
        intents = this.convertIntents(luis_resp.data.intents)
        entities = luis_resp.data.entities
      }
    } catch (e) {}

    Object.assign(input, { intent, confidence, intents, entities })

    return { input, session, lastRoutePath }
  }

  convertIntents(luisIntents) {
    return luisIntents.map(li => ({ intent: li.intent, confidence: li.score }))
  }

  async post({ input, session, lastRoutePath, response }) {}
}
```

That's all! Once you have implemented your plugin, you are ready to use it.
