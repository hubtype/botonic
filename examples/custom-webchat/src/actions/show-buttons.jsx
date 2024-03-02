import { Button, RequestContext, Text } from '@botonic/react'
import React from 'react'

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
          <Button url={'https://botonic.io/docs/concepts/webviews'}>
            You can use me to open links
          </Button>
          <Button webview={MyWebview}>To open a webview</Button>
          <Button payload={'customized-payload'}>Or to send a payload</Button>
        </Text>
      </>
    )
  }
}
