import React from 'react'
import { Text } from '@botonic/react/src/experimental'

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
