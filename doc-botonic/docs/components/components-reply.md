---
id: replies
title: Quick Replies
---

## Purpose

The `Reply` component, or Quick Replies allows you to present options in a message to a bot user.


## Properties

| Property | Type           | Description                                            | Required                                           | Default value |
|----------|----------------|--------------------------------------------------------|----------------------------------------------------|---------------|
| children | String         | Show the reply                                         | Yes                                                |      -         |
| path     | String         | URL of image to be displayed on the quick reply button | If `payload` is defined, no need to  define `path` |          -     |
| payload  | String, Number | Custom data that are sent back                         | If `path` is defined, no need to  define `payload` |      -         |


## Example

<details>
<summary>Output</summary>

<img src="https://botonic-doc-static.netlify.com/images/quickreplies.png" width="200"/>

</details>

```javascript
<Text>
  I will show you three quickreplies. One with a payload, one to go to an action
  and another to pass values to that action:
  <Reply payload='yes'>Cool</Reply>
  <Reply path='paradise'>Take me to paradise</Reply>
  <Reply path='paradise?withfruit=coconut'>To a better paradise</Reply>
</Text>
```

**Note:** Buttons and quick replies can have a url link, a payload attached, a href attribute, or an action to be triggered. When passing parameters through actions as seen in the example, the data will be accessible in the field `params` inside the `botonicInit` function.
