// eslint-disable-next-line filenames/match-regex
import { RequestContext, Text } from '@botonic/react/src/experimental'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit() {}

  render() {
    this.context.setLocale('es')
    let _ = this.context.getString
    return (
      <>
        <Text>Welcome to Botonic! </Text>
        <Text>From locale: {_('hello')}</Text>
      </>
    )
  }
}
