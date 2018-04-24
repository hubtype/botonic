import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <message type="text">
            Quick replies appear as temparal buttons that hint options to the users,
            so they can continue the conversation easily without having to type text.
            They also have a payload associated. Now, let's click to the first 
            quick reply by typing '!ai'.
            <reply payload="ai">Artificial Intelligence</reply>
            <reply payload="other">Other</reply>
        </message>
    )
  }
}