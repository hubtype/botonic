# Botonic Plugin Google Analytics

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
      userId: ({session}) => session.user.extra_data.analyticsUserId, //Optional. Method that returns a unique user ID as string
      userTraits: ({session}) => { userName: session.user.extra_data.analyticsUserName, userEmail: session.user.extra_data.analyticsUserEmail }, //Optional. Method that returns an object with the user Traits
      trackManually: true //Optional. Indicates if the tracking will be done manually (set to true) or automatic (by default)
    }
  }
]
```
If no `userId` is set, the plugin will use the bot's user ID (taken from the bot's session).  
If no `userTraits` is set, the plugin will use as user traits some information about bot's user information (`username`, `provider` and `provider_id`).  
If no `trackManually` is set, the plugin will track automatically in every user interaction (`post` method).  

## Use

The tracking must be done inside the `botonicInit` method and make sure to call it with the `await` keyword to ensure its execution.
For every tracking, the user will be identified with the `userId` and `userTraits` defined in the plugin's options or with its default values.

`eventFields` contains these Google Analytic [event tracking fields](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields)  :
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
