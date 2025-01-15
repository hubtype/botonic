# Botonic Plugin Hubtype Analytics

## What Does This Plugin Do?

This plugin is used to integrate Hubtype Analytics Service in your Botonic project.

## Setup

1. Install the plugin from npm (or yarn):

```
npm i @botonic/plugin-hubtype-analytics
```

2. Add it to the `src/plugins.js` file defining the projectId of the Project you want to use:

You can define two optional functions to obtain the language and the country.
By default if you do not define these functions it will use the language defined in request.session.user.extra_data.language and country defined in request.session.user.extra_data.country

```typescript
export const plugins = [
  {
    id: 'hubtype-analytics',
    resolve: require('@botonic/plugin-hubtype-analytics'),
    options: {
      getLaguange: (request: BotRequest) =>
        request.session.user.extra_data.lang,
      getCountry: (request: BotRequest) =>
        request.session.user.extra_data.store,
    },
  },
]
```

## Plugin Options

- **`getLaguange`**: getLaguange(request) function to define the language when it is not in request.session.user.extra_data.language
- **`getCountry`**: getCountry(request) function to define the country when it is not in request.session.user.extra_data.country

## Use

All events can be used in bot actions.  
The following events can also be used from the frontend (webchat and webviews): EventFeedback, EventWebview, EventCustom

- To track the content displayed in a bot that is made with Flow Builder you can import the `trackFlowContent` function of the `@botonic/plugin-flow-builder`.

e.g. WelcomeAction that display start contents

```typescript
import { trackFlowContent } from '@botonic/plugin-flow-builder'

export class WelcomeAction extends FlowBuilderMultichannelAction {
  static contextType = RequestContext
  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    const flowBuilder = request.plugins.flowBuilder
    const contents = await flowBuilder.getStartContents('es-ES')
    trackFlowContent(request, contents)
    return { contents }
  }
}
```

- To track a handoff, you can use an instance of `HandOffBuilder` from `@botonic/core` `handoffBuilder.withBotEvent()` so that the backend will create the event after the handoff has been done correctly.

```typescript
const handOffBuilder = new HandOffBuilder(request.session)
handOffBuilder.withQueue(this.queue.id)
handOffBuilder.withBotEvent({
  language: request.session.user.extra_data.language,
  country: request.session.user.extra_data.country,
})
await handOffBuilder.handOff()
```

- To track a feedback given by the user after a handoff. If you add a free comment this field is only stored in hubtype DB and no other service will be used to store this sensitive data.

```typescript
const hubtypeAnalyticsPlugin = request.plugins.hubtypeAnalytics
const event = {
  action: FeedbackAction.case,
  data: {
    feedbackTargetId: request.session.case_id,
    feedbackGroupId: uuid(),
    possibleOptions: ['*', '**', '***', '****', '*****'],
    possibleValues: [1, 2, 3, 4, 5],
    option: '**',
    value: 2,
    comment: 'free comment writen by the user',
  },
}

try {
  const response = await hubtypeAnalyticsPlugin.trackEvent(request, event)
  console.log(response)
} catch (error) {
  console.error(error)
}
```

- To track an event from a webview. In a webview you don't have the plugins initialised, we have to create an instance of `BotonicPluginHubtypeAnalytics`

```typescript
const hubtypeAnalytics = new BotonicPluginHubtypeAnalytics()
const event = {
  action: EventAction.WebviewStep,
  webviewThreadId,
  webviewName,
  webviewStepName,
}

try {
  const response = await hubtypeAnalyticsPlugin.trackEvent(request, event)
  console.log(response)
} catch (error) {
  console.error(error)
}
```

- Finally, custom events can also be created. In a custom event you can track whatever you want but it is preferable not to use them too much.

```typescript
const hubtypeAnalytics = new BotonicPluginHubtypeAnalytics()
const event = {
  action: EventAction.Custom,
  customFields: {
    paymentType: 'paypal',
    bagsAdded: 3,
  },
}

try {
  const response = await hubtypeAnalyticsPlugin.trackEvent(request, event)
  console.log(response)
} catch (error) {
  console.error(error)
}
```
