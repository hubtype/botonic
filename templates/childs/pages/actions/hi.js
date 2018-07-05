import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

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