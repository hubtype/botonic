import React from 'react'

export default class extends React.Component {

  render() {
    return (
        <message type="text">
            I know your age, and it's {this.props.params.age}
        </message>
    )
  }
}