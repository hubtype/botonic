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

```
  export const plugins = [
    {
      id: 'hubtype-analytics',
      resolve: require('@botonic/plugin-hubtype-analytics'),
      options: {
        getLaguange?: (request: BotRequest) => request.session.user.extra_data.lang
        getCountry?: (request: BotRequest) => request.session.user.extra_data.store
      },
    },
  ]
```

## Use

You can use it in your actions.

- For example an event to save a feedback given by the user:

```
  const hubtypeAnalyticsPlugin = request.plugins.hubtypeAnalytics
  const eventProps = {
    action: FeedbackAction.case,
    data: {
        possibleOptions: ['*', '**', '***', '****', '*****'],
        possibleValues: [1, 2, 3, 4, 5],
        option: '**',
        value: 2,
    }
  }

  try {
    const response = await hubtypeAnalyticsPlugin.trackEvent(request, event)
    console.log(response)
  } catch(error) {
    console.error(error)
  }

```

- For example an event to check that a flow content has been displayed in the bot:
  flowThreadId -> This value is managed by the plugin-flow-builder, stored in the session and updated every time the content connected to the conversation start is displayed

```
  const hubtypeAnalyticsPlugin = request.plugins.hubtypeAnalytics
  const eventProps = {
    action: FlowAction.flowNode,
    data: {
      flowThreadId: request.session.flow_thread_id,
      flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
      flowName: 'Main',
      flowNodeId: 'WELCOME_MSG',
      flowNodeContentId: '607205c9-6814-45ba-9aeb-2dd08d0cb529',
    }
  }

  try {
    const response = await hubtypeAnalyticsPlugin.trackEvent(request, event)
    console.log(response)
  } catch(error) {
    console.error(error)
  }

```

## Plugin Options

- **`getLaguange`**: getLaguange(request) function to define the language when it is not in request.session.user.extra_data.language
- **`getCountry`**: getCountry(request) function to define the country when it is not in request.session.user.extra_data.country
