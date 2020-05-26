---
id: co-text
title: Text
---

> ## Purpose

Text is the simplest and easiest way to talk to the user.

> ## Code

The "Hello World!" output would be defined as below:

```javascript
<Text>Hello World!</Text>
```

### Line break

In order to create a line break, you must use `{'\\n'}`.

```javascript
<Text>
  First line {'\\n'}
  Second line
</Text>
```

### Markdown support

By default, the Text component supports markdown format for webchats.  If you want to remove it, you must set the markdown property to false.

```javascript
<Text markdown={false}> 
{formattedText} 
</Text>
```