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
          <iframe
            frameBorder='0'
            scrolling='no'
            marginHeight='0'
            marginWidth='0'
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${long}%2C${lat}%2C${long +
              0.003}%2C${lat + 0.003}&amp;layer=mapnik`}
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              maxWidth: '150px',
              maxHeight: '150px',
              margin: '10px'
            }}
          />
          <br />
          <small>
            <a
              href={`https://www.openstreetmap.org/#map=19/${lat}/${long}`}
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
