import { Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static async botonicInit({ plugins, session }) {
    const user = session.user.id
    const botId = session.bot.id

    try {
      await plugins.track.track(botId, user, { arg1: 'val1' })
    } catch (e) {
      console.error(e)
    }
  }
  render() {
    return <Text>Hi</Text>
  }
}
