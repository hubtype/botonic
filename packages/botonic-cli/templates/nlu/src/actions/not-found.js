import React from 'react'
import { Text } from '@botonic/react'
import { RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>I'm sorry! I don't understand you!</Text>
        <Text>I'm just a bot expecting to be a human one day 😅</Text>
        <Text>Could you please repeat me again?</Text>
      </>
    )
  }
}
