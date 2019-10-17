import React from 'react'
import {
  Text,
  Carousel,
  Element,
  Pic,
  Button,
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
          'https://ia.media-imdb.com/images/M/MV5BMTkxMTA5OTAzMl5BMl5BanBnXkFtZTgwNjA5MDc3NjE@._V1_SY1000_CR0,0,673,1000_AL_.jpg'
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
        pic:
          'https://nebula.wsimg.com/obj/NzQ3QUYxQzZBNzE4NjNFRTc1MTU6NmM4YjgzZWVlZTE2MGMzM2RkMTdlZjdjNGUyZmFhNDE6Ojo6OjA='
      }
    ]
    return (
      <>
        <Text>
          Great! Here we can see a carrousel. It's a Facebook Messenger
          component, and it's a group of elements which consists of an image, a
          title, a subtitle and a group of buttons. You can get more information
          here:
          https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic?locale=en_US#carousel
        </Text>
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
        <Text>
          I could spend a long time talking about Botonic's features, but I
          think that's enough for now. Feel free to read through the code to
          learn how to integrate NLP capabilities and use all kind of rich
          messages.
        </Text>
        <Text>Now, please, type 'end'.</Text>
      </>
    )
  }
}
