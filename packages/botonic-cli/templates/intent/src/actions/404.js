import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <Text>
        Enter the generated JSON key for dialogflowV2 in plugins.js to test the
        bot. Try typing "hello" to start the bot.
      </Text>
    )
  }
}
