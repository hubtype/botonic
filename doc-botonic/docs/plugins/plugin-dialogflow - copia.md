---
title: DialogFlow Plugin
id: plugin-dialogflow
---

---

For more information, refer to [<u>GitHub</u>](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-dialogflow).

---



Botonic plugin that use [Dialogflow](https://dialogflow.com/) as NLU service. The variables `intent`, `confidence`, `entities`, `defaultFallback`, `dialogflowResponse` will be automatically
available inside the `input` object.

**Usage** 
```javascript
export const plugins = [
  {
    id: 'dialogflow',
    resolve: require('@botonic/plugin-dialogflow'),
    options: 'YOUR_DIALOGFLOW_V2_GENERATED_JSON_KEY'
  }
]
```

**/src/routes.js**
​```javascript
import Hi from './actions/hi'
import Bye from './actions/bye'

export const routes = [
    {path: 'hi', intent: 'smalltalk.greetings.hello', action: Hi},
    {path: 'bye', intent: 'smalltalk.greetings.bye', action: Bye}
]
```

Refer to Dialogflow to [migrate your agents to V2]((https://dialogflow.com/docs/reference/v1-v2-migration-guide#switch_your_agent_from_v1_to_v2)) and to get the [JSON key](https://dialogflow.com/docs/reference/v2-auth-setup).


```