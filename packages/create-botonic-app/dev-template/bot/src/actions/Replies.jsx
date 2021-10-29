// eslint-disable-next-line filenames/match-regex
import { Reply, Text } from '@botonic/react/src/experimental'
import React from 'react'

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
