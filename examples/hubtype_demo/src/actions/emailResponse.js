import React from 'react'
import { Text, RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input }) {
    let email = input.payload.split('___Email:')[1]
    if (!email) return { email: '' }
    return { email: email }
  }

  render() {
    return (
      <Text>
        Thank you very much! We are going to send a confirmation email at:{' '}
        {this.props.email}
      </Text>
    )
  }
}
