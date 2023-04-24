import { INPUT } from '@botonic/core'
import React from 'react'
import styled from 'styled-components'

import { renderComponent } from '../util/react'
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
  const { lat, long } = props

  const renderBrowser = () => {
    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
    return (
      <Message json={serialize(props)} {...props} type={INPUT.LOCATION}>
        <Link href={locationUrl} target='_blank' rel='noopener noreferrer'>
          {props.text || 'Open Location'}
        </Link>
      </Message>
    )
  }

  const renderNode = () => {
    return (
      <message type={INPUT.LOCATION}>
        <lat>{lat}</lat>
        <long>{long}</long>
      </message>
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}

Location.serialize = serialize
