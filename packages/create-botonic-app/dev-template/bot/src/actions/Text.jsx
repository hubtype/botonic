// eslint-disable-next-line filenames/match-regex
import { Text } from '@botonic/react/src/experimental'
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Hello World</Text>
        <Text markdown={false}>Bye bye!</Text>
        {/* <Text>
          ## Links Examples
          {'\n'}\{'\n'}
          __Advertisement :)__{'\n'}-
          __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and
          fast image resize in browser.{'\n'}-
          __[babelfish](https://github.com/nodeca/babelfish/)__ - developer
          friendly
        </Text> */}
      </>
    )
  }
}
