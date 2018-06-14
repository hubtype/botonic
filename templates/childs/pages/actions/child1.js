import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
        <message type="text">
            You are in the Child1! Choose a child route
            <reply payload="child1-1">Child1-1</reply>
            <reply payload="child1-2">Child1-2</reply>
        </message>
    )
  }
}