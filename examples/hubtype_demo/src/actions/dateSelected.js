import React from 'react'
import { Text, RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input }) {
    let dates = input.payload.match(/^(DATES_SELECTED-)(.*)--(.*)/)
    let startD = dates[2] ? dates[2] : ''
    let endD = dates[3] ? dates[3] : ''
    return { startD, endD }
  }
  render() {
    return (
      <Text>
        Your reservation starts at {this.props.startD} and ends at{' '}
        {this.props.endD}
      </Text>
    )
  }
}
