import { Reply, RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>
          Look at these nice replies!
          <Reply payload={'1'}>First Reply</Reply>
          <Reply payload={'2'}>Second Reply</Reply>
          <Reply payload={'3'}>Third Reply</Reply>
          <Reply payload={'4'}>Fourth Reply</Reply>
          <Reply payload={'5'}>Fifth Reply</Reply>
        </Text>
      </>
    )
  }
}
