import React from 'react'
import { Text, Button } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          Here I display two types of buttons, the first one is a URL button and
          the second is a payload button:
          <Button url="https://botonic.io">Visit botonic.io</Button>
          <Button payload="carousel">Show me a carousel</Button>
        </Text>
        <Text>
          Clicking on a button with url will just open that URL in the browser.
          Clicking on a button with payload will send an input of type
          "postback" with that payload. You can find more information about how
          this buttons look in Facebook Messenger here:
          https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#postback
        </Text>
        <Text>
          If you are in interactive mode, you can type 'webviews' and see how
          enjoyable they are.
        </Text>
        <Text>
          If you're on the console and want to simulate a button click, you need
          to type ! (exclamation mark) followed by the payload data. Go ahead
          and type '!carrousel'.
        </Text>
      </>
    )
  }
}
