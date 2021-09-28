import { Button, Text, Video } from '@botonic/react/src/experimental'
import React from 'react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Videos</Text>
        <Video src='https://www.w3schools.com/html/mov_bbb.mp4' />
        <Video src='https://www.w3schools.com/html/mov_bbb.mp4'>
          <Button url='https://botonic.io'>Visit Botonic</Button>
        </Video>
      </>
    )
  }
}
