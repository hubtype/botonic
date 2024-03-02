import React from 'react'
import { RequestContext, Text, Button, WebchatSettings } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const hasCancel = request.input.payload || false
    const user = request.input.data
    return { hasCancel, user }
  }

  render() {
    let _ = this.context.getString
    return (
      <>
        {this.props.hasCancel ? (
          <Text>
            {_('bye.cancel')} <Button payload='hi'>{_('start_again')}</Button>
          </Text>
        ) : (
          <Text>
            {_('bye.confirm1')} {this.props.user} {_('bye.confirm2')}
            <Button payload='hi'>{_('start_again')}</Button>
          </Text>
        )}
        <WebchatSettings enableUserInput={false} />
      </>
    )
  }
}
