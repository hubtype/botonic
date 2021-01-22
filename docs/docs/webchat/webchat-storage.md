---
id: webchat-storage
title: Storage
---

## Local and Session Storage

By default, Botonic stores its state in the [**localStorage**](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) With `localStorage`, the stored data is saved across browser sessions.

However, for security and privacy reasons, you may have to avoid storing bot data when the page session ends.

That's why Botonic also allows you to store on the [**sessionStorage**](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), which gets cleared once the page is closed.

If you don't want to store anything in the browser, you must use the **`null`** variable.

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

It can be an object or a function returning the `storageKey` value. 

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