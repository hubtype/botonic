import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
        <message type="text">
            You chose Pasta! Choose one ingredient:
            <reply payload="cheese">Cheese</reply>
            <reply payload="tomato">Tomato</reply>
        </message>
    )
  }
}