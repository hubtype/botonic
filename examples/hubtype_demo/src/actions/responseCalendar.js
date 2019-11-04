import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ input }) {
    try {
      let date =
        input.data.match(/^Reservation for (.*)$/)[1] ||
        input.payload.match(/^FECHA_(.*)$/)[1]
      return { date }
    } catch (e) {
      return { error: true }
    }
  }

  render() {
    return this.props.error ? (
      <Text>Oooops, I didn't understand you</Text>
    ) : (
      <>
        <Text>Awesome! Your reservation is at {this.props.date}</Text>
        <Text>See you soon!</Text>
      </>
    )
  }
}
