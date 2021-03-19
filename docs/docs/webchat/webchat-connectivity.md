---
id: webchat-connectivity
title: Connectivity
---

Sometimes, the connection can be lost between the server and the chatbot. To handle this situation, you can set specific parameters to quickly detect the connection issue.

For a better user experience, you can also warn the user by configuring a customized error message to be displayed within the webchat interface.

To do so:

1. Set the `Botonic.isOnline()` method. Values are `true` or `false` depending on your server configuration.
2. In `webchat/index.js`, configure the server options to set a time limit and get the information from the server.

```javascript
export const webchat = {
  server: {
    activityTimeout: 50 * 1000,
    pongTimeout: 20 * 1000,
  },
}
```

- `activityTimeout`: Time to wait (in ms) before pinging the server to know if the connection is still working. Default value: 20 * 1000.

- `pongTimeout`: After pinging the server, time to wait (in ms) before assuming the connection is lost and closing it. Default value: 5 * 1000.

3. Add the `errorMessage` variable to change the warning message when a connection issue occurs.

```javascript
export const webchat = {
  server: {
    activityTimeout: 30 * 1000,
    pongTimeout: 10 * 1000,
    errorMessage: 'Connection issue',
  },
}
```
You can use a function if you prefer. For example, if you want to display the warning message in various languages:

```javascript
export const webchat = {
  server: {
    activityTimeout: 20 * 1000,
    pongTimeout: 5 * 1000,
    errorMessage: () => {
       if(locale === 'es') return 'Problemas de conexión'
       return 'Connection issues'
    },
  },
}
```

