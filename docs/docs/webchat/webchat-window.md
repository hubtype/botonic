---
id: webchat-window
title: Conversation Window Format
---

You can customize the border and pointer of a conversation window (also called blobTick).

- The border of the blobTick is displayed if the message border color is defined by using `borderColor`.
- `blobTickStyle` can be used to set the position of the pointer.

```javascript
message: {
 bot: {
  style: {
   border: '1px solid black',
   borderColor: 'black',
  },
  blobTickStyle: {
   alignItems: 'flex-end',
  },
 },
},
```

- You can define a top or bottom padding element to set an exact position.

```javascript
blobTickStyle: {
 alignItems: 'flex-end',
 paddingBottom: '30px',
},
```

**Note:** You cannot use `blobTick` for `blockInputs`.

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/concepts_wblobtick.png)

</details>
