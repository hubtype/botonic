import React from 'react'
import { Text, RequestContext } from '@botonic/react'
import MainCarousel from './carousel'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  static contextType = RequestContext

  render() {
    return (
      <>
        <Text>This is an example bot of how to customize your webchat.</Text>
        <MainCarousel />
      </>
    )
  }
}
