import React from 'react'
import { default as _ } from '@botonic/core/lib/i18n'

export default class extends React.Component {
  static async botonicInit({ req }) {
    _.setLocale('en')
  }

  render() {
    return (
      <messages>
        <message type='text'>
          {_('multilang.text1')} 😊 {_('multilang.text2')}
        </message>
        <message type='text'>{_('multilang.text3')}</message>
      </messages>
    )
  }
}
