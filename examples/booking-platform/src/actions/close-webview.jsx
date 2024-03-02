import React from 'react'
import { Text, Button } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          If you want to book a hotel, click on the menu on the bottom left
          corner and select _Book a hotel_
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
