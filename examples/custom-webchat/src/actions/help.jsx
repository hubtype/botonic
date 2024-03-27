import { Text } from '@botonic/react'
import React from 'react'

import MainCarousel from './carousel'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          You can customize me by modifying the components I have under
          'webchat' directory.
        </Text>
        <Text>
          Play with all the available attributes and let's see if you can
          overcome my current styling.
        </Text>
        <MainCarousel />
      </>
    )
  }
}
