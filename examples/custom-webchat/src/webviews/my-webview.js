import { WebviewRequestContext } from '@botonic/react'
import React from 'react'

export class MyWebview extends React.Component {
  static contextType = WebviewRequestContext
  state = {
    counter: 0,
  }

  componentDidMount() {
    document.title = 'MyBot | MyWebview'
  }

  handleClick() {
    this.setState({
      counter: this.state.counter + 1,
    })
  }

  close() {
    // Here we want to explicitly emit a message after closing a webview.
    this.context.closeWebview({
      payload: 'closed_webview',
    })
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <h1>This is a Botonic Webview!</h1>
        <button style={{ width: '20%' }} onClick={() => this.handleClick()}>
          Click Me
        </button>
        <h2>{this.state.counter}</h2>
        <button style={{ width: '50%' }} onClick={() => this.close()}>
          Click me to close this webview
        </button>
      </div>
    )
  }
}
