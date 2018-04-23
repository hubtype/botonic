import React from 'react'

export default class extends React.Component {

  render() {
    return (
    	<message>
	        <message type="text">
	            This is the default page where the bot goes when he doesn't understand
	            what the user is trying to say.
	        </message>
	        <message type="text">
	            Here, you can define the logic that you want, and when the bot doesn't understand
	            the user input, it can show some examples of what the user can say or not.
	        </message>
	        <message type="text">
	            If you want to end this conversation, just type '/quit'.
	            Otherwise, if you want to go to the beggining of the conversation, just type 'go'.
	        </message>
	    </message>
    )
  }
}