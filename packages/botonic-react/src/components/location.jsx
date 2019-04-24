import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { Message } from './message'

const serialize = locationProps => {
  return { location: { lat: locationProps.lat, long: locationProps.long } }
}

export const Location = props => {
  const renderBrowser = () => {
    let lat = parseFloat(props.lat)
    let long = parseFloat(props.long)

    let location_url = `https://www.google.com/maps/@${lat},${long}`

    return (
      <Message
        style={{ maxWidth: '60%' }}
        json={serialize(props)}
        {...props}
        type='location'
      >
        <a href={location_url} target='_blank' rel='noopener noreferrer'>
          {' '}
          See Location
        </a>
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

Location.serialize = serialize
