import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <messages>
        	<message type="text">
                Here we display two types of buttons:
                <button url="https://botonic.io">URL</button>
                <button payload="carrousel">Postback</button>
    	    </message>
            <message type="text">
                Clicking on a button with url will just open that URL in the browser.
                Clicking on a button with payload will send an input of type "postback"
                with that payload.
                You can find more information about how this buttons look in Facebook Messenger
                here: https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#postback
            </message>
            <message type="text">
                If you want to simulate a button click on this console, just type !PAYLOAD.
                Go ahead and type '!carrousel'.
            </message>
        </messages>
    )
  }
}