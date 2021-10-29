// eslint-disable-next-line filenames/match-regex
import { Button, Location, Text } from '@botonic/react/src/experimental'
import React from 'react'
export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Locations</Text>
        <Location text={'Open Location'} lat='41.3894058' long='2.1568464' />
      </>
    )
  }
}
