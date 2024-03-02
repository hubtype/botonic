import {
  getAvailableAgents,
  getOpenQueues,
  HandOffBuilder,
} from '@botonic/core'
import { Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /*
      Uncomment the lines below before deploying the bot to Hubtype
      in order to test the getOpenQueues call for 'Customer Support'.
    */
    // let openQueues = await getOpenQueues(session)
    let agentEmail = ''
    try {
      agentEmail = (
        await getAvailableAgents(session, 'HUBTYPE_DESK_QUEUE_ID')
      ).filter(agent => agent == 'agent-name@hubtype.com')[0]
    } catch (e) {}

    let isHandOff = false
    // if (openQueues.queues.indexOf('Customer Support') !== -1) {
    const handOffBuilder = new HandOffBuilder(session)
    handOffBuilder.withQueue('HUBTYPE_DESK_QUEUE_ID')
    handOffBuilder.withAgentEmail('agent-1@hubtype.com')
    handOffBuilder.withOnFinishPath('thanks-for-contacting') // or handOffBuilder.withOnFinishPayload('thanks-for-contacting')
    handOffBuilder.withCaseInfo(
      'This is some case information that will be available in the new created case'
    )
    handOffBuilder.withNote(
      'This is a note that will be attached to the case as a reminder'
    )
    await handOffBuilder.handOff()

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
