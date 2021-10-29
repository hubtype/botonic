// eslint-disable-next-line filenames/match-regex
import { HandOffBuilder } from '@botonic/core'
import { Text } from '@botonic/react/src/experimental'
import React from 'react'

export default class extends React.Component {
  // TODO: Handoff logic in Botonic 1.0
  static async botonicInit({ input, botState, params, lastRoutePath }) {
    let isHandOff = false
    // if (openQueues.queues.indexOf('Customer Support') !== -1) {
    const handOffBuilder = new HandOffBuilder(botState)
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
