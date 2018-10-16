import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <message type="text">
            Hi! Choose what you want to eat:
            <reply payload="pizza">Pizza</reply>
            <reply payload="pasta">Pasta</reply>
        </message>
    )
  }
}