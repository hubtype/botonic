---
id: carousel
title: Carousel
---

## Purpose

Carousels show a collection of images in a cyclic view. By displaying only a subset of images, the screen space is optimized. The navigation items, such as arrows, suggest additional content that is not currently visible, which encourages the user to continue exploring.

<img src="https://botonic-doc-static.netlify.com/images/carrousel.gif" width="200"/>


## Botonic template with Carousels

A dynamic carousel is an object that has multiple images or videos where you can showcase your products or information.
In the example below, taken from one of Botonic templates,  a simple bot will display five men or woman shirts and their price. The clothes information are retrieved from the `Shopstyle API`.

First of all, we ask what are the user interests. When we get it, we generate the carousel of the products.

Also, at the `botonicInit` necessary calls are made to grasp the values of api, which must be stored and returned so that they can be passed as parameters.

To make the call, we need `import fetch from 'isomorphic-fetch'` which needs to pass the url, the method that in this case is a `GET method` and the parameters if needed. This call returns all the information on the `api`.
When we have all the product information, we can display the carousel.
The carousel can have at most ten elements, where each element will represent one product and will have its `name`, the `price`, an `image` and a `link` to the product page.

For access to these values, we do a loop with all the products where we extract the values like `e.name`, `e.priceLabel`, etc.

**Note:** In order to import the `fetch` function from `isomorphic-fetch`, you need to install it into your bot. Please do: `npm install isomorphic-fetch`

**src/actions/carousel.js**

```javascript
import React from 'react'
import { Carousel, Element, Pic, Title, Subtitle, Button } from '@botonic/React'
import fetch from 'isomorphic-fetch'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    const api_key = 'uid8900-40385330-57'
    const url =
      'http://api.shopstyle.com/api/v2/products?pid=' +
      api_key +
      '&fts=mens-shirts&offset=0&limit=5'
    const res = await fetch(url, {
      url: url,
      method: 'GET',
      params: {},
    })

    let resp = await res.json()
    return { resp }
  }

  render() {
    return (
      <Carousel>
        {this.props.resp.products.map((e, i) => (
          <Element key={e.name}>
            <Pic src={e.image.sizes.Best.url} />
            <Title>{e.name}</Title>
            <Subtitle>{e.priceLabel}</Subtitle>
            <Button url={e.clickUrl}>Open Product</Button>
          </Element>
        ))}
      </Carousel>
    )
  }
}
```

**src/routes.js**

```
import Carousel from './actions/carousel'

export const routes = [
  { path: 'carousel', text: /^.*$/i, action: Carousel }
]

```



## Code

You can render a carousel following the structure below:

```javascript
import React from 'react'
import {
  Text,
  Button,
  Carousel,
  Pic,
  Element,
  Title,
  Subtitle,
} from '@botonic/react'

export default class extends React.Component {
  render() {
    let movies = [
      {
        name: 'Pulp Fiction',
        desc: 'Le Big Mac',
        url: 'https://www.imdb.com/title/tt0110912',
        pic:
          'https://images-na.ssl-images-amazon.com/images/I/51Z95XQDHRL._SY445_.jpg',
      },
      {
        name: 'The Big Lebowski',
        desc: 'Fuck it Dude',
        url: 'https://www.imdb.com/title/tt0118715',
        pic:
          'https://www.thelinda.org/wp-content/uploads/2018/02/Big-L-2-1.jpg',
      },
      {
        name: 'Snatch',
        desc: 'Five minutes, Turkish',
        url: 'https://www.imdb.com/title/tt0208092',
        pic: 'http://www.libertytuga.pt/wp-content/uploads/2011/11/snatch.jpg',
      },
    ]
    return (
      <>
        <Text>This a dynamic Carousel</Text>
        <Carousel>
          {movies.map((e, i) => (
            <Element key={e.name}>
              <Pic src={e.pic} />
              <Title>{e.name}</Title>
              <Subtitle>{e.desc}</Subtitle>
              <Button url={e.url}>Visit website</Button>
            </Element>
          ))}
        </Carousel>
      </>
    )
  }
}
```

## Customize or disable arrows on both sides of the carousel

You can disable or customize arrows displayed on the left and right sides of a carousel.

<img src="https://botonic-doc-static.netlify.com/images/dynamic_carrousel_arrow.png" width="200"/>

To do so:

Add the following code in `src/webchat/index.js`:

```javascript
import {
  CustomCarouselLeftArrow,
  CustomCarouselRightArrow,
} from './custom-carousel-arrows'

export const webchat = {
  theme: {
    enableCarouselArrows: {true|false},
    customCarouselLeftArrow: CustomCarouselLeftArrow,
    customCarouselRightArrow: CustomCarouselRightArrow,
  },
}
```

Add the following code in `src/webchat/custom-carousel-arrows.js`:

```javascript
import React from 'react'
import styled from 'styled-components'

const StyledArrowContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: 10px;
  height: calc(100% - 20px);
  width: 22px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  left: ${(props) => props.left}px;
  right: ${(props) => props.right}px;


const StyledArrow = styled.img`
  width: 18px;
  height: 18px;
`

export const CustomCarouselLeftArrow = (props) => {
  return (
    <StyledArrowContainer left={0} onClick={() => props.scrollCarouselBy(-228)}>
      <StyledArrow
        src={'https://image.flaticon.com/icons/svg/860/860790.svg'}
      />
    </StyledArrowContainer>
  )
}

export const CustomCarouselRightArrow = (props) => {
  return (
    <StyledArrowContainer right={0} onClick={() => props.scrollCarouselBy(228)}>
      <StyledArrow
        src={'https://image.flaticon.com/icons/svg/860/860828.svg'}
      />
    </StyledArrowContainer>
  )
}
```

**Note**: `scrollCarouselBy` allows you to define the carousel's movement distance in pixels when clicking on the arrow.
