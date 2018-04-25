import React from 'react'

export default class extends React.Component {

  render() {
    return (
      <messages>
            <message type="text">
                Hey! This is the 404 action, meaning the bot didn't understand what
                you just said. Try typing "go" to start the tutorial.
            </message>
	    </messages>
    )
  }
}