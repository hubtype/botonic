import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>A table has been booked! Enjoy it! 👨🏽‍🍳</Text>
        <Text>
          You can ask me for the weather or to play music while you go to the
          restaurant.
        </Text>
      </>
    )
  }
}
