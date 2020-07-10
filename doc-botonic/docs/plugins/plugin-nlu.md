---
id: plugin-nlu
title: NLU Plugin
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-nlu)**.

---

## What Does This Plugin Do?

Natural Language Understanding can be used by your app, product, or service to transform natural user requests into actionable data. This transformation occurs when a user input matches one of the intents in your bot.

Botonic NLU allows you to create different `intents` and assign keywords or phrases. These will match with the `intent` and direct to the corresponding route.

To use Botonic NLU, you can create a bot using the NLU template by running `botonic new {BOT_NAME} nlu`.

Alternatively, if you already have a project, you can follow the steps below to setup Botonic NLU.

## Setup

### Install the plugin

1. From your project, enter the command `npm install @botonic/plugin-nlu`. This command installs everything necessary to start working with your intents and entities.
2. Under the `src` files of your project, create a folder called `nlu`.

**Note**: Windows users should first use the command
`npm install --global --production windows-build-tools --vs2015` followed by `npm install @botonic/plugin-nlu`

### Add a Configuration File

Under `nlu`, create a new file called `nlu.config.json`. This file defines the languages to enable and configures the training phase parameters. You file must have the following content:

** src/nlu/nlu.config.json **

```javascript
{
  "langs": ["en"],
  "params": {
    "default": { }
  }
}
```

### Require the Plugin

After setting all your necessary parameters, require the plugin in `src/plugins.js`. You must set its `id` to **nlu** for the plugin to function.

**src/plugins.js**

```javascript
import nluConfig from './nlu/nlu.config.json'
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: nluConfig,
  },
]
```

## Use

### Define Intents

1. Under the `nlu` folder, create a folder called `utterances`, which will contain your multilingual intents.
2. For every language you want to support, create a folder under `src/nlu/utterances` with its language code (it must be [ISO 639-1](https://iso639-3.sil.org/code_tables/639/data)). Ex: `en` for English.
3. Add a text file for each intent you want to create by naming them `{YOUR_INTENT}.txt`.
4. Fill them with possible ways to express each intent. **Every sentence must be on a different line of the file.**

For example, you could have the following files under **src/nlu/utterances/en**:

- BookRestaurant.txt
- GetDirections.txt
- Greetings.txt

This could be a list of examples of greetings defined in `Greetings.txt` file:

**src/nlu/utterances/en/Greetings.txt**

```txt
Hey!
Hi!
Good morning!
Morning!
What's up bot?
hi
Good afternoon!
How are you?
morning
hello
```

### Define Entities

Botonic NLU also has `entities` which are used for extracting parameter values from natural language inputs. You can define your entities within an utterance like `[ENTITY_NAME](type)`.

**src/nlu/utterances/en/BookRestaurant.txt**

```txt
Find me a table for four for dinner tonight
Book a table for today's lunch at [Eggy's](Restaurant) for 3 people
Book a table at a restaurant near [Times Square](Place) for 2 people tomorrow night
Book a table for friday 8pm for 2 people at [Delicatessen](Restaurant)
```

With this notation we are telling Botonic NLU that `Times Square` is the value for an entity of type `Place`.
`Place` is a named entity type as well as `Person`, `Organization` or `Date` and can be accessed with the following methods:

- `Place`: `input.entities.places`
- `Person`: `input.entities.people`
- `Organization`: `input.entities.organizations`
- `Date`: `input.entities.dates`

The entity recognition system is based on [spencermountain/compromise](https://github.com/spencermountain/compromise), so this is the [full list](https://observablehq.com/@spencermountain/compromise-tags) of
entity tags which are supported by default.

### Train the Bot

Now it's time to order Botonic NLU to deal with all the examples we have added so far. To do this, you have to type the following command:

```bash
botonic train
```

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

### Use Entities within Actions

You may need to capture custom entities, like `Restaurant`.
You can access your custom entities with the method `input.entities.tags`: This list contains all the custom tagged entity types with their values.

Here is an example about how entities can be used within an action.

**src/actions/show-restaurants**

```javascript
import React from 'react'
import { RequestContext, Text } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input, session, lastRoutePath }) {
    const getNotUndefinedCustomEntities = (entities, tag) =>
      entities.tags.length
        ? entities.tags.filter(e => e.tags.includes(tag)).map(res => res.value)
        : undefined

    let namedEntitiesPlace = input.entities.places.length
      ? input.entities.places
      : undefined

    let customEntitiesRestaurants = getNotUndefinedCustomEntities(
      input.entities,
      'Restaurant'
    )
    return { namedEntitiesPlace, customEntitiesRestaurants }
  }

  render() {
    if (
      this.props.customEntitiesRestaurants &&
      this.props.customEntitiesRestaurants.length
    ) {
      return (
        <Text>
          For sure! I will make a reservation at{' '}
          {this.props.customEntitiesRestaurants}
        </Text>
      )
    } else if (
      this.props.namedEntitiesPlace &&
      this.props.namedEntitiesPlace.length
    ) {
      return (
        <Text>
          Okay! Let's make a reservation close to{' '}
          {this.props.namedEntitiesPlace[0]}
        </Text>
      )
    } else {
      return <Text>Where would you like to book a table?</Text>
    }
  }
}
```

### Go Live

1. Run `botonic serve` to see how the bot runs in the development environment.
2. For further details of the variables stored during the execution, open the `Botonic Dev Console` by clicking on the tab in the top-left corner.
3. Deploy your bot with `botonic deploy`.

You got a bot with a customized intent and entity recognition system!

<details>
<summary>Example in Facebook Messenger (Production)</summary>

![](https://botonic-doc-static.netlify.com/images/nlu_prod.png)

</details>

### Change The Training Parameters

You can add more languages. To do so:

1. Create a new directory under `src/nlu/utterances/{newLanguageCode}` for the corresponding language.
2. Specify the language code in the `langs` array.
3. Modify the default training parameters if needed.

In the example below, the default values in the `default` section are changed. The parameters for individual languages can also be changed.

**src/nlu/nlu.config.json**

```javascript
{
  "langs": ["en", "es"],
  "params": {
    "default": {
      "EPOCHS": 4,
      "MAX_SEQ_LENGTH": null,
      "LEARNING_RATE": 0.01
    },
    "en": {
      "EPOCHS": 22
    },
    "es" :{
       "LEARNING_RATE": 0.02
    }
  }
}
```

**List of training parameters:**

- **EMBEDDING**: Name of the embeddings type used. Set to `'10k-fasttext'` by default.
- **EMBEDDING_DIM**: Dimensions of the embeddings used. Set to `300` by default.
- **TRAINABLE_EMBEDDINGS**: Whether to let the algorithm train with the pre-trained embeddings weights or not. If you have less utterances, then it's better
  to set this options to `true`. Otherwise, set it to `false` to take advantage of what the embedding already knows. Set to `true`by default.
- **LEARNING_RATE**: Specifies how much the weights are updated during training. Common values for this parameter are `0.01`, `0.03`, `0.1`. Set to `0.03` by default.
- **EPOCHS**: Defines the number of times the learning algorithm works through the entire training dataset. Set to `10` by default.
- **UNITS**: Defines the number of intermediate neurons set for the algorithm. Set to `21` by default.
- **MAX_SEQ_LENGTH**: Truncates the sentence if it is longer than the given maximum word length. You can also set this parameter to `null` to automatically determine the maximum length (not recommended). Set to `50` by default.
- **VALIDATION_SPLIT**: Defines the percentage of utterances, from your examples, used to get the metrics of the algorithm. Set to `0.2` by default.
- **DROPOUT_REG**: Used to reduce overfitting and improving the generalization of neural network. Set to `0.2` by default.

If the plugin is not able to identify the language of a new input, the first language in the file is used.

### Multilingual Support

The pre-trained word embeddings below are supported, which means that you can train your bot in these specific languages.
For more information about other supported languages, feel free to contact us on [Slack](http://botonic.slack.com).

You can also generate your own word embeddings following these [instructions](https://github.com/hubtype/botonic/tree/master/scripts).

|  Language  | Language Code |    Type\*    | Dimensions |                                                     Source                                                     |
| :--------: | :-----------: | :----------: | :--------: | :------------------------------------------------------------------------------------------------------------: |
|  English   |      en       |    glove     |     50     |         [glove-50d-en](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/glove-50d-en.db)         |
|  English   |      en       | 10k-fasttext |    300     | [10k-fasttext-300d-en](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-en.db) |
|  Spanish   |      es       | 10k-fasttext |    300     | [10k-fasttext-300d-es](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-es.db) |
|  Catalan   |      ca       | 10k-fasttext |    300     | [10k-fasttext-300d-ca](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-ca.db) |
|   French   |      fr       | 10k-fasttext |    300     | [10k-fasttext-300d-fr](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-fr.db) |
| Portuguese |      pt       | 10k-fasttext |    300     | [10k-fasttext-300d-pt](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-pt.db) |
|   German   |      de       | 10k-fasttext |    300     | [10k-fasttext-300d-de](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-de.db) |
|  Italian   |      it       | 10k-fasttext |    300     | [10k-fasttext-300d-it](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-it.db) |
|   Hindi    |      hi       | 10k-fasttext |    300     | [10k-fasttext-300d-hi](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-hi.db) |
| Indonesian |      id       | 10k-fasttext |    300     | [10k-fasttext-300d-id](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-id.db) |
|  Russian   |      ru       | 10k-fasttext |    300     | [10k-fasttext-300d-ru](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-ru.db) |
|  Turkish   |      tr       | 10k-fasttext |    300     | [10k-fasttext-300d-tr](https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com/10k-fasttext-300d-tr.db) |

_\*10k-fasttext word embeddings contain the 10k most commons words of the language._

**Note:** All the word embeddings are stored by default in `~/.botonic/word-embeddings/`. If you encounter any issues when automatically downloading word embeddings, you can download them manually and store it in the mentioned directory.
