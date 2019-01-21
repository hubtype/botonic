import React from 'react'
import { RequestContext } from '@botonic/react'

export default class MyWebview extends React.Component {
  static contextType = RequestContext
  state = {
    counter: 0
  }

  componentDidMount() {
    document.title = 'MyBot | MyWebview'
  }

  handleClick() {
    this.setState({
      counter: this.state.counter + 1
    })
  }

  close() {
    /*
    Here we want to explicitly emit a message after closing a webview.
    You can also call this method with empty arguments like: this.context.closeWebview()
    but be aware that no data will be passed back to the bot.
    */
    this.context.closeWebview({
      payload: 'closed_webview'
    })
  }

  render() {
    return (
      <div>
        <h1>This is a Botonic Webview!</h1>
        <button onClick={() => this.handleClick()}>Click Me</button>
        <h2>{this.state.counter}</h2>
        <button onClick={() => this.close()}>
          Click me to close this webview
        </button>
      </div>
    )
  }
}
