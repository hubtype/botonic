# Botonic Plugin Dynamo DB
## What Does This Plugin Do?

The plugin writes tracks about the user behaviour to a DynamoDB table 

### Setup / Installation

Install
```
npm i  @botonic/plugin-dynamodb
```

Configure
```
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

### How to use it

```
const dynamodb = plugins.dynamodb
dynamodb.track((botId, user, 'login', {country: 'ES'})
```

## Build

- eslint-plugin-jest >= 22.12.0 causes "TypeError: Cannot read property 'name' of undefined"

## minify

See https://sdk.amazonaws.com/builder/js/
But even only with dynamo it generates a file (268k) larger than the one at node_modules/aws-sdk/dist/aws-sdk.min.js (234kb)
