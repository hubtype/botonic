import React from 'react'
import { Text, Button, Reply } from '@botonic/react'
import MyCalendarMessage from '../webchat/myCalendarMessage'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          This is an example bot of how to customize your webchat.
          <Button url='https://botonic.io'>Visit botonic.io</Button>
        </Text>
        <Text>For example, this is a custom message type:</Text>
        <MyCalendarMessage />
        <Text>
          Am I pretty?
          <Reply payload='yes'>Absolutely</Reply>
          <Reply payload='no'>Meh..</Reply>
        </Text>
      </>
    )
  }
}
