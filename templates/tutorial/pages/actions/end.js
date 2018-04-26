import React from 'react'

export default class extends React.Component {

  render() {
    return (
      <messages>
        <message type="text">
            I could spend a long time talking about Botonic's features, but I think
            that's enough for now.
            Feel free to read through the code to learn how to integrate NLP capabilities
            and use all kind of rich messages.
        </message>
        <message type="text">
          That's it! You just finished this Tutorial!!🎉   
        </message>
        <message type="text">
            Now, type '/quit' to exit this conversation, and run 'botonic deploy' to publish
            this bot to the world!
        </message>        
      </messages>
    )
  }
}