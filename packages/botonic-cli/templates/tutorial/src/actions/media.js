import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <messages>
            <message type="text">
                Hey! What a nice pic! Thanks 😊
            </message>
            <message type="text">
                Let me share some files with you:
            </message>
            <message type="image" src="https://io/images/botonic_react_logo-p-500.png">
                <button url="https://io">Visit Botonic</button>
            </message>
            <message type="image" src="https://media3.giphy.com/media/gtPaaCbkxpmWk/giphy.gif"/>
            <message type="video" src="https://www.w3schools.com/html/mov_bbb.mp4"/>
            <message type="audio" src="https://www.w3schools.com/html/horse.mp3"/>
            <message type="document" src="http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf"/>
            <message type="location">
                <lat>41.412255</lat>
                <long>2.2079313</long>
            </message>
        </messages>
    )
  }
}