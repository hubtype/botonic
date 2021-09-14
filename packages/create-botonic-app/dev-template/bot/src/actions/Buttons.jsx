import React from 'react'
import { Text, Button } from '@botonic/react/src/experimental'
// import MyWebview from '../webviews/myWebview'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          Some numbers {[1, 2].map(e => e)}
          <Button payload='payload1'>Button1</Button>
          <Button path='path1'>Path1</Button>
          <Button url='https://www.google.com' target='_blank'>
            Url with target
          </Button>
          {/* <Button webview={MyWebview}>Open Webview</Button> */}
        </Text>
      </>
    )
  }
}
