import React from 'react'
import {
  Text,
  Button,
  Image,
  Video,
  Audio,
  Document,
  Location
} from '@botonic/react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Hey! What a nice pic! Thanks 😊</Text>
        <Text>Let me share some files with you:</Text>
        <Image src='https://botonic.io/images/botonic_react_logo-p-500.png'>
          <Button url='https://botonic.io'>Visit Botonic</Button>
        </Image>
        <Image src='https://media3.giphy.com/media/gtPaaCbkxpmWk/giphy.gif' />
        <Video src='https://www.w3schools.com/html/mov_bbb.mp4' />
        <Audio src='https://www.w3schools.com/html/horse.mp3' />
        <Document src='http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf' />
        <Location text={'Open Location'} lat='41.3894058' long='2.1568464' />
      </>
    )
  }
}
