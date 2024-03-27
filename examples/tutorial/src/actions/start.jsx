import { Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()

    /* The "context" object allows you to keep data between
       requests from the same user */
    return { name: 'John Doe' }
  }

  render() {
    return (
      <>
        <Text>
          Hi {this.props.name}, welcome to the Botonic tutorial. I'll guide you
          through the basic concepts of the framework. You can exit at any time
          and deploy this bot with "botonic deploy".
        </Text>
        <Text>
          This is a basic action in the bot, which is just a simple React
          component (checkout the code at src/actions/start.js)
        </Text>
        <Text>
          In this case, I'm just returning a bunch of text messages after
          matching the user input 'start' with a regular expression. Have a look
          at the file routes.js for more info on routing options.
        </Text>
        <Text>
          Now, if you type 'buttons', I'm going to display some buttons.
        </Text>
      </>
    )
  }
}
