import React from 'react'
import { RequestContext } from '@botonic/react'

export default class InteractionWithBot extends React.Component {
  static contextType = RequestContext

  componentDidMount() {
    document.title = 'MyBot | InteractionWithBot'
  }

  render() {
    return (
      <div>
        <div className='interaction-with-bot'>
          <h4>This is a variable coming from the bot:</h4>
          <p>{this.context.params.whatever}</p>
          <button
            onClick={() =>
              this.context.closeWebview({
                payload: 'DATA_I am a string coming from webviews!'
              })
            }
          >
            Click me to send data back
          </button>
        </div>
      </div>
    )
  }
}
