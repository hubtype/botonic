import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <messages>
        	<message type="text">
                Here I display two types of buttons, the first one is a URL button
                and the second is a payload button:
                <button url="https://io">Visit io</button>
                <button payload="carrousel">Show me a carrousel</button>
    	    </message>
            <message type="text">
                Clicking on a button with url will just open that URL in the browser.
                Clicking on a button with payload will send an input of type "postback"
                with that payload.
                You can find more information about how this buttons look in Facebook Messenger
                here: https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#postback
            </message>
            <message type="text">
                If you are in interactive mode, you can type 'webviews' and see how enjoyable they are. 
            </message>            
            <message type="text">
                If you're on the console and want to simulate a button click, you need to type ! (exclamation mark)
                followed by the payload data.
                Go ahead and type '!carrousel'.
            </message>
        </messages>
    )
  }
}