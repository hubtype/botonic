import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <message type='text'>
        You chose Pizza! Choose one ingredient:
        <reply payload='sausage'>Sausage</reply>
        <reply payload='bacon'>Bacon</reply>
      </message>
    )
  }
}
