import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
      <messages>
            <message type="text">
                Please, type "start" to start the tutorial.
            </message>
	    </messages>
    )
  }
}