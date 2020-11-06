import { Reply, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <Text>
        Hey, what clothes are you interested in?
        <Reply payload='men-shirts'>Mens shirts</Reply>
        <Reply payload='women-shirts'>Womens shirts</Reply>
      </Text>
    )
  }
}
