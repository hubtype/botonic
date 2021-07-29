---
title: Plugin Dashbot
id: plugin-dashbot
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-dashbot)**.

---

## What Does This Plugin Do?

Dashbot, as a bot analytics platform, enables you to increase engagement, acquisition, and retention through actionable data.

## Setup

1. Install the plugin from npm.

```
npm install --save @botonic/plugin-dashbot
```

2. Add it to the **src/plugins.js** file.

```
{
    id: 'dashbot',
    resolve: require("@botonic/plugin-dashbot"),
    options: {
      apiKey: 'YOUR_DASHBOT_APIKEY'
    }
}
```

## Use

You can then use it in your **actions**.

```
static async botonicInit({ input, session, plugins }) {
    // Integration with dashbot for incoming messages
    let { dashbot } = plugins
    let userId = session.user.id
    let text = input.data
    await dashbot.logIncoming({ input, session, userId, text })

    return { input }
}
```
