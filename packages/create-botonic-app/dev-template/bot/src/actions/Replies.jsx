import React from 'react'
import { Text, Reply } from '@botonic/react/src/experimental'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          Some replies
          <Reply payload='payload1'>ReplyPayload1</Reply>
          <Reply path='path1'>ReplyPath1</Reply>
        </Text>
      </>
    )
  }
}
