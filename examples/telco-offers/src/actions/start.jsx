import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const language = request.input.payload.split('-')[1]
    const extra_data = { phone: [] }
    request.session.user.extra_data = extra_data
    return { language }
  }

  render() {
    this.props.language && this.context.setLocale(this.props.language)
    let _ = this.context.getString
    return (
      <>
        <Text>
          {_('start_text')}
          <Button payload='internet'>{_('internet')}</Button>
          <Button payload='phone'>{_('phone')}</Button>
        </Text>
      </>
    )
  }
}
