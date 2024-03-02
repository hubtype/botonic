import React from 'react'
import { Text } from '@botonic/react'
import RateUserMessage from '../webchat/rate-user-message'

export default class extends React.Component {
  static async botonicInit(request) {
    const payload = request.input.payload
    const rate = payload && payload.split('-')[1]
    return { rate }
  }
  render() {
    return (
      <>
        {this.props.rate && <RateUserMessage rate={this.props.rate} />}
        <Text>Thanks for contacting us. Have a nice day!</Text>
      </>
    )
  }
}
