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

export const Image = props => {
  let content = props.children
  if (isBrowser()) {
    // TODO: Solve workaround, passing as an array because using a React.Fragment nest the object inside an extra props.children
    content = [
      <StyledImage key={Math.random()} src={props.src}></StyledImage>,
      props.children,
    ]
  }

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
