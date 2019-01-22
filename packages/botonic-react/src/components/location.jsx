import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'
import { Message } from './message'

export class Location extends React.Component {
  static contextType = WebchatContext

  render() {
    if (isBrowser()) return this.renderBrowser()
    else if (isNode()) return this.renderNode()
  }

  renderBrowser() {
    let lat = parseFloat(this.props.lat)
    let long = parseFloat(this.props.long)
    
    return (
      <Message {...this.props} type='location'>
        {' '}
        <div>
          <small>
            <a
              href={`https://www.google.com/maps/@${lat},${long}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {' '}
              See Location
            </a>
          </small>
        </div>
      </Message>
    )
  }

  renderNode() {
    return (
      <message type='location'>
        <lat>{this.props.lat}</lat>
        <long>{this.props.long}</long>
      </message>
    )
  }
}
