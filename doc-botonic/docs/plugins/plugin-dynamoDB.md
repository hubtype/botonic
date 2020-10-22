---
title: Amazon DynamoDB Plugin
id: plugin-dynamodb
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-dynamodb)**.

---

## What Does This Plugin Do?

This plugin writes tracks about the user's behavior to a DynamoDB table.

### Setup

1. Run `npm i @botonic/plugin-dynamodb` to install the plugin.
2. Add it to the `src/docs/plugins.js` file:

```javascript
import * as dynamodb from '@botonic/plugin-dynamodb'
  {
    id: 'dynamodb',
    resolve: dynamodb,
    options: {
      //env: isProd() ? 'pro': 'dev',
      env: 'pro', // or 'dev'
      accessKeyId: 'your AWS access key id',
      secretAccessKey: 'your AWS secret access key',
      region: 'your AWS region',
      timeout: 2500, // timeout in millisecons
    }, //You can add in 'options' field any DynamoDB.ClientConfiguration from the AWS library
  },
```

### Use

```javascript
const dynamodb = plugins.dynamodb
dynamodb.track((botId, user, 'login', {country: 'ES'})
```
