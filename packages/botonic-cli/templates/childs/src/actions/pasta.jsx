import { Reply, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <Text>
        You chose Pasta! Choose one ingredient:
        <Reply payload='cheese'>Cheese</Reply>
        <Reply payload='tomato'>Tomato</Reply>
      </Text>
    )
  }
}
