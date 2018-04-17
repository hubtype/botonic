import dynamic from 'next/dynamic'
import React from 'react'
//const Message = dynamic(import('../botonic/message'))

export default class extends React.Component {

  render() {
    return (
        <message type="text">
            I know dude 😂 😂 😂
        </message>
    )
  }
}