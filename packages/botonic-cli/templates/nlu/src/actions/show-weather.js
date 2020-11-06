import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input }) {
    return { input }
  }
  render() {
    return (
      <>
        <Text>It seems today is a rainny day. 🌧</Text>
        <Text>
          But hey! Don't be sad, rainny days are perfect for staying home
          enjoying a good movie! 🎬
        </Text>
      </>
    )
  }
}
