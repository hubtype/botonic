import React from 'react'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()
    const user = 'John Doe'
    return { user }
  }

  render() {
    return (
      <messages>
        <message type="text">
            Hi {this.props.user}, this is the basic action in the bot.
            I'm just a React component and my code is in the file pages/actions/go.js
        </message>
        <message type="text">
            In this case, we're just returning a bunch of text messages after matching
            the user input 'go' with a regular expression. Have a look at the file
            botonic.config.js for more info on routing options.
        </message>
        <message type="text">
            Now, if you type 'buttons', we are going to display some different buttons
        </message>
      </messages>
    )
  }
}