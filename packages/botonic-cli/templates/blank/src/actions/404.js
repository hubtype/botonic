import React from 'react'

export default class extends React.Component {

  render() {
  	
    return (
          <message type="text">
              I don't understand you
          </message>
    )
    //Uncomment below code to enable Facebook Webviews. Be sure only one render method is executed.
    /*return (
          <message type="text">
              Click to open a Webview!
          	<button url="/webviews/my_webview">Go to webview</button>
          </message>
    )*/
  }
}