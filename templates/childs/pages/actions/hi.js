import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
        <message type="text">
            Hi! You are in the root. Choose a child route
            <reply payload="child1">Child1</reply>
            <reply payload="child1">Child2</reply>
        </message>
    )
  }
}