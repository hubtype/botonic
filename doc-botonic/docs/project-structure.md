---
id: project
title: Understanding the Project
---

## The CLI

To start a new bot, you must run `botonic new testBot nlu`

- `new` will tell the CLI to create a new bot.
- `testBot` will be your bot's project name.
- `nlu` will be the starter template for your project. This template comes with NLU capabilities by default.

## Templates

Botonic offers a list of templates to help you set up a chatbot rapidly.

| Template                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Blank](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/blank)**                       | Template with empty actions. The bot will always respond with the default `404` action "I don't understand you" when you test it.                                                                                                                                                                                                                                                                                             |
| **[Tutorial](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/tutorial)**                 | Template with comments to learn by reading the source files.                                                                                                                                                                                                                                                                                                                                                                  |
| **[Childs](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/childs)**                     | Simple example on how childRoutes work. It allows you to build a bot with deep flows and navigate a decision tree using interactive elements like buttons. It is useful when you want to guide the user through a conversation with predefined flows that consist of several steps, such as surveys, pre-qualifiers of leads before human handoff, on-boarding processes, FAQs (when you have a very limited set of options). |
| **[Intent](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/intent)**                     | Bot that uses external AI like DialogFlow.                                                                                                                                                                                                                                                                                                                                                                                    |
| **[Custom Webchat](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/custom-webchat)**     | Customizable webchat that can be embedded in your website.                                                                                                                                                                                                                                                                                                                                                                    |
| **[Dynamic Carousel](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/dynamic-carousel)** | Bot that gets data from an external API and renders a Carousel. Carousels are horizontal scrollable elements with image, title and buttons for users to trigger an action.                                                                                                                                                                                                                                                    |
| **[Human handoff](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/handoff)**             | Simple bot that transfers the conversation to Hubtype Desk.                                                                                                                                                                                                                                                                                                                                                                   |
| **[NLU](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli/templates/nlu)**                           | Starter template for your project with NLU capabilities.                                                                                                                                                                                                                                                                                                                                                                      |

## Project Structure

- `routes.js`: Here you'll define routes, which maps user inputs and payloads to actions. You can also use imported subroutes from other files.
- `actions`: Actions are the units of logic that your bot can perform and where the responses of your bot are defined. You are free to organize them into subdirectories.
- `locales`: Locales are objects from which your bot takes your multilanguage definitions. This is useful if you want your bot to address different audiences. The `locales/index.js` file is where all the languages are imported.
- `webviews`: Webviews are small web pages that pop up in the middle of the conversation flow. This lets you offer experiences and features that might be difficult with message bubbles, such as picking products to buy, seats to book or appointments.
- `webchat`: Here resides all the styles and customized components for your webchat.
- `nlu`: Here you can define the utterances for every language you want to understand with `Botonic NLU`.
- `assets`: Assets is where you can store all the media required for your bot.
- `plugins.js`: Define your botonic plugins.
- `...`: The rest of the files are needed for **[babel](https://babeljs.io/)** and **[Botonic](https://github.com/hubtype/botonic)** project configuration. We recommend not modifying its contents, do so at your own risk!

## Routes and Actions

Routes are how you turn user inputs into Actions. Edit your `src/routes.js` file to add or remove routes. View **[Routes](/docs/concepts/routes)** for more details.

Actions are where you define the behavior of your bot. You can add an Action by creating a new `.js` file inside `src/actions`. View **[Actions](/docs/concepts/actions)** and **[Components](/docs/components/components)** for more details.

## Natural Language Understanding

You can go a long way capturing user inputs using regular expressions, but it obviously has its limitations. As you find yourself adding more and more functionality to your bot, you get to a point where you need Natural Language Understanding (NLU) capabilities.

NLU lets you capture user inputs by `intent` instead of parsing its raw text. An intent represents all the different ways users can express a unit of meaning that is valid for your bot. For example, you can group the sentences "What's the weather in California like?" and "Do you know if it's sunny today in California?" to the intent `GetWeather` and the parameter `city=California`. You can then map that intent to an action using a route.

Botonic has its own **[NLU module](/docs/plugins/plugin-nlu)** which covers intent and entity recognition tasks.

### Utterances and Intents

There are many ways that a user can express his intent. For example the Utterances "Hello", "Hi", and "Good morning" are all examples of a Greeting intent.
To create an intent, simply add a new text file under `src/nlu/utterances/en/` such as `src/nlu/utterances/en/Greetings.txt` and add the utterances in the `Greetings.txt` file.

### Routes for intents

You can add routes that capture different intents and their corresponding actions. For example, in your `routes.js` file:

```javascript
import Start from './actions/start'
import NotFound from './actions/not-found'

export const routes = [
  { input: i => i.confidence < 0.7, action: NotFound },
  { intent: 'Greetings', action: Start },
]
```

- `{ input: i => i.confidence < 0.7, action: NotFound }` i.confidence references the confidence value of the input. The confidence value is between 0 and 1 and indicates the likelihood that an input has a certain intent. This route is used if the input doesn't match an intent with enough confidence.
- `{ intent: 'Greetings', action: Start }` will trigger the action `Start` when the user inputs a greeting.

**Note**: Routes are checked in order. It is recommended to put the more specific ones first and the more generic ones at the end.

Then you just have to create a couple of actions that respond to these intents in `src/actions`.

### Botonic train

Once you've added utterances to your intents, run `botonic train` in your command line. This will train your bot with the utterances in your directory.
