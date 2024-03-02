import React from 'react'
import {
  Text,
  Carousel,
  Element,
  Pic,
  Button,
  Title,
  Subtitle,
} from '@botonic/react'

export default class extends React.Component {
  render() {
    const hotels = [
      {
        name: 'Hotel Alabama',
        desc: '* * * *',
        payload: 'hotel-Hotel Alabama',
        pic:
          'https://cdn.styleblueprint.com/wp-content/uploads/2017/06/4512594599_9edc8fee0a_b.jpg',
      },
      {
        name: 'Hotel Arizona',
        desc: '* * * * *',
        payload: 'hotel-Hotel Arizona',
        pic:
          'https://images.trvl-media.com/hotels/10000000/9760000/9754700/9754671/88c37982_z.jpg',
      },
      {
        name: 'Hotel California',
        desc: '* *',
        payload: 'hotel-Hotel California',
        pic:
          'https://estaticos.elperiodico.com/resources/jpg/4/0/hotel-california-todos-santos-baja-california-1493803840904.jpg',
      },
    ]
    return (
      <>
        <Text>Select an hotel among these options:</Text>
        <Carousel>
          {hotels.map((e, i) => (
            <Element key={e.name}>
              <Pic src={e.pic} />
              <Title>{e.name}</Title>
              <Subtitle>{e.desc}</Subtitle>
              <Button payload={e.payload}>Book</Button>
            </Element>
          ))}
        </Carousel>
      </>
    )
  }
}
