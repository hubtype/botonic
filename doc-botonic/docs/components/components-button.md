---
id: buttons
title: Buttons
---

## Purpose

The Button component is used to display a button during a conversation. The user can click on it and take specific actions instantly.  Buttons are usually sent during a conversation for the person to click and take specific actions instantly. It is very useful for audience interaction. 

## Properties

| Property | Type           | Description                                                        | Required | Default value |
|----------|----------------|--------------------------------------------------------------------|----------|---------------|
| webview  | Object         | Open a webview when the button is clicked                          | No       | -             |
| params   | String         | Parameters passed to the webview                                   | No       | -             |
| path     | String         |                                                                    | No       | -             |
| children | String         | Show the button                                                    | Yes      | -             |
| payload  | String, Number | Call to action                                                     | No       | -             |
| url      | String         | This URL is opened in a mobile browser when the button is clicked. | No       | -             |
| onClick  | String         | Set the action                                                     | No       | -             |


## Properties

<details>
<summary>Output</summary>

<img src="https://botonic-doc-static.netlify.com/images/buttons.png" width="200"/>

</details>

## Code

```javascript
<Text>
  Here I display two types of buttons, the first one is a URL button and the
  second is a payload button:
  <Button url='https://botonic.io'>Visit botonic.io</Button>
  <Button payload='carousel'>Show me a carousel</Button>
</Text>
```
