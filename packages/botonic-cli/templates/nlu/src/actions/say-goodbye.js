import React from 'react'
import { Text } from '@botonic/react'
import { RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>You're welcome human!</Text>
        <Text>Just let me know if you need anything else!</Text>
        <Text>
          See you, and remember to play with lots of training phrases! 🤗
        </Text>
      </>
    )
  }
}
