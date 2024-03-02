import { Reply, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <Text>
        Hi! Choose what you want to eat:
        <Reply payload='pizza'>Pizza</Reply>
        <Reply path='pasta'>Pasta</Reply>
      </Text>
    )
  }
}
