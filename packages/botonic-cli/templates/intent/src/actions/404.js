import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ input }) {
    if (input['intent'] === undefined) return { errors: true }
  }

  render() {
    if (this.props.errors)
      return (
        <Text>
          Enter the generated JSON key for dialogflowV2 in plugins.js to test
          the bot.
        </Text>
      )
    return <Text>Try typing "hello" to start the bot.</Text>
  }
}
