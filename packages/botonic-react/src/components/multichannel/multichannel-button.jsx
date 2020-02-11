import React from 'react'
import { RequestContext } from '../../contexts'
import { Button } from '../button'
import { isWhatsapp } from './multichannel-utils'

export class MultichannelButton extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
  }
  hasUrl() {
    return Boolean(this.props.url)
  }
  hasPath() {
    return Boolean(this.props.path)
  }
  hasPayload() {
    return Boolean(this.props.payload)
  }
  hasWebview() {
    return Boolean(this.props.webview)
  }

  getText() {
    return `${this.props.children}`
  }

  getUrl() {
    return this.props.url
  }

  getWebview() {
    return this.props.webview
  }

  render() {
    if (isWhatsapp(this.context)) {
      if (this.hasUrl()) return `${this.getText()}: ${this.getUrl()}`
      else if (this.hasPath() || this.hasPayload()) return `${this.getText()}`
      else if (this.hasWebview())
        return <Button {...this.props}>{this.getText()}</Button>
      else return <Button {...this.props}>{this.props.children}</Button>
    }
    return <Button {...this.props}>{this.props.children}</Button>
  }
}
