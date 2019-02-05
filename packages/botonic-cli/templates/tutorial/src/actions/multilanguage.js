import React from 'react'
import { RequestContext, Text } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    this.context.setLocale('en')
    let _ = this.context.getString
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
