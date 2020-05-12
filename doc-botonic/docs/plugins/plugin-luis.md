---
title: Luis Plugin
id: plugin-luis
---

---

For more information, refer to [<u>GitHub</u>](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-luis).

---



Botonic plugin that use [LUIS](https://www.luis.ai/) as NLU service. The variables `intent`, `confidence`, `entities` and `intents` will be automatically
available inside the `input` object.

**Usage**  
```javascript
export const plugins = [
  {
    id: 'luis',
    resolve: require('@botonic/plugin-luis'),
    options: {
      region: 'YOUR_REGION',
      appID: 'YOUR_APP_ID',
      endpointKey: 'YOUR_ENDPOINT_KEY'
    }
  }
]
```