# Botonic Plugin Amazon DynamoDB

## What Does This Plugin Do?

This plugin writes tracks about the user's behavior to a DynamoDB table.

### Setup

1. Install the plugin from npm (or yarn):

```
npm i  @botonic/plugin-dynamodb
```

2. Add it to the `src/plugins.js` file:

```
import * as dynamodb from '@botonic/plugin-dynamodb'
  {
    id: 'dynamodb',
    resolve: dynamodb,
    options: {
      //env: isProd() ? 'pro': 'dev',
      env: 'pro', // or 'dev'
      accessKeyId: 'your AWS access key id',
      secretAccessKey: 'your AWS secret access key', <!-- pragma: allowlist secret-->
      region: 'your AWS region',
      timeout: 2500, // timeout in millisecons
    }, //You can add in 'options' field any DynamoDB.ClientConfiguration from the AWS library
  },
```

### Use

```
const dynamodb = plugins.dynamodb
dynamodb.track((botId, user, 'login', {country: 'ES'})
```
