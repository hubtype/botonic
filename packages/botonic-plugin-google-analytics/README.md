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
      botName: 'YOUR_BOT_NAME',
      trackingId: 'YOUR_TRACKING_ID'
    }
  }
]
```

## Use

The tracking needs to be done manually, enabling this plugin doesn't track any user interaction or bot's behaviour by default.
You can do the tracking inside the `botonicInit` method, `render` method or even inside the [Webchat listeners](https://docs.botonic.io/concepts/webchat#webchat-listeners).

`eventFields` can contain these Google Analytic [event tracking fields](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#event_fields)  :
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
    const callback = () => console.log('GA event sent')

    ga.track(eventFields, callback)
  }
```
**Note:** The callback argument is not required.
