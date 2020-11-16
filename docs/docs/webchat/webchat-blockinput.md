---
id: webchat-blockinput
title: Block Inputs
---

For security reasons or to avoid harmful or threatening messages, you can block these inputs:

```javascript
blockInputs: [
  {
    match: [/ugly/, /bastard/],
    message: 'We cannot tolerate these kind of words.',
  },
]
```

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/webchat_block_inputs.png)

</details>

Once the specified inputs are matched:

- The user input is not displayed in the message history.
- The configured message is displayed.
- The bot does not receive the blocked message.

