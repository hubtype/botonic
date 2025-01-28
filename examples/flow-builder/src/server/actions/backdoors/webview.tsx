import { Button, RequestContext, Text } from '@botonic/react'
import React from 'react'

import { ExampleWebview } from '../../../client/webviews/example/index'

export class OpenWebviewBackdoorAction extends React.Component {
  static contextType = RequestContext

  render(): React.ReactNode {
    return (
      <Text>
        Webview example
        <Button webview={ExampleWebview}>Open</Button>
      </Text>
    )
  }
}
