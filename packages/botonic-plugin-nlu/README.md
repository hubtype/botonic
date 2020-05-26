# Botonic Plugin NLU
## What Does This Plugin Do?
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
Under `nlu`, create a new file called `nlu.config.json`. 
This file defines the languages to enable and configures the training phase parameters. 
You file must have the following content:
*src/nlu/nlu.config.json*
```
{
  "langs": ["en"],
  "params": {
    "default": { }
  }
}
```
### Require the Plugin
After setting all your necessary parameters, require the plugin in `src/plugins.js`. You must set its `id` to **nlu** for the plugin to work.
**src/plugins.js**
```javascript
import nluConfig from './nlu/nlu.config.json'
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: nluConfig
  }
]
```
## Use
### Define Intents 
1. Under the `nlu` folder, create a folder called `utterances`, which will contain your multilingual intents. 
2. For every language you want to support, create a folder under `src/nlu/utterances` with its language code (it must be [ISO 639-1](https://iso639-3.sil.org/code_tables/639/data)). Ex:  `en` for English.
3. Add a text file for each intent you want to create by naming them `{YOUR_INTENT}.txt`.
4. Fill them with possible ways to express each intent. **Every sentence must be on a different line of the file.**
See [Botonic documentation](https://botonic.io/docs.html) for more information.
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
You may need to capture custom entities, like `Restaurant`.
You can access your custom entities with the method `input.entities.tags`: This list contains all the custom tagged entity types with their values.
See [Botonic documentation](https://botonic.io/docs.html) for more information and examples.
### Go Live
1. Run `botonic serve` to see how the bot runs in the development environment.
2. For further details of the variables stored during the execution, open the `Botonic Dev Console` by clicking on the tab in the top-left corner.
3. Deploy your bot with `botonic deploy`.
You got a bot with a customized intent and entity recognition system!  
### Training Parameters and Multilingual Support
To know more about Training Parameters and Multilingual Support, refer to [Botonic documentation](https://botonic.io/docs.html).
