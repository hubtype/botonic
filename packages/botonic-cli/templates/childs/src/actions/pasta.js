import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <message type='text'>
        You chose Pasta! Choose one ingredient:
        <reply payload='cheese'>Cheese</reply>
        <reply payload='tomato'>Tomato</reply>
      </message>
    )
  }
}
