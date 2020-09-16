import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ plugins, session }) {
    const user = session.user.id
    const botId = session.bot.id

    plugins.track.track(botId, user, { arg1: 'val1' })
  }
  render() {
    return <Text>Hi</Text>
  }
}
