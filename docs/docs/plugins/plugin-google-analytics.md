---
title: Plugin Google Analytics
id: plugin-google-analytics
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-google-analytics)**.

---

## What Does This Plugin Do?

With this plugin you can track the user interaction with the bot or the bot's behaviour sending the information to [Google Analytics](https://analytics.google.com/).

## Setup

1. Run `npm install --save @botonic/plugin-google-analytics` to install the plugin.
2. Add it to the `src/plugins.js` file:

**src/plugins.js**

```javascript
export const plugins = [
  {
    id: 'google_analytics',
    resolve: require('@botonic/plugin-google-analytics'),
    options: {
      trackingId: 'UA-XXXXXXXX-Y', // Your Google Analytics tracking ID
      getUserId: ({session}) => session.user.extra_data.analyticsUserId, //Optional. Method that returns a unique user ID as string
      getUserTraits: ({session}) => { userName: session.user.extra_data.analyticsUserName, userEmail: session.user.extra_data.analyticsUserEmail }, //Optional. Method that returns an object with the user Traits
      automaticTracking: true, //Optional. Indicates if an automatic tracking will be executed on every user interaction (true by default)
      getEventFields: () => ({category: 'bot', action: 'user_interaction'}) //Optional. Set custom event fields to track if automatic tracking is enabled
    }
  }
]
```

If no `getUserId` is set, the plugin will not identify the userId (logged user) to Google Analytics. The clientId will be sent either way in all trackings. (see [clientId vs. userId](https://support.google.com/analytics/answer/6205850?hl=en#clientid-userid) for more information).  
The user traits (`getUserTraits`) will be sent only if `getUserId` is set.  
If `automaticTracking` is set to `false`, the plugin will not track automatically in every user interaction.
If no `getEventFields` is set, the plugin will send a default set of fields to the automatic tracking. This option is used only if `automaticTracking` is not set or is set to `true`.

## Use

This plugin can also be used to track manually.  
The tracking must be done inside the `botonicInit` method and make sure to call it with the `await` keyword to ensure its execution.
For every tracking, the user will be identified with the `userId` and `userTraits` defined in the plugin's options or with its default values.

`eventFields` contains these Google Analytic [event tracking fields](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields) :

- `category`: eventCategory in Google Analytics (string, required)
- `action`: eventAction in Google Analytics (string, required)
- `label`: eventLabel in Google Analytics (string, optional)
- `value`: eventValue in Google Analytics (numeric, optional)

```javascript
static async botonicInit({ input, session, params, lastRoutePath, plugins }) {
    const ga = plugins.google_analytics

    const eventFields = {
      category: 'chatbot',
      action: 'user_message_sent',
      label: 'rating',
      value: 4
    }

    await ga.track({ session, eventFields })
}
```
