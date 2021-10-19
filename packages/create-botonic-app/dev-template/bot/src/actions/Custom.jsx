// eslint-disable-next-line filenames/match-regex
import { Button, Reply, Text } from '@botonic/react/src/experimental'
import React from 'react'
import CalendarMessage from 'webchat/custom-messages/calendar-message'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Custom Message</Text>
        <CalendarMessage>
          <Reply payload='payload cus1'>Payload Custom 1</Reply>
          <Reply payload='payload cus2'>Payload Custom 2</Reply>
        </CalendarMessage>
      </>
    )
  }
}
