---
id: create-convapp
title: Create a Conversational App from Scratch
---

In the following example, we’re going to build a chatbot from scratch that takes food orders.

## Install Botonic

See the [**Installation section**](getting-started).

## Create a Blank Project

1. Name your project by running:
   `botonic new <botName>`
2. Select the **blank** example and run `cd <botName>`.
3. Test it in your browser with `npm run start` or `botonic serve`.

Your blank project is created with its basic structure. For more information, see the **[Understanding the Project](/docs/concepts/project)** section.

## Add a Welcome Message

Let's say we want our chatbot to answer just after the user says “hi”.

1. Open the `src/actions/` folder and create a first action file: `welcome.js`.
2. In the `welcome.js` file, import the react library by entering:

   ```javascript
   import React from 'react'
   ```

3. Import the `Text` component from `@botonic/react`.

   ```javascript
   import { Text } from '@botonic/react'
   ```

4. Create a `React` class and add your `Text` components in the `render` method.

   ```javascript
   export default class extends React.Component {
     render() {
       return (
         <>
           <Text>Welcome to our food service!</Text>
           <Text>What do you want to eat today?</Text>
         </>
       )
     }
   }
   ```

5. Now open the `src/routes.js` file to add a rule for this action. For example:

   ```javascript
   import Welcome from './actions/welcome'

   export const routes = [
     {
       path: 'welcome',
       text: /hi|hello/,
       action: Welcome,
     },
   ]
   ```

## Add Two Buttons to Give a Choice to the User

Just after greeting the user, let's say that the bot lets the user choose one option among pizza or pasta.

1. Go back to the `welcome.js` file and also import the `Reply` component.

   ```javascript
   import { Text, Reply } from '@botonic/react'
   ```

1. In the render method you were previously using in `welcome.js` , add the replies with `pizza` and `pasta` as options.

   **Your final `welcome.js` should look like this:**

   ```javascript
   import React from 'react'
   import { Text, Reply } from '@botonic/react'

   export default class extends React.Component {
     render() {
       return (
         <>
           <Text>Welcome to our food service!</Text>
           <Text>
             What do you want to eat today?
             <Reply payload='pizza'>Pizza</Reply>
             <Reply payload='pasta'>Pasta</Reply>
           </Text>
         </>
       )
     }
   }
   ```

1. Open the `src/actions/` folder and create two files: `chosen-pasta.js` and `chosen-pizza.js`.

1. Import the react element and the `Text` component. Let’s take the example of the `chosen-pasta.js` file.

   **Your final `chosen-pasta.js` should look like this:**

   ```javascript
   import React from 'react'
   import { Text } from '@botonic/react'

   export default class extends React.Component {
     render() {
       return <Text>Pasta is always a good choice!</Text>
     }
   }
   ```

1. Repeat the same procedure for the `chosen-pizza.js` file, for example.

   **`chosen-pizza.js`**

   ```javascript
   import React from 'react'
   import { Text } from '@botonic/react'

   export default class extends React.Component {
     render() {
       return <Text>Pizza is a really good option!</Text>
     }
   }
   ```

1. Back to the `src/routes.js` file, add these two new actions:

   ```javascript
   import ChosenPizza from './actions/chosen-pizza'
   import ChosenPasta from './actions/chosen-pasta'
   ```

1. In `src/routes.js`, add rules to make the user follow a logical path. For example, you can use a **payload** to capture the answer once the user has clicked on the button `{ payload: "pizza", action: ChosenPizza }` or a **sub-flow** where you can select between two options via `childRoutes`.  
   **Note:** When using `childRoutes`, at least the main action must have been previously passed.

Such as:

```javascript
import Welcome from './actions/welcome'
import ChosenPizza from './actions/chosen-pizza'
import ChosenPasta from './actions/chosen-pasta'

export const routes = [
  {
    path: 'welcome',
    text: /hi|hello/,
    action: Welcome,
    childRoutes: [
      {
        path: 'chosen-pizza',
        payload: 'pizza',
        action: ChosenPizza,
      },
      {
        path: 'chosen-pasta',
        payload: 'pasta',
        action: ChosenPasta,
      },
    ],
  },
]
```

## Add NLU

1. In the bot directory, enter `npm install @botonic/plugin-nlu`.

2. Create two types of `intents`, i.e. two text files called `chitchat.txt` and `help.txt` in `src/nlu/utterances/en` containing utterances related to an intent. You must create at least **two files** to make the NLU plugin work.

3. Enter the content of your choice in both files. In our example, we are going to add content to the `help.txt` file. Make sure to add a line break between each intent.

   **src/nlu/utterances/en/help.txt**

```javascript
I'm lost
I don't understand
I need help
```

4. Open `src/docs/plugins.js` and add `@botonic/plugin-nlu` into your plugins array.

   **Your final `plugins.js` file should look like this:**

```javascript
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: {
      en: {},
    },
  },
]
```

1. Run `botonic train`. This will generate a prediction model based on the added examples.
1. Wait until the model is fully trained.

   In the next section you are going to create an action: `HelpAction` to answer to this intent.

## Transfer the Conversation to an Agent

Now let’s say that the user wants to get help from an agent just after his selection.

1. Create a `help-action.js` file in `src/actions/`.

2. Import the `humanHandOff` method from `@botonic/core`.

3. Add the `botonicInit` method that allows you to perform tasks before sending back the response: `static async botonicInit({ session })`.

4. Add a `Text` to let the user know that a human agent is going to help.

   **Notes:** To do a transfer with the `humanHandOff` method, only the `session` is necessary. This is the queue name that displays in Hubtype Desk.

   **Your final `help-action.js` should look like this:**

   ```javascript
   import React from 'react'
   import { Text } from '@botonic/react'
   import { humanHandOff } from '@botonic/core'

   export default class extends React.Component {
     static async botonicInit({ session }) {
       await humanHandOff(session, 'HUBTYPE_DESK_QUEUE_ID', {
         payload: 'end',
       })
     }
     render() {
       return (
         <Text>You will be transferred to an agent to solve your issues.</Text>
       )
     }
   }
   ```

5. In the `src/routes.js` files, import `HelpAction`:

   ```javascript
   import HelpAction from './actions/help-action'
   ```

6. To capture the previously added intent, add a new rule in `routes`:

   ```javascript
    { path: "help-action", intent: "help", action: HelpAction }
   ```

## Say Goodbye

To end the conversation:

1. Create a `final-action.js` file and the content.

   **Your final `final-action.js` file should look like this:**

   ```javascript
   import React from 'react'
   import { Text } from '@botonic/react'

   export default class extends React.Component {
     render() {
       return (
         <>
           <Text>I hope you enjoyed our service!</Text>
           <Text>Have a nice day!</Text>
         </>
       )
     }
   }
   ```

1. In the `src/routes.js` file, import:

   ```javascript
   import FinalAction from './actions/final-action'
   ```

1. To capture the previously added action, add a new rule in `routes`:

   ```javascript
    { path: "end-of-flow", payload: "end", action: FinalAction }
   ```

   **Your final `src/routes.js` file should look like this:**

   ```javascript
   import Welcome from './actions/welcome'
   import ChosenPizza from './actions/chosen-pizza'
   import ChosenPasta from './actions/chosen-pasta'
   import HelpAction from './actions/help-action'
   import FinalAction from './actions/final-action'

   export const routes = [
     {
       path: 'welcome',
       text: /hi|hello/,
       action: Welcome,
       childRoutes: [
         {
           path: 'chosen-pizza',
           payload: 'pizza',
           action: ChosenPizza,
         },
         {
           path: 'chosen-pasta',
           payload: 'pasta',
           action: ChosenPasta,
         },
       ],
     },
     { path: 'help-action', intent: 'help', action: HelpAction },
     { path: 'end-of-flow', payload: 'end', action: FinalAction },
   ]
   ```

Your bot is ready! Now try your bot with `botonic serve` and put it into production by running `botonic deploy`.

**Note**: Remember to run `botonic` commands from the bot's project root folder. See the [**Quick Start section**](getting-started) for further details.
