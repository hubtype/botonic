import dynamic from 'next/dynamic'
import React from 'react'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const user = 'Eric'
    return { user }
  }

  render() {
    return (
      <message>
        <message type="text">
            Hi {this.props.user}, this is the basic action in the bot.
            The message of type 'text' are simple text messages. In this case,
            for achieving this action, we have used a regular expresion that matches 
            the string 'go'.
        </message>
        <message type="text">
          Now, if you type 'buttons', we are going to display some different buttons
        </message>
      </message>
    )
  }
}