import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { Message } from './message'

const serialize = locationProps => {
  return { location: { lat: locationProps.lat, long: locationProps.long } }
}

export const Location = props => {
  let lat = parseFloat(props.lat)
  let long = parseFloat(props.long)
  const renderBrowser = () => {
    let locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
    return (
      <Message json={serialize(props)} {...props} type='location'>
        <a
          style={{
            textDecoration: 'none',
            fontWeight: 'bold',
            target: 'blank',
          }}
          href={locationUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          {props.text || 'Open Location'}
        </a>
      </Message>
    )
  }

  const renderNode = () => {
    return (
      <message type='location'>
        <lat>{lat}</lat>
        <long>{long}</long>
      </message>
    )
  }

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Location.serialize = serialize
