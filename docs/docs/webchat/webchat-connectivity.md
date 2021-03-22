---
id: webchat-connectivity
title: Connectivity
---

Sometimes, the connection can be lost between the server and the chatbot. To handle this situation, you can set specific parameters to detect the connection issue.
Moreover, for a better user experience, you can warn the user by configuring a customized error message to be displayed within the webchat interface.

## Configure the server options

In `webchat/index.js`, configure the server options and time periods to solve webchat connection issues.


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

## Warn the user

To define the message to be displayed when connectivity issues occur, you can use `errorMessage`.

```javascript
export const webchat = {
  server: {
    activityTimeout: 30 * 1000,
    pongTimeout: 10 * 1000,
    errorMessage: 'Connection issue',
  },
}
```
You can use a function if you prefer. For example, if you want to display a warning message depending on the language:

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

