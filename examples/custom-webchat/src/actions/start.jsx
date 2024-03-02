import { Button, Reply, Text } from '@botonic/react'
import React from 'react'

import CalendarMessage from '../webchat/calendar-message'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          This is an example bot of how to customize your webchat.
          <Button url='https://botonic.io'>Visit botonic.io</Button>
        </Text>
        <Text>For example, this is a custom message type:</Text>
        <CalendarMessage />
        <Text>
          Something else?
          <Reply payload='replies'>Show me replies</Reply>
          <Reply payload='buttons'>Show me buttons</Reply>
        </Text>
      </>
    )
  }
}
