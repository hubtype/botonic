import React from 'react'
import { Text, Reply, Button } from '@botonic/react/src/experimental'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          Text with Buttons and Replies
          <Button payload='payload1'>Button1</Button>
          <Button url='https://www.google.com' target='_blank'>
            Url with target
          </Button>
          <Reply payload='payload1'>ReplyPayload1</Reply>
          <Reply path='path1'>ReplyPath1</Reply>
        </Text>
      </>
    )
  }
}
