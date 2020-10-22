# Botonic Plugin NLU

## What Does This Plugin Do?

Botonic Plugin NLU allows you to use the trained models with [Botonic NLU](https://github.com/hubtype/botonic/tree/master/packages/botonic-nlu) and use them to predict intents from the user inputs for your bot.

To set up a template using Botonic NLU with Botonic Plugin NLU, you can create a bot by running the following command:

```shell
$ botonic new {BOT_NAME} nlu
```

Alternatively, if you already have a project, you can follow the steps below to setup Botonic Plugin NLU.

## Setup

### Install the plugin

1. From your project, enter the command `npm install @botonic/plugin-nlu`. This command installs everything necessary to start working with your intents and entities.
2. Under the `src` files of your project, create a folder called `nlu`.  
   **Note**: Windows users should first use the command
   `npm install --global --production windows-build-tools --vs2015` followed by `npm install @botonic/plugin-nlu`
3. Then create a folder called `utterances` with your `.txt` files for each intent.

### Require the Plugin

You must require the plugin in `src/plugins.js` to be able to predict the intent of user inputs. You must set its `id` to **nlu** for the plugin to work.

In case that you have trained your model with default preprocessing engines, you only need to specify the languages that you want to support.

**src/plugins.js**

> **E.g.:**

```javascript
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: {
      en: {},
      es: {},
    },
  },
]
```

Otherwise, you **must** load also the preprocessing engines for every language used to train your models.

> **E.g.:**

```javascript
import { ENTokenizer, ESTokenizer } from './nlu/preprocessing-tools/tokenizer'

export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: {
      en: {
        tokenizer: ENTokenizer,
      },
      es: {
        tokenizer: ESTokenizer,
      },
    },
  },
]
```

## Use

### Define Intents

1. Under the `nlu` folder, create a folder called `utterances`, which will contain your multilingual intents.
2. For every language you want to support, create a folder under `src/nlu/utterances` with its language code (it must be [ISO 639-1](https://iso639-3.sil.org/code_tables/639/data)). Ex: `en` for English.
3. Add a text file for each intent you want to create by naming them `IntentName.txt`.
4. Fill them with possible ways to express each intent. **Every sentence must be on a different line of the file.**
   See [Natural Language Understanding section](https://botonic.io/docs/concepts/nlu) for more information.

### Train the Bot

Now it's time to order Botonic NLU to deal with all the examples we have added so far. To do this, you have to type the following command:

```bash
botonic train
```

> Alternatively you can also run **`npm run train`**.

After this, the bot will be able to run predictions on new inputs.  
Every time you make changes in your utterances, you will need to run again the command above so that the changes take effect.

### Define Routes with Intents

Once you've defined your intents, you can use them in the routes in the same way you use `text`, `payloads`, and the like.
Below, we see how we might use them:
**routes.js**

```javascript
import Start from './actions/start'
import ShowRestaurants from './actions/show-restaurants'
import NotFound from './actions/not-found'
import ShowDirections from './actions/show-directions'
export const routes = [
  { input: i => i.confidence < 0.7, action: NotFound },
  { intent: 'Greetings', action: Start },
  { intent: 'BookRestaurant', action: ShowRestaurants },
]
```

### Go Live

1. Run `botonic serve` to see how the bot runs in the development environment.
2. For further details of the variables stored during the execution, open the `Botonic Dev Console` by clicking on the tab in the top-left corner.
3. Deploy your bot with `botonic deploy`.
   You got a bot with a customized intent and entity recognition system!

### Training Parameters and Multilingual Support

To know more about Training Parameters and Multilingual Support, refer to [Botonic Plugin NLU section](https://botonic.io/docs/plugins/plugin-nlu).
