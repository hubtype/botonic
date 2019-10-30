import React from 'react'
import { Text } from '@botonic/react'
import { humanHandOff } from '@botonic/core'
import Feedback from './feedback'

export default class extends React.Component {
  static async botonicInit({ session }) {
    await humanHandOff(session, 'Urgent', {
      path: 'feedback',
      action: Feedback
    })
  }

  render() {
    return (
      <Text>
        Ok, we've just locked your credit card ending in 0085. One of our agents
        will attend you right away.
      </Text>
    )
  }
}
