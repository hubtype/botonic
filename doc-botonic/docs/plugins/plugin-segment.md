---
title: Segment Plugin
id: plugin-segment
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-segment)**.

---

## What Does This Plugin Do?

This plugin uses **[Segment](https://segment.com/)** to clean, collect and control customer data. It helps you to monitor performance, define decision-making processes and identify customers' interests.

## Setup

1. Run `npm install --save @botonic/plugin-segment` to install the plugin.
2. Add it to the `src/docs/plugins.js` file:

**src/docs/plugins.js**

```javascript
export const plugins = [
  {
    id: 'segment',
    resolve: require('@botonic/plugin-segment'),
    options: {
      writeKey: 'YOUR_WRITE_KEY',
    },
  },
]
```

## Use

The default behavior of this plugin is to:

- **[Identify](https://segment.com/docs/spec/identify/)** the user during the first bot interaction.
- `Track` a **[page](https://segment.com/docs/spec/page/)** event to Segment from then on.

If you prefer to track your events manually, you can add the flag `trackManually: true` in your options. Once set, you can use them inside the method `botonicInit` on each Botonic component you want to track:

```javascript
static async botonicInit({ input, session, params, lastRoutePath, plugins }) {

    let { segment } = plugins

    let userId = session.user.id
    let event = 'This is the name of the current event I'm tracking'
    let traits = { name: 'Peter', email: 'peter@domain.com', plan: 'premium' }

    await segment.identify({
      input,
      session,
      userId: userId,
      traits: traits
    })

    let properties = {
      name: "Some interesting data",
      value: "14.99"
    }

    await segment.track({ input, session, userId: userId, event, properties })
  }
```
