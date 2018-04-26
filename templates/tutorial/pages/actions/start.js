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
            Hi {this.props.user}, welcome to the Botonic tutorial. I'll guide you through
            the basic concepts of the framework. You can exit at any time and deploy this
            bot with "botonic deploy".
        </message>
        <message type="text">
            This is a basic action in the bot, which is just a simple React component
            (checkout the code at pages/actions/go.js)
        </message>
        <message type="text">
            In this case, I'm just returning a bunch of text messages after matching
            the user input 'go' with a regular expression. Have a look at the file
            botonic.config.js for more info on routing options.
        </message>
        <message type="text">
            Now, if you type 'buttons', I'm going to display some buttons.
        </message>
      </messages>
    )
  }
}