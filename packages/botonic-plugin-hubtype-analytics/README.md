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

- **`getLaguange`**: getLaguange(request) function to define the language when it is not in request.session.user.extra_data.language
- **`getCountry`**: getCountry(request) function to define the country when it is not in request.session.user.extra_data.country
