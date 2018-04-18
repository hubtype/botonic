import dynamic from 'next/dynamic'
import React from 'react'
//const Message = dynamic(import('../botonic/message'))

export default class extends React.Component {

  render() {
    return (
        <messages>
            <message type="text">
                Yay! Let's see what I can show you! 😊
            </message>
            <message type="text">
                You can tell me any word starting with z!
            </message>
            <message type="text">
                I can understand the word 'welcome' followed by one or more
                exclamation or interrogation mark, for example 'welcome!!!!'.
            </message>
            <message type="text">
                If you want to end the conversation, just tell me 'bye'
            </message>
        </messages>
    )
  }
}