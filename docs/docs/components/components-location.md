---
id: location
title: Location
---

## Purpose

The `Location` component is used to display precise locations, for example if a user wants to book a restaurant.

![](https://botonic-doc-static.netlify.com/images/doc_location.png)


## Properties

| Property | Type   | Description                     | Required | Default value |
|----------|--------|---------------------------------|----------|---------------|
| text     | String | Show a text that can be clicked | No       | Open Location |
| lat      | Number | Define the latitude             | Yes      | -             |
| long     | Number | Define the longitude            | Yes      | -             |


## Example


 <img src="https://botonic-doc-static.netlify.com/images/doc_location2.png" width="200" />



```javascript
<Location lat='41.3894058' long='2.1568464' />
```

In `botonic serve` the text 'Open Location' will be displayed by default. You can redefine it by passing the prop `text` as shown below:

```javascript
<Location text={'Check location'} lat='41.3894058' long='2.1568464' />
```

