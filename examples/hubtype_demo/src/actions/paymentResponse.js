import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ input }) {
    let cardN = ''
    try {
      cardN = input.payload.split('__CardN:')[1]
    } catch {}
    if (!cardN) return { cardN: '' }
    return { cardN }
  }
  render() {
    return (
      <Text>
        Your payment with the card {this.props.cardN} number was successful.
      </Text>
    )
  }
}
