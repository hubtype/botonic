// eslint-disable-next-line filenames/match-regex
import {
  Button,
  Carousel,
  Element,
  Pic,
  Subtitle,
  Text,
  Title,
} from '@botonic/react/src/experimental'
import React from 'react'

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
        pic: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Snatch_ver4.jpg',
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
