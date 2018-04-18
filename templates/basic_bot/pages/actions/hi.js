import dynamic from 'next/dynamic'
import React from 'react'
//const Message = dynamic(import('../botonic/message'))

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const user = 'Eric'
    return { user }
  }

  render() {
    return (
        <message type="text">
            Hello World!
        </message>
    )
  }
}