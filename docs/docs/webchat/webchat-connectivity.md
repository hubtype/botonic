---
id: webchat-connectivity
title: Connectivity
---

Botonic comes with offline support, meaning that the messages sent/received while the user loses connection are not lost. Instead, they're stored in a queue and are re-sent once the connection is recovered. Botonic detects if the user is online/offline by sending ping-pong messages through the websocket connection with the server. 
By default, Botonic sends a "ping" every 20 seconds and waits for a "pong" response for 5 seconds. If there is no response, then a "Connection issues" warning message is displayed. You can customize this behavior.

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

- `activityTimeout`: Time to wait (in ms) before pinging the server to know if the connection is still working. Default value: 20*1000.

- `pongTimeout`: After pinging the server, time to wait (in ms) before assuming the connection is lost and closing it. Default value: 5*1000.

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
You can use a function if you prefer. For example, if you want to display a warning message depending on the language, assuming that you are using `localeStorage`:

```javascript
const session = JSON.parse(localeStorage.getItem('botonicState')).session
const locale = session.__locale

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
