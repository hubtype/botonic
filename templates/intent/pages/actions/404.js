import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
      <messages>
            <message type="text">
                Enter the dialogflow token in botonic.config.js to test the bot. Try typing "hello" to start the bot.
            </message>
	    </messages>
    )
  }
}