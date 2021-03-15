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
  return { image: imageProps.src }
}

/**
 * @param {ImageProps} props
 * @return {JSX.Element}
 */
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
