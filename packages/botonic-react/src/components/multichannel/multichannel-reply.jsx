import React from 'react'
import { RequestContext } from '../../contexts'
import { Reply } from '../reply'
import { isWhatsapp } from './multichannel-utils'

export class MultichannelReply extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
  }

  hasPath() {
    return Boolean(this.props.path)
  }
  hasPayload() {
    return Boolean(this.props.payload)
  }

  getText() {
    return `${this.props.children}`
  }

  render() {
    if (isWhatsapp(this.context)) {
      if (this.hasPath() || this.hasPayload()) {
        return `${this.getText()}`
      }
    } else {
      return <Reply {...this.props}>{this.props.children}</Reply>
    }
  }
}
