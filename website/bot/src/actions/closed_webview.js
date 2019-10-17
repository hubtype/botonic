import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>This webview has been closed!</Text>
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
