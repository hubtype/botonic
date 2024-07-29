# Botonic Plugin Flow Builder

## What Does This Plugin Do?

Botonic Plugin Flow Builder is one of the **[available](https://github.com/hubtype/botonic/tree/master-lts/packages)** plugins for Botonic.

Flow Builder is a no-code, drag-and-drop chatbot builder that makes the process of creating and editing chatbot journeys faster and more intuitive.
From [Hubtype](https://www.hubtype.com/) we offer a suite of tools and features that let you build, test and deploy both automated and agent-based journeys at scale. This plugin allows you to connect to our Flow Builder.

<p  align="center">
<img  alt="Flow Builder"  title="flow-builder"  src="https://i.ibb.co/ySRjD4M/Pasted-image-20230426161548.png"  width="550"/>
</p>

### Features

- Support for a wide variety of content types, including buttons, text, carousels, images, videos, and more.

- Custom functions to allow dynamic bot behavior, as for example checking the queue status or determine the channel (Whatsapp, Webchat, ...) from which the user is writing.

- Seamless transfer to a human agent.

- Artificial intelligence-based detection of keywords and user intent.

### Advantages

- **Ease of use**: Flow builders are designed to be user-friendly and intuitive, allowing even non-technical users to create and edit chatbot flows with ease.

- **Time-saving**: With a flow builder, you can quickly create and edit chatbot flows using drag-and-drop functionality, saving you time and effort compared to manually coding each interaction.

- **Visual representation**: Flow builders provide a visual representation of your chatbot flow, allowing you to easily see the overall structure and make adjustments as needed.

- **Flexibility**: Flow builders offer a range of customization options, allowing you to create chatbot flows tailored to your specific needs and use cases.

## Setup

### Create an account at Hubtype

1. Create an account at https://www.hubtype.com.

2. Once you have deployed your bots, in the [Bots](https://app.hubtype.com/bots) section you can access the flow builder by clicking on any of your bots and in the button that says:

<p  align="center">
<img  alt="Flow Builder button"  title="flow-builder-button"  src="https://i.ibb.co/ZJ2fMQN/Pasted-image-20230427115219.png"  width="250"/>
</p>

### Install the Plugin

1. Install the plugin in your bot's project by running:

```bash
npm install @botonic/plugin-flow-builder
```

## Use

### Configuring the bot

1. Add the following code to your `plugins.js` file:

```ts
import * as hubtypeFlowBuilder from '@botonic/plugin-flow-builder'

const flowBuilderOptions = {
  apiUrl: 'HUBTYPE_FLOW_BUILDER_URL',
  jsonVersion: 'latest',
  getAccessToken: () => 'HUBTYPE_FLOW_BUILDER_ACCESS_TOKEN', // Used locally,
  getLocale: () => 'YOUR_LOCALE',
}

export const plugins = [
  {
    id: 'hubtypeFlowBuilder',
    resolve: hubtypeFlowBuilder,
    options: flowBuilderOptions,
  },
]
```

By doing this, we are passing configuration parameters to the bot. This way we can pass parameters to the Plugin from outside. This gives us more flexibility when configuring the plugin.

Below are the parameters that we can pass to the plugin:

- `apiUrl`: This is the URL of the flow-builder API. The bot will automatically collect this URL, so in most cases, we don't have to pass it. It is used in cases where the Flow URL is in a testing environment.

- `jsonVersion`: This indicates which version of flow you want the bot to use. By default it will use the `latest` version which is what we want in production. We can set this to `draft` if we want the bot to use this content in a test environment.

- `flow`: In some situations, we may want to test a flow locally instead of using the Flow Builder service. To do this, we can define the flow and its corresponding tree of nodes in a JSON file and pass it to our plugin through this variable. By doing so, we can run and test our flow locally without relying on the external service.

- `customFunctions`: We are able to pass custom functions to the plugin by defining them in our code and then passing them as parameters. This allows us to extend the functionality of the plugin beyond its default capabilities and execute custom logic that is tailored to our specific needs. We can add custom functions in the frontend of the Flow Builder and pass them to the plugin through this variable.

- `getLocale`: We can pass a locale value to the plugin to specify which language our bot will use.

- `getAccessToken`: When our bot is deployed in Hubtype, the plugin will automatically retrieve the access token. However, when testing our bot locally, we need to pass the access token as a variable.

- `trackEvent`: Using this option we can get the events generated in the plugin and track them in the platform we want.

e.g. using @botonic/plugin-hubtype-analytics.

```ts
trackEvent: async (request: BotRequest, eventName, args) => {
  const htEventProps = {
    action: eventName as EventAction,
    ...args,
  }

  try {
    await hubtypeAnalytics.trackEvent(request, htEventProps)
  } catch (error: any) {
    console.error(error)
  }
},
```

- `getKnowledgeBaseResponse`: Using this option we can inject a function so that the bot can respond to the user using a knowledge base.

e.g using @botonic/plugin-knowledge-bases

```ts
getKnowledgeBaseResponse: async (
  request: BotRequest,
  userInput: string,
  sources: string[]
) => {
  try {
    const knowledgeBasePlugin = request.plugins.knowledgeBases
    const response = await knowledgeBasePlugin.getInference(
      request.session,
      userInput,
      sources
    )
    return response
  } catch (error) {
    console.error(error)
    return {
      answer: '',
      hasKnowledge: false,
      sources: [],
    }
  }
},
```

2. Modify the `routes.ts` file, where routes map user inputs to actions which are in fact React Components:

```ts
import { Input, Session } from '@botonic/core'
import FlowBuilderAction from '@botonic/plugin-flow-builder/lib/esm/action'

type RouteRequest = { input: Input; session: Session }
export function routes(request: RouteRequest) {
  return [
    {
      path: 'hubtype-flow-builder',
      type: /.*/,
      payload: /.*/,
      action: FlowBuilderAction,
    },
  ]
}
```

For personalized behavior, create an action in your bot. For other cases, let the plugin handle all actions.

## Webview Contents

It is possible to define contents for a webview in flow builder.

1. create a flow with the name webiew_my_new_webiview. This will create a new flow which currently only allows you to create text and images. Once created you can change the name.

2. In the webview code you can use the hook useWebviewContents to obtain these contents.

Define a mapContents object (key: ContentID of flow builder) to pass through the hook and get the same typed contents object but with the value of the contents.
e.g.

`webviews/flow-builder-webview-example/index.ts`

```ts
import {
  createWebviewContentsContext,
  FlowBuilderJSONVersion,
  useWebviewContents,
} from '@botonic/plugin-flow-builder'
import { WebviewRequestContext } from '@botonic/react'
import React, { useContext, useState } from 'react'

import { Step1 } from './first-step'
import { Step2 } from './second-step'

const mapContents = {
  textIntro: 'TEXT_INTRO',
  image2: 'IMAGE_2',
  headerWebview: 'HEADER_WEBVIEW',
  image: 'IMAGE',
}

export const MyWebviewContentsContext = createWebviewContentsContext<typeof mapContents>()

export const FlowBuilderWebviewExample = () => {
  const webviewRequestContext = useContext(WebviewRequestContext)

  const { isLoading, error, webviewContentsContext } = useWebviewContents({
    apiUrl: FLOW_BUILDER_API_URL,
    version: FlowBuilderJSONVersion.LATEST,
    orgId: webviewRequestContext.session.organization_id,
    botId: webviewRequestContext.session.bot.id,
    webviewId: WEBVIEW_ID,
    locale: 'es',
    mapContents,
  })

  const [stepNum, setStepNum] = useState(0)
  const steps = [<Step1 />, <Step2 />]

  const handleCloseWebview = () => {
    webviewRequestContext.closeWebview()
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <MyWebviewContentsContext.Provider value={webviewContentsContext}>
      <div>
        <div>
          <h1>FlowBuilderWebview</h1>
          <button onClick={handleCloseWebview}>Close</button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Step1 />
        )}
      </div>
    </MyWebviewContentsContext.Provider>
  )
}
```

In any component within the webview you can use the contents from the context

`webviews/flow-builder-webview-example/first-step.ts`

```ts
import React, { useContext } from 'react'

import { MyWebviewContentsContext } from './index'

export const Step1 = () => {
  const { contents } = useContext(MyWebviewContentsContext)

  return (
    <div>
      <p>{contents.headerWebview}</p>
      <img src={contents.image} />
    </div>
  )
}
```
