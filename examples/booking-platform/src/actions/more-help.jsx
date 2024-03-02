import React from 'react'
import { Text, Button } from '@botonic/react'
import WebviewReserva from '../webviews/components/check-reservations'
import RateMessage from '../webchat/rate-message'

export default class extends React.Component {
  static async botonicInit(request) {
    const moreHelp =
      request.input.payload && request.input.payload.split('-')[1]
    return { moreHelp }
  }
  render() {
    return (
      <>
        {this.props.moreHelp == 'no' ? (
          <RateMessage />
        ) : (
          <Text>
            Select an option:
            <Button payload='carousel'>Book a hotel</Button>
            <Button webview={WebviewReserva}>Check your reservations</Button>
          </Text>
        )}
      </>
    )
  }
}
