import React from 'react'
import styled from 'styled-components'
import { Message } from './message'
import { isBrowser, INPUT } from '@botonic/core'
import { COLORS } from '../constants'

const StyledVideo = styled.video`
  background-color: ${COLORS.SOLID_BLACK_ALPHA_0_5};
  border-radius: 8px;
  max-height: 180px;
  max-width: 300px;
  margin: 10px;
`

const serialize = videoProps => {
  return { video: videoProps.src }
}

export const Video = props => {
  let content = props.children
  if (isBrowser())
    content = (
      <StyledVideo controls>
        <source src={props.src} />
      </StyledVideo>
    )
  return (
    <Message json={serialize(props)} {...props} type={INPUT.VIDEO}>
      {content}
    </Message>
  )
}

Video.serialize = serialize
