import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'
import styled from 'styled-components'

import { COLORS, ROLES } from '../constants'
import { staticAsset } from '../util/environment'
import { VideoProps } from './index-types'
import { Message } from './message'

const StyledVideo = styled.video`
  background-color: ${COLORS.SOLID_BLACK_ALPHA_0_5};
  border-radius: 8px;
  max-height: 180px;
  max-width: 300px;
  margin: 10px;
`

const serialize = (videoProps: { src: string }) => {
  return { video: videoProps.src }
}

export const Video = (props: VideoProps) => {
  props = { ...props, src: staticAsset(props.src) }
  let content = props.children
  if (isBrowser())
    content = (
      <StyledVideo controls>
        <source src={props.src} />
      </StyledVideo>
    )
  return (
    <Message
      role={ROLES.VIDEO_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.VIDEO}
    >
      {content}
    </Message>
  )
}

Video.serialize = serialize
