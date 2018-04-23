import dynamic from 'next/dynamic'
import React from 'react'
//const Message = dynamic(import('../botonic/message'))

export default class extends React.Component {

  render() {
    return (
    	<message type="text">
            Here we display three types of buttons:
            	-URL buttons
            	-Payload buttons
            	-Href buttons
            <button url="https://botonic.io">Visit Botonic</button>
            <button payload="carrousel">Carrousel</button>
            <button href="https://www.google.com">Visti Google</button>
	        <message type="text">
	        	As you can see, the url and href buttons are buttons with a webpage link.
	        	Otherwise, the payload button is a button with a payload action attached. 
	        	If we want to activate the button action, we will have to type !PAYLOAD, in this case
	        	'!carrousel'.
	        </message>
	    </message>
    )
  }
}