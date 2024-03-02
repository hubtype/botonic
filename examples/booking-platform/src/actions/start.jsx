import React, { useEffect } from 'react'
import { Text, Button } from '@botonic/react'
import CheckReservationsWebview from '../webviews/components/check-reservations'

export default class extends React.Component {
  static async botonicInit(request) {
    const name = request.session.user.name
    return { name }
  }

  render() {
    return (
      <>
        <Text>
          Hi {this.props.name}, I'm your virtual assistant of Botonic Booking
          Platform. I will help you manage your hotel reservations and much
          more.
        </Text>
        <Text>
          Select an option:
          <Button payload='carousel'>Book a hotel</Button>
          <Button webview={CheckReservationsWebview}>
            Check your reservations
          </Button>
        </Text>
      </>
    )
  }
}
