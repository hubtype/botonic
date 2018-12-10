import React from 'react'

export default class extends React.Component {
  static async botonicInit({ req }) {
    //With this example, you can get an idea of how to capture the data received.
    req.context.returned_data = req.input.payload.match(/^DATA_(.*)$/)[1]
  }

  render() {
    return (
      <messages>
        <message type='text'>
          This is the data retrieved from the webview:
        </message>
        <message type='text'>{this.props.context.returned_data}</message>
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
