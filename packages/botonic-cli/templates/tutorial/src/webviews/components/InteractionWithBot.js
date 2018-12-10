import React from 'react'
import { Button } from 'reactstrap'
import { BotonicWebview } from '@botonic/react'

class InteractionWithBot extends React.Component {
  //for further information, see: https://reactjs.org/docs/getting-started.html
  constructor(props) {
    super(props)
    //Here you can define all the state variables you will have to deal with
    this.state = {}
  }

  componentDidMount() {
    document.title = 'MyBot | InteractionWithBot'
  }

  close() {
    /*
    In order to pass data back to the bot, we must include its context object
    and also the sring data we want to send. We will treat this data as a payload in botonic.config.js
    */
    BotonicWebview.close(this.props.context, 'DATA_returned_data')
  }

  render() {
    return (
      <div>
        <div className='interaction-with-bot'>
          <h4>This is a variable coming from the bot:</h4>
          <p>{this.props.context.some_data}</p>
          <Button onClick={() => this.close()}>
            Click me to send data back
          </Button>
        </div>
      </div>
    )
  }
}

export default InteractionWithBot
