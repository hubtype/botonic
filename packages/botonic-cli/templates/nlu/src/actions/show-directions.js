import React from 'react'
import { RequestContext, Text, Location } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>I see that you are quite near from there</Text>
        <Location>
          <lat>40.6976701</lat>
          <long>74.2598702</long>
        </Location>
        <Text>So i suggest you to take the bus N85 to reach it!</Text>
      </>
    )
  }
}
