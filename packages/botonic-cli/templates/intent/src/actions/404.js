import React from 'react'

export default class extends React.Component {

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