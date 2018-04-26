import dynamic from 'next/dynamic'
import React from 'react'

export default class extends React.Component {

  render() {
    return (
      <messages>
        <message type="text">
            The last thing is to see how we integrate AI in this bot. When we enter a text input,
            the data goes to dialogflow or another AI framework you have integrated.
            Then, we parse the intent of the AI response, and try to trigger an action.
            For example, if you type 'you are so funny', 'you rock!' or 'I like you',
            the AI recognizes that it is a funny action, and it loads the funny response.
        </message>
        <message type="text">
          That's it! You just finished this Tutorial!!🎉   
        </message>
         <message type="text">
          Now, type '/quit' to exit this conversation, and do 'botonic deploy' for uploading
          this bot to the world!
        </message>        
      </messages>
    )
  }
}