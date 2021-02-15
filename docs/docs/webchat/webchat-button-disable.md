---
id: webchat-button-disable
title: Enabling and Disabling Buttons
---

This functionality allows you to disable a button once the user has clicked on it. Thanks to this visual information, the user can better understand the logical flow and navigate more easily.

To add this property by default, you must set `autodisable: true` in the webchat `index.js`.
The button style properties must be set as well.

**index.js**

```javascript
export const webchat = {
  theme: {
    style: {
      width: 500,
    },
    button: {
      disabledstyle: {
        opacity: 0.5,
        cursor: 'auto',
        pointerEvents: 'none',
        backgroundColor: 'green',
      },
      autodisable: true,
    },
  },
}
```


## Example with a button

In `button.js`, if you add:

```javascript
<Text>
    Here I display two types of buttons, the first one is a URL button and the second is a payload button:
     <Button payload='https://botonic.io' autodisable={false}>Visit botonic.io</Button>
     <Button payload='carousel'>Show me a carousel</Button>
</Text>
```

You should get something like:

<img src="https://botonic-doc-static.netlify.com/images/webchat/button-enable.png" width="400" />


<img src="https://botonic-doc-static.netlify.com/images/webchat/button-disable.png" width="400" />


## Example with a carousel

These properties can also be applied to buttons that are embedded in a carousel:

In `carousel.js`, if you add:

```javascript
<Carousel>
          {movies.map((e, i) => (
            <Element key={e.name}>
              <Pic src={e.pic} />
              <Title>{e.name}</Title>
              <Subtitle>{e.desc}</Subtitle>
              {i === 0 ? (
                <Button payload={e.url}>Visit website</Button>
              ) : (
                <Button
                  payload={e.url}
                  autodisable={true}
                  disabledstyle={{ backgroundColor: 'red' }}
                >
                  OK
                </Button>
              )}
            </Element>
          ))}
        </Carousel>
```

You should get something like:

<img src="https://botonic-doc-static.netlify.com/images/webchat/carousel-enable.png" width="400" />


<img src="https://botonic-doc-static.netlify.com/images/webchat/carousel-disable.png" width="400" />

**Note:** If you define the property as a component, the property defined in `index.js` is overwritten. 
