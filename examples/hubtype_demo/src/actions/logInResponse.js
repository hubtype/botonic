import React from 'react'
import { Text, RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input }) {
    let email = input.payload.split('___LogIn:')[1]
    if (!email) return { email: '' }

    return { email }
  }

  render() {
    return (
      <Text>
        Thank you very much! Welcome to Hubtype! Your username is:{' '}
        {this.props.email}
      </Text>
    )
  }
}
