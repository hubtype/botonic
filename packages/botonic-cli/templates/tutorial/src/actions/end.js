import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <messages>
        <message type='text'>
          That's it! You just finished this Tutorial!!🎉
        </message>
        <message type='text'>
          Next, go back to the Getting Started Tutorial to learn how to create
          your first bot action
        </message>
        <message type='text'>Type '/q' to exit this conversation</message>
      </messages>
    )
  }
}
