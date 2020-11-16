---
id: webchat-timestamp
title: Timestamp
---

Timestamps are used to add and customize the time and date (color, position, locale) below the chat message. They are disabled by default.

To enable timestamps:

1. Set `theme.message.timestamps.enable` to `true`. The format displayed by default for all locales and formatted with [toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) will look like 29 Jun, 12:40:07.

Example in webchat `index.js` file.

```javascript
theme: {
    message: {
      timestamps: {
        enable: true,
      },
    },
  },
```

2. Define `style` and `format` properties:

```javascript
theme: {
    message: {
      timestamps: {
        format: () => {
          return new Date().toLocaleString();
        },
        style: {
          color: "blue",
        },
      },
    },
  },
```
