import dynamic from 'next/dynamic'
import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <message type="text">
            A quick reply is a specific Facebook Messenger type of button.
            It has a payload associated with them too. Now, let's click to this 
            quick reply by typing '!AI'.
            <reply payload="AI">Artificial Intelligence</reply> 
        </message>
    )
  }
}