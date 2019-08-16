import React from 'react'
import { Text } from '@botonic/react'
import { RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input, session, lastRoutePath }) {
    let option = input.payload.split('-')[1]
    return { option }
  }

  render() {
    return (
      <>
        <Text>{`${this.props.option} is always a very good option!`}</Text>
        <Text>Do you need something else?</Text>
      </>
    )
  }
}
