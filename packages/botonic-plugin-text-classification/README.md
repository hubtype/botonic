# Botonic Plugin Text Classification

## What does this plugin do?

Botonic Plugin Text Classification allows classifying the user's input from your bot.

## Install the plugin

From your project, install the plugin by using the following command:

```bash
npm install @botonic/plugin-text-classification
```

> **Note**: Windows users should first use the command
> `npm install --global --production windows-build-tools --vs2015`

## Require the plugin

The plugin needs to be included in the `src/plugins.js` by setting its id as **text-classification**, and providing the locales of the trained models to the options.

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

## Define the dataset

1. Inside the `nlp` folder, create a new one named `dataset`.

2. For each locale you want to train a model for, create a new subfolder inside `/nlp/dataset` with the locale's code as name (must be [ISO 639-1](https://iso639-3.sil.org/code_tables/639/data)).

3. Add a yaml file for each class.

> **Warning:** Data files must be defined using Botonic's data format. If you have not seen it before, please check it out in our [Botonic Data Format guide]().

## Model training

Now it's time to train a model to be able to correctly classify a given sentence.

The locale of the model must be defined in `/src/nlp/tasks/text-classification/train.ts` by modifying the LOCALE constant with the correct locale's code (must be [ISO 639-1](https://iso639-3.sil.org/code_tables/639/data)).

> **Note:** The defined locale would be used for loading the dataset and the preprocessor's engines used for process sentences.

To train the model, you only need to run the following command:

```bash
botonic train --task=text-classification
```

> **Note:** Alternatively, you can also run **`npm run train`**. That would try to train a model for all NLP tasks if possible.

After the model is trained, you will be able to run predictions on new inputs.

> **Warning:** Every time you make changes in your dataset, you will need to train a new model to apply them.

## Define chatbot routes

Once you've defined your classes, you can use them to create new routes in **src/routes.js**:

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

1. To check how the bot runs in development environment, run the following command:

   ```bash
   botonic serve
   ```

2. For further details of the variables stored during the execution, open the `Botonic Dev Console` by clicking on the tab in the top-left corner.

3. Deploy your bot with the following command:

   ```bash
   botonic deploy
   ```

   Congratulations! You got a chatbot with a customized intent classification system! 🥳
