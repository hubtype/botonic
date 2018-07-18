import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
      <messages>
            <message type="text">
                Try typing "handoff" to start the bot.
            </message>
	    </messages>
    )
  }
}