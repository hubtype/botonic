import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { Message } from './message'

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: 10px;
`

const serialize = imageProps => {
  return { src: imageProps.src }
}

export const Image = props => (
  <Message
    role={ROLES.IMAGE_MESSAGE}
    json={serialize(props)}
    {...props}
    type={INPUT.IMAGE}
  >
    {isBrowser() && <StyledImage src={props.src}></StyledImage>}
    {props.children}
  </Message>
)

Image.serialize = serialize
