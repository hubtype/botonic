import React from 'react'
import { Botonic } from '@botonic/core'
//import { default as ThanksForContactingAgent } from './thank_contacting_agent'

/*
  NOTE: 
  This example makes sense in a production environment.
  The purpose of this template is to give an example of how this solution should be implemented.
*/

export default class extends React.Component {

  static async botonicInit({req}) {
    
    /* At first instance, what we want is to retrieve the queue to use */
    //let selectedQueue = req.params ? req.params['queue'] : null;
    
    /* In this case, we take the url, which we have previously stored in the context object */
    //let api_url = req['context']['hubtype_api']
    
    /*
      Once we have the necessary parameters, then we can call 
      the method getOpenQueues to retrieve those which are open
    */
    //let openQueues = (await Botonic.getOpenQueues(req, api_url))['queues']
    
    /*
      In case of the queues are open, we apply the proper logic to do
    */
    
    let is_handOff = false
    
    /*if(selectedQueue && openQueues.indexOf(selectedQueue) !== -1){
      await Botonic.humanHandOff(req, selectedQueue, {action: 'thank_contacting_agent'})
      is_handOff = true
    }*/
    
    return {req, is_handOff/*, selectedQueue*/}
  }

  /* Finally, we render the message we want to display depending on the preprocessed logic */
  render() {
    if(this.props.is_handOff){
      return(
        <messages>
          <message type="text">
            The case will be transferred to a human agent.
          </message>
        </messages>
      )
    }else {
      return(
        <messages>
          <message type="text">
            Remember that we open from 8 a.m. to 5 p.m.
          </message>
        </messages>
      )
    }
  }
}