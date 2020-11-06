import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>I see that you are quite near from there.📍</Text>
        <Text>So i suggest you to take the bus N85 to reach it!</Text>
        <Text>And remind to put your mask on! 😷</Text>
      </>
    )
  }
}
