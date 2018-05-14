import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  render() {
    return (
        <message type="text">
            I know your age, and it's {this.props.params.age}
        </message>
    )
  }
}