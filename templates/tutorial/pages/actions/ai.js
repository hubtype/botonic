import dynamic from 'next/dynamic'
import React from 'react'

export default class extends React.Component {

  render() {
    return (
      <message>
        <message type="text">
            Now, let's see how we integrate AI in this bot. When we enter a text input,
            the data goes to dialogflow or another AI framework you have integrated.
            Then, we parse the intent of the AI response, and try to trigger an action.
            For example, if you type 'you are so funny', 'you rock!' or 'I like you',
            the AI recognizes that it is a funny action, and it loads the funny response.
        </message>
        <message type="text">
          The last thing we are going tho see, it's de 404 page. We use this action when the
          input of the user doesn't match with any of our bot routes. For example if you type
          'error', the bot doesn't understand you, and it jumps to the 404 action. 
        </message>
      </message>
    )
  }
}