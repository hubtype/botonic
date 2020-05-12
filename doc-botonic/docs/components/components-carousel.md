---
id: co-carousel
title: Carousel
---

>## Purpose

A carousel is a sliding gallery of information displayed to the user. It helps to provide more information than that which fits the screen.

![](https://botonic-doc-static.netlify.com/images/carrousel.gif)

>## Code 
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
  Subtitle
} from '@botonic/react'

export default class extends React.Component {
  render() {
    let movies = [
      {
        name: 'Pulp Fiction',
        desc: 'Le Big Mac',
        url: 'https://www.imdb.com/title/tt0110912',
        pic:
          'https://images-na.ssl-images-amazon.com/images/I/51Z95XQDHRL._SY445_.jpg'
      },
      {
        name: 'The Big Lebowski',
        desc: 'Fuck it Dude',
        url: 'https://www.imdb.com/title/tt0118715',
        pic: 'https://www.thelinda.org/wp-content/uploads/2018/02/Big-L-2-1.jpg'
      },
      {
        name: 'Snatch',
        desc: 'Five minutes, Turkish',
        url: 'https://www.imdb.com/title/tt0208092',
        pic: 'http://www.libertytuga.pt/wp-content/uploads/2011/11/snatch.jpg'
      }
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


