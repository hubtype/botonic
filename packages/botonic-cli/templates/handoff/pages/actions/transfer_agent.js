import React from 'react'
import { Botonic } from 'botonic'

export default class extends Botonic.React.Component {

  static async botonicInit({ req }) {

   this.humanHandOff(req);
  
  }

  render() {
    return (
       <messages>
            <message type="text">
                Please, wait a second. You are being transferred to an agent.
            </message>
        </messages>
    )
  }
}