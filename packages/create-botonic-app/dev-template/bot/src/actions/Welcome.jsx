import { Text } from '@botonic/react/src/experimental'
import React from 'react'

export default class extends React.Component {
  static async botonicInit() {}
  render() {
    return (
      <>
        <Text>Welcome to Botonic!</Text>
        <Text>This works!</Text>
      </>
    )
  }
}
