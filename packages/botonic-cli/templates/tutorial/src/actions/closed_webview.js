import React from 'react'

export default class extends React.Component {
  static async botonicInit({ req }) {}

  render() {
    return (
      <messages>
        <message type='text'>This webview has been closed!</message>
        <message type='text'>
          I could spend a long time talking about Botonic's features, but I
          think that's enough for now. Feel free to read through the code to
          learn how to integrate NLP capabilities and use all kind of rich
          messages.
        </message>
        <message type='text'>Now, please, type 'end'.</message>
      </messages>
    )
  }
}
