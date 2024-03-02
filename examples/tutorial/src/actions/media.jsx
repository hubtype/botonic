import {
  Audio,
  Button,
  Document,
  Image,
  Location,
  Text,
  Video,
} from '@botonic/react'
import React from 'react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Hey! What a nice pic! Thanks 😊</Text>
        <Text>
          Let me share some files with you:{' '}
          <Button url='https://botonic.io'>Visit Botonic</Button>
        </Text>
        <Image src='https://media3.giphy.com/media/gtPaaCbkxpmWk/giphy.gif' />
        <Video src='https://www.w3schools.com/html/mov_bbb.mp4' />
        <Audio src='https://www.w3schools.com/html/horse.mp3' />
        <Document src='http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf' />
        <Location text={'Open Location'} lat={41.3894058} long={2.1568464} />
      </>
    )
  }
}
