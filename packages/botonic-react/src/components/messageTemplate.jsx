import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'

export class MessageTemplate extends React.Component {
  static contextType = WebchatContext

  render() {
    if (isBrowser()) return this.renderBrowser()
    else if (isNode()) return this.renderNode()
  }

  renderBrowser() {
    return null
  }

  renderNode() {
    return (
        <message type="template">
            <pre dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.payload)}}></pre>
        </message>
    )
  }
}
