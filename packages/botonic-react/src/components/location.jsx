import React from 'react'
import styled from 'styled-components'
import { isBrowser, isNode } from '@botonic/core'
import { Message } from './message'

const Link = styled.a`
  text-decoration: none;
  font-weight: bold;
  target: blank;
`

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
        <Link
          href={locationUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          {props.text || 'Open Location'}
        </Link>
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
