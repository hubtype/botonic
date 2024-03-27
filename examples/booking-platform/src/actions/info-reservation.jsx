import React from 'react'
import { Text, Button } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit(request) {
    const name = request.session.user.name
    const email = request.session.user.extra_data.email
    const reservationInfo = request.input.payload.split('_')
    return {
      name,
      email,
      phone: reservationInfo[1],
      people: reservationInfo[2],
      date: reservationInfo[3],
    }
  }
  render() {
    return (
      <>
        <Text>
          Reservation completed: {'\n'}
          **Name**: {this.props.name}
          {'\n'}
          **Email**: {this.props.email}
          {'\n'}
          **Phone**: {this.props.phone}
          {'\n'}
          **Guests**: {this.props.people}
          {'\n'}
          **Date**: {this.props.date}
          {'\n'}
        </Text>
        <Text>
          If you want to see your reservation, click on the menu on the bottom
          left corner and select _Check your reservation_
        </Text>
        <Text>
          Is there anything else I can help you with?
          <Button payload='help-yes'>Yes</Button>
          <Button payload='help-no'>No</Button>
        </Text>
      </>
    )
  }
}
