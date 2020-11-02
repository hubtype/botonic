---
title: Google Analytics Plugin
id: plugin-google-analytics
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-google-analytics)**.

---

## What Does This Plugin Do?

This plugin allows you to track the user interaction with the bot or the bot's behaviour by sending the information to **[Google Analytics](https://analytics.google.com/)**.

## Setup

1. Run `npm install --save @botonic/plugin-google-analytics` to install the plugin.
2. Add it to the `src/docs/plugins.js` file:

**src/docs/plugins.js**

```javascript
export const plugins = [
  {
    id: 'google_analytics',
    resolve: require('@botonic/plugin-google-analytics'),
    options: {
      botName: 'YOUR_BOT_NAME',
      trackingId: 'YOUR_TRACKING_ID',
    },
  },
]
```

## Use

The tracking needs to be done manually as enabling this plugin does not track any user interaction or bot's behaviour by default.
You can do the tracking inside the `botonicInit` method, `render` method or even inside the **[Webchat listeners](/docs/concepts/webchat#webchat-listeners)**.

```javascript
static async botonicInit({ input, session, params, lastRoutePath, plugins }) {
    const ga = plugins.google_analytics

    const eventName = 'botEvent'
    const eventData = {
      category: 'chatbot',
      action: 'user_message_sent',
      label: 'rating',
      value: 4
    }
    const callback = () => {
        console.log(`event ${eventName} sent`)
    }

    await ga.track(eventName, eventData, callback)
  }
```

**Note**: The `callback` argument is not required.
