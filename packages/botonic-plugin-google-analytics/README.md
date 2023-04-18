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
    id: 'googleAnalytics',
    resolve: require('@botonic/plugin-google-analytics'),
    options: {
      measurementId: 'G-XXXXXXXXXX', // Your Google Analytics measurement ID
      apiSecret: 'xxxxxxxxxx', // Your API Secret key for the property to send events to #pragma: allowlist secret
      getUserId: ({session}) => session.user.extra_data.clientId, //Optional. Method that returns a unique user ID as string (to track logged users for example)
    }
  }
]
```
You can see a detailed explanation of `measurementId` and `apiSecret` config fields [here](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?hl=es&client_type=firebase).  
If no `getUserId` is set, the plugin will not identify the `userId` (logged user) to Google Analytics. The `clientId` will be sent either way in all trackings. (see [clientId vs. userId](https://support.google.com/analytics/answer/6205850?hl=en#clientid-userid) for more information).   


## Usage

If the tracking is done inside the `botonicInit` method and make sure to call it with the `await` keyword to ensure its execution.  
For every tracking, the user will be identified with the `clientId` and `userId` defined in the plugin's options or with its default values.

In each track call, multiple events can be sent at once (as an array) or just one at a time (as object). In any case, each `event` will contain the `name` of the event (required) and a dictionary of `params` (optional) with all the extra parameters to be tracked.


```javascript
static async botonicInit({ input, session, params, lastRoutePath, plugins }) {
    const ga = plugins.googleAnalytics

    const event = {
      name: 'rating',
      params: {
        type: 'agent',
        value: 4,
      },
    }

    await ga.track({ session, event })
}
```
