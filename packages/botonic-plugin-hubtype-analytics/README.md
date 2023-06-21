# Botonic Plugin Hubtype Analytics

## What Does This Plugin Do?

This plugin allows you to integrate Hubtype Analytics in your Botonic project.

## Setup

1. Install the plugin from npm (or yarn):

```
npm i --save @botonic/plugin-hubtype-analytics
```

2. Add it to the `src/plugins.js` file defining the projectId of the Project you want to use:

```
  export const plugins = [
    {
      id: 'hubtype-analytics',
      resolve: require('@botonic/plugin-hubtype-analytics'),
      options: {
        baseUrl: https://api.hubtype.com,
      },
    },
  ]
```

## Use

You can use it in your actions for example an event to check that a faq has been displayed in the bot:

```
  const hubtypeAnalyticsPlugin = request.plugins.hubtypeAnalytics
  const eventBotFaq = {
    event_type: EventName.botFaq
    event_data: { enduser_language: 'en', faq_name: 'orders_and_deliveries' }
  }
  try {
    const response = await hubtypeAnalyticsPlugin.trackEvent(request, event)
    console.log(response)
  } catch(error) {
    console.log(error)
  }

```

## Plugin Options

- **`baseUrl`**: baseUrl to the envirment https://api.hubtype.com for production
