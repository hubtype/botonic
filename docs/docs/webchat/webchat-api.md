---
id: webchat-api
title: API
---

Once your Webchat is integrated, you are provided with a code snippet to be embedded in your page.
This snippet will load your bot's code and will allow managing it through the following JS functions (you can test it in your current browser's developers console).

These methods are:

- `Botonic.open()`: Opens the webchat window if it's closed.
- `Botonic.close()`: Closes the webchat window if it's open.
- `Botonic.toggle()`: Opens or closes the webchat window depending on the current state.
- `Botonic.setTyping(boolean)`: Sets the visibility of the typing indicator.
- `Botonic.addUserText(string)`: Sends a text to the bot as if the user sent it.
- `Botonic.addUserPayload(string)`: Sends a payload to the bot as if the user sent it.
- `Botonic.addBotText(string)`: Adds a new message in the webchat window as if the bot sent it.
- `Botonic.updateUser(Object)`: Updates the attributes of the user. `({id: '1234', name: 'Pepito'})`
- `Botonic.getVisibility()`: Sets the visibility of the webchat window.
- `Botonic.openCoverComponent()`: Opens an authentication window.
- `Botonic.closeCoverComponent()`: Closes the authentication window.
- `Botonic.toggleCoverComponent()`: Opens or closes the authentication window depending on the current state.

## Webchat Listeners

In the same way, sometimes you may want to react to some of the events that take place when some actions occur in the Webchat. To do so, you can define the following event listeners:

**`Snippet to be embedded`**

```html
<html>
  <head>
    <script
      type="text/javascript"
      src="{BOT_DOMAIN}/webchat.botonic.js"
    ></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript">
      document.addEventListener('DOMContentLoaded', function (event) {
        Botonic.render(document.getElementById('root'), {
          appId: 'YOUR_APP_ID',
          onInit: app => console.log('Webchat initialized!'),
          onOpen: app => console.log('Webchat opened!'),
          onClose: app => console.log('Webchat closed!'),
          onMessage: (app, msg) => console.log('Current message', msg),
        })
      })
    </script>
  </body>
</html>
```

It can be used as well in **`src/webchat/index.js`**.

```javascript
export const webchat = {
  onInit: app => {
    // You can combine webchat listeners with the Webchat SDK's Api in order
    // to obtain extra functionalities. This will automatically open the webchat once the site is loaded.
    app.open()
  },
  onOpen: app => {
    app.addUserPayload('INITIAL_PAYLOAD')
  },
  onClose: app => {
    console.log('Webchat closed!')
  },
  onMessage: app => {
    // Your stuff here
  },
}
```

## Images

Static assets or a plain URL can be set for the following webchat properties:

- `message.bot.image`
- `header.image`
- `intro.image`
- `triggerButton.image`

**Example:**

```
export const webchat = {
  theme: {
    triggerButton: {
      image: "https://domain.com/my-logo.png",
    },
    message: {
      bot: {
        image: "https://domain.com/my-logo.png",
      },
    },
    header: {
      image: "https://domain.com/my-logo.png",
    },
    intro: {
      image: "https://domain.com/my-logo.png",
    },
  },
};
```
