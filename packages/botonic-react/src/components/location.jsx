import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { Message } from './message'

export const Location = props => {
  const renderBrowser = () => {
    let lat = parseFloat(props.lat)
    let long = parseFloat(props.long)

    let location_url = `https://www.google.com/maps/@${lat},${long}`
    if (props.data) {
      location_url = props.data
    }

    return (
      <Message {...props} type='location'>
        {' '}
        <div>
          <small>
            <a href={location_url} target='_blank' rel='noopener noreferrer'>
              {' '}
              See Location
            </a>
          </small>
        </div>
      </Message>
    )
  }

  const renderNode = () => {
    return (
      <message type='location'>
        <lat>{props.lat}</lat>
        <long>{props.long}</long>
      </message>
    )
  }

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
