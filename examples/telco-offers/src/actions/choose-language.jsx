import React from 'react'
import { Text, Reply } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Hi! Before we start choose a language: {'\n'}</Text>
        <Text>
          Hola! Antes de empezar elige un idioma:
          <Reply payload='language-es'>Español</Reply>
          <Reply payload='language-en'>English</Reply>
        </Text>
      </>
    )
  }
}
