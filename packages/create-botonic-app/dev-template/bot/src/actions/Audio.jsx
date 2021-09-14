import { Audio, Button, Text } from '@botonic/react/src/experimental'
import React from 'react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Audios</Text>
        <Audio src='https://www.w3schools.com/html/horse.mp3' />
        <Audio src='https://www.w3schools.com/html/horse.mp3'>
          <Button url='https://botonic.io'>Visit Botonic</Button>
        </Audio>
      </>
    )
  }
}
