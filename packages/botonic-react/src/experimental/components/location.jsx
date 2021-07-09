import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'
import styled from 'styled-components'

import { renderComponent } from '../../util/react'
import { Message } from './message'

const Link = styled.a`
  text-decoration: none;
  font-weight: bold;
  target: blank;
`

const serialize = locationProps => {
  return { lat: locationProps.lat, long: locationProps.long }
}

export const Location = props => {
  const lat = parseFloat(props.lat)
  const long = parseFloat(props.long)
  const locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
  return (
    <Message json={serialize(props)} {...props} type={INPUT.LOCATION}>
      {isBrowser() ? (
        <Link href={locationUrl} target='_blank' rel='noopener noreferrer'>
          {props.text || 'Open Location'}
        </Link>
      ) : (
        <>
          <lat>{lat}</lat>
          <long>{long}</long>
        </>
      )}
    </Message>
  )
}

Location.serialize = serialize
