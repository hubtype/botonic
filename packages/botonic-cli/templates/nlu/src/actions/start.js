import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>Hi human! 👋</Text>
        <Text>
          I have been trained to recognize intents for booking tables and asking
          for weather or directions.
        </Text>
        <Text>Ask me something related! 😊</Text>
      </>
    )
  }
}
