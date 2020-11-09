import React from 'react'
import { Message } from './message'
import { isBrowser, INPUT } from '@botonic/core'
import styled from 'styled-components'
import { ROLES } from '../constants'

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: 10px;
`

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
  let content = props.children
  if (isBrowser()) content = <StyledImage src={props.src} />
  return (
    <Message
      role={ROLES.IMAGE_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.IMAGE}
    >
      {content}
    </Message>
  )
}

Image.serialize = serialize
