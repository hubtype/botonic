---
title: Segment Plugin
id: plugin-segment
---

---

For more information, refer to [<u>GitHub</u>](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-segment).

---

This Botonic plugin uses [Segment](https://segment.com/) to clean, collect and control customer data. 
Don't forget to add colon `:` to your write key as specified in [Segment Docs](https://segment.com/docs/sources/server/http/#authentication).

**Usage**
```javascript
export const plugins = [
  {
    id: 'segment',
    resolve: require('@botonic/plugin-segment'),
    options: {
      writeKey: 'YOUR_WRITE_KEY'
    }
  }
]
```

The default behaviour of this plugin is to [identify](https://segment.com/docs/spec/identify/) the user in the first bot interaction and `track` a [page](https://segment.com/docs/spec/page/) event to Segment from then on.
If you prefer to track your events manually, you can add the flag `trackManually: true` in your options. Once set you can use them inside the method `botonicInit` on each Botonic component you want to track:  
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