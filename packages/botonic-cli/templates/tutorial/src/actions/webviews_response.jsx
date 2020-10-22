import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    //With this example, you can get an idea of how to capture the data received.
    let returned_data = input.payload.match(/^DATA_(.*)$/)[1]
    return { returned_data }
  }

  render() {
    return (
      <>
        <Text>This is the data retrieved from the webview:</Text>
        <Text>{this.props.returned_data}</Text>
        <Text>
          I could spend a long time talking about Botonic's features, but I
          think that's enough for now. Feel free to read through the code to
          learn how to integrate NLP capabilities and use all kind of rich
          messages.
        </Text>
        <Text>Now, please, type 'end'.</Text>
      </>
    )
  }
}
