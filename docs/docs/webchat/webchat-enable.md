---
id: webchat-enable
title: Enabling and Disabling Webchat Visibility
---

You can allow the Hubtype Desk user to enable or disable its webchat whenever he wants. An API call to the backend will be done to determine if the webchat should be shown or not.

**Note:** This functionality is available from Botonic v0.13.0 and above.

1. To enable the webchat view on a permanent basis, you must pass the `visibility` parameter to `true` in `webchat/index.js`.

```javascript
export const webchat = { visibility: true }
```

2. To be able to enable or disable the webchat, you can define the webchat view with a function that returns `true` (visible) or `false` (not visible).

```javascript
Botonic.render(document.getElementById('root'), {
  appId: 'MY APP ID',
  visibility: function () {
    const result =
    return Boolean(result)
  },
})
```

Therefore, in Hubtype Desk:

- The checkbox is set to `visible`.
- The requester url is in the whitelisted domains.
- The queue linked to the webchat is open.

**Note:** The webchat is still visible if no settings are defined (webchat without set values) and if the whitelisted urls list is empty, e.g. `[]`
