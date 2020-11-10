import { Reply, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <Text>
        You chose Pizza! Choose one ingredient:
        <Reply payload='sausage'>Sausage</Reply>
        <Reply payload='bacon'>Bacon</Reply>
      </Text>
    )
  }
}
