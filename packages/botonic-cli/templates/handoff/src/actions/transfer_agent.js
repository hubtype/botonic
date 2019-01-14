import React from 'react'
import { Text } from '@botonic/react'
import { getOpenQueues, humanHandOff } from '@botonic/core'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    let openQueues = await getOpenQueues(session)
    let is_hanfOff = false
    if (openQueues.queues.indexOf('Customer Support') !== -1) {
      await humanHandOff(session, 'Customer Support', {
        action: 'thanks_for_contacting'
      })
      is_hanfOff = true
    }
    return { is_hanfOff }
  }

  render() {
    if (this.props.is_hanfOff) {
      return <Text>You are being trasnfered to an agent!</Text>
    } else {
      return (
        <Text>
          Sorry, right now we can't serve you...Please contact us later!
        </Text>
      )
    }
  }
}
