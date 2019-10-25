import React from 'react'
import { Text } from '@botonic/react'
import { getOpenQueues, getAvailableAgents, humanHandOff } from '@botonic/core'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /* 
      Uncomment the lines below before deploying the bot to Hubtype 
      in order to test the getOpenQueues call for 'Customer Support'.
    */
    // let openQueues = await getOpenQueues(session)
    let agentEmail = ''
    try {
      agentEmail = (await getAvailableAgents(
        session,
        'HUBTYPE_DESK_QUEUE_ID'
      )).filter(agent => agent == 'agent-name@hubtype.com')[0]
    } catch (e) {}

    let isHandOff = false
    // if (openQueues.queues.indexOf('Customer Support') !== -1) {
    await humanHandOff(
      session,
      'HUBTYPE_DESK_QUEUE_ID',
      { path: 'thanks-for-contacting' },
      agentEmail,
      {
        caseInfo:
          'This is some case information that will be available in the new created case',
        note: 'This is a note that will be attached to the case as a reminder'
      }
    )
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
