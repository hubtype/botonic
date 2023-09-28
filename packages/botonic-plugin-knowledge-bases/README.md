# Botonic Plugin Knowledge Bases

## What Does This Plugin Do?

This plugin allows you to integrate Hubtype Knowledge bases in your Botonic project. It works like any other AI services plugin, like Hubtype Babel, Dialogflow, Watson, etc.

## Setup

1. Install the plugin from npm (or yarn):

```
npm i --save @botonic/plugin-knowledge-bases
```

2. Add it to the `src/plugins.js` file defining the projectId of the Project you want to use:

```
export const plugins = [
  {
    id: 'hubtype-knowledge-bases',
    resolve: require('@botonic/plugin-knowledge-bases'),
    options: {
        knowledgeBaseId: '6800762a-03b5-419e-be97-67feac7bc5b9',
        host: 'https://www.api.hubtype.com'
    },
  },
]
```

## Use

The plugin response contains 3 attributes ai, hasKnowledge, sources. If hasKnowledge is true the response will be in ai and source will be the name of the document from which the response was obtained. If the hasKnowledge parameter is false then it does not have enough knowledge to answer and in that case the answer should not be shown to the user.

You can use it in your actions:

```typescript
import React from 'react'
import { Text } from '@botonic/react'

export default class OrderLocation extends React.Component {
  static async botonicInit(request) {
    const knowledgePlugin = request.plugins.knwoledgePlugin
    const response = await knowladgeBasePlugin.getIaResponse(request.session)

    return {
      text: response.hasKnowledge
        ? response.ai
        : "I don't know what you're talking about",
    }
  }
  render() {
    return <Text>{this.props.text}</Text>
  }
}
```

## Plugin Options

```typescript
interface PluginKnowledgeBaseOptions {
  knowledgeBaseId: string
  host: string
  authToken?: string
  timeout?: number
}
```

- **`knowledgeBaseId`**: Id of the knowledge base previously uploaded to the desk under ai/knowledgebases.
- **`[host]`**: Host uri where to request inference.
  - Default: *https://api.hubtype.com.*
- **`[authToken]`**: Authorization Token to being able to run inference. Only needed when using the plugin locally.
- **`[timeout]`**: timeout of the call to the knowledgebases inferrence endpoint.
  - Default: 10 seconds
