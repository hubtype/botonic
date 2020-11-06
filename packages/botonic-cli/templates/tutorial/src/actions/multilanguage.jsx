import { RequestContext, Text } from '@botonic/react'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    this.context.setLocale('en')
    const _ = this.context.getString
    return (
      <>
        <Text>
          {_('multilang.text1')} 😊 {_('multilang.text2')}
        </Text>
        <Text>{_('multilang.text3')}</Text>
      </>
    )
  }
}
