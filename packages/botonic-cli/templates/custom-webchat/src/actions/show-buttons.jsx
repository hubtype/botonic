import React from 'react'
import { Text, Button, RequestContext } from '@botonic/react'
import { MyWebview } from '../webviews/my-webview'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>
          What about these buttons?
          <Button url={'https://docs.botonic.io/main-concepts/webviews'}>
            You can use me to open links
          </Button>
          <Button webview={MyWebview}>To open a webview</Button>
          <Button payload={'customized-payload'}>Or to send a payload</Button>
        </Text>
      </>
    )
  }
}
