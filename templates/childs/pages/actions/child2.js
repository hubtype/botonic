import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
        <message type="text">
            You are in the Child2! Choose a child route
            <reply payload="child2-1">Child2-1</reply>
            <reply payload="child2-2">Child2-2</reply>
        </message>
    )
  }
}