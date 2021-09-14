import { Button, Image, Text } from '@botonic/react/src/experimental'
import React from 'react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Images</Text>
        <Image src='https://media3.giphy.com/media/gtPaaCbkxpmWk/giphy.gif' />
        <Image src='https://botonic.io/img/botonic-logo.png'>
          <Button url='https://botonic.io'>Visit Botonic</Button>
        </Image>
      </>
    )
  }
}
