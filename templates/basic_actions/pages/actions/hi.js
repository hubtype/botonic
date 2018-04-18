import dynamic from 'next/dynamic'
import React from 'react'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const user = 'Eric'
    return { user }
  }

  render() {
    return (
        <message type="text">
            Hi {this.props.user}, do you want to try different messages?
            <reply payload="yes">Yeah!</reply>
            <reply payload="no">Nope</reply>
        </message>
    )
  }
}