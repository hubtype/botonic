import React from 'react'
import { Text } from '@botonic/react'
import { getOpenQueues, humanHandOff } from '@botonic/core'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /* 
      Uncomment the lines below before deploying the bot to Hubtype 
      in order to test the getOpenQueues call for 'Customer Support'.
    */
    // let openQueues = await getOpenQueues(session)
    let isHandOff = false
    // if (openQueues.queues.indexOf('Customer Support') !== -1) {
    await humanHandOff(session, 'Customer Support', {
      path: 'thanks-for-contacting'
    })
    isHandOff = true
    // }
    return { isHandOff }
  }

  render() {
    if (this.props.isHandOff) {
      return <Text>You are being transferred to an agent!</Text>
    } else {
      return (
        <Text>
          Sorry, right now we can't serve you... Please contact us later!
        </Text>
      )
    }
  }
}
