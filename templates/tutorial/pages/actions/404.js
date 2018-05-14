import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
      <messages>
            <message type="text">
                Hey! This is the 404 action, meaning the bot didn't understand what
                you just said. Try typing "start" to start the tutorial.
            </message>
	    </messages>
    )
  }
}