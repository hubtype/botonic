import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <Text>
        Enter the dialogflow token in integrations.js to test the bot. Try
        typing "hello" to start the bot.
      </Text>
    )
  }
}
