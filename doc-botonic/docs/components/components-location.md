---
id: co-location
title: Location
---

>## Purpose
Thanks to this component, the bot can identify the locations accurately if a user wants to book a restaurant for example.

![](https://botonic-doc-static.netlify.com/images/doc_location.png)

>## Code

```javascript
<Location lat='41.3894058' long='2.1568464' />
```
In `botonic serve` the text 'Open Location' will be displayed by default. You can redefine it by passing the prop `text` as shown below:

```javascript
<Location text={'Check location'} lat='41.3894058' long='2.1568464' />
```


