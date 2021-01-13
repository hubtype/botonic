---
id: webchat-storage
title: Storage
---

## Local and Session Storage

By default, Botonic stores its state in the [**localStorage**](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) browser where the data doesn't expire.

However, for security and privacy reasons, you may have to avoid storing bot data.

That's why Botonic also allows you to store on the [**sessionStorage**](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) where everything is cleared once the webchat window is closed or reloaded.

If you don't want to store anything in the browser, the **`null`** variable is recommended.

To specify the required storage type, add:

```javascript
export const webchat = {
  storage: {localStorage|sessionStorage|null}
}
```


## Storage Key 

The webchat setting `storageKey` indicates the key name to use in order to store the webchat status in `localStorage` or `sessionStorage`.

| Property   | Type               | Required | Default value |
|------------|--------------------|----------|---------------|
| storageKey | Object or function | Yes      | botonicState  |

It can be an object or a function. In that case, the return value of the function will be used. 

Define a `storageKey` parameter in the webchat settings:

```javascript
const webchat = {
  storageKey: 'myCustomBotonicStateKey'
}
```

Or using a function:

```javascript
const webchat = {
  storageKey: () => 'myCustomBotonicStateKey'
}
```