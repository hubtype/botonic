---
id: text
title: Text
---

The `Text` component is the simplest and easiest way to talk to the user.

## Properties

| Property | Type    | Description                     | Required | Default value |
| -------- | ------- | ------------------------------- | -------- | ------------- |
| markdown | Boolean | Enable/disable markdown support | No       | true          |
| children | String  | Show text                       | Yes      | -             |

## Example

<details>
<summary>Output</summary>

![](https://botonic-doc-static.netlify.com/images/docs/components_text.png)

</details>

### Text

```javascript
<Text>Hello World!</Text>
```

### Line break

To create a line break, you must use `{'\n'}`.

```javascript
<Text>
  First line {'\\n'}
  Second line
</Text>
```

### Markdown support

By default, the Text component supports markdown format for webchats. If you want to remove it, you must set the `markdown` property to `false`.

```javascript
<Text markdown={false}>{formattedText}</Text>
```
