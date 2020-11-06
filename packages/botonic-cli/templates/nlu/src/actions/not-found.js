import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>I'm sorry! I don't understand you!</Text>
        <Text>I'm just a bot expecting to be a human one day 😅</Text>
        <Text>Could you please repeat that again?</Text>
      </>
    )
  }
}
