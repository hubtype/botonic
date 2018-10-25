import React from 'react'
const Botonic = require('@botonic/core')

export default class extends React.Component {

  static async botonicInit({req}) {
    
    let openQueues = await Botonic.getOpenQueues(req)
    openQueues = openQueues['queues']
    let is_hanfOff = false
    if(openQueues.indexOf('Customer Support') !== -1){
      await Botonic.humanHandOff(req, 'Customer Support', {action: 'thanks_for_contacting'})
      is_hanfOff = true
    }
    return {req, is_hanfOff}
  }

  render() {
    if(this.props.is_hanfOff){
      return(
        <messages>
          <message type="text">
            You are being trasnfered to an agent!
          </message>
        </messages>
      )
    }else {
      return(
        <messages>
          Sorry, right now we can't serve you...Please contact us later!
        </messages>
      )
    }
  }
}