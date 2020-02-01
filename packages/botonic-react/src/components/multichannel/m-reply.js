import React from 'react'
import { RequestContext } from '../../contexts'
import { Reply } from '../reply'
import { Providers } from '@botonic/core'

export class MultichannelReply extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
  }
  render() {
    if (this.context.session.user.provider == Providers.Messaging.WHATSAPPNEW) {
      if (this.props.payload || this.props.path) {
        return `${this.props.children}`
      }
    } else {
      return <Reply {...this.props}>{this.props.children}</Reply>
    }
  }
}
