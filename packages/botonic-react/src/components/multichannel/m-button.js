import React from 'react'
import { RequestContext } from '../../contexts'
import { Button } from '../button'
import { Providers } from '@botonic/core'

export class MultichannelButton extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
  }
  render() {
    if (this.context.session.user.provider == Providers.Messaging.WHATSAPPNEW) {
      if (this.props.url) {
        return `${this.props.children}: ${this.props.url}`
      }
      if (this.props.payload || this.props.path) {
        return `${this.props.children}`
      }
      if (this.props.webview) {
        return <Button {...this.props}>{`${this.props.children}`}</Button>
      }
    } else {
      return <Button {...this.props}>{this.props.children}</Button>
    }
  }
}
