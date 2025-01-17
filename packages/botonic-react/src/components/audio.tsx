import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { staticAsset } from '../util/environment'
import { AudioProps } from './index-types'
import { Message } from './message'

const StyledAudio = styled.audio`
  max-width: 100%;
`

const serialize = (audioProps: { src: string }) => {
  return { audio: audioProps.src }
}

export const Audio = (props: AudioProps) => {
  props = { ...props, src: staticAsset(props.src) }
  let content = props.children
  if (isBrowser())
    content = (
      <StyledAudio id='myAudio' controls>
        <source src={props.src} type='audio/mpeg' />
        Your browser does not support this audio format.
      </StyledAudio>
    )
  return (
    <Message
      role={ROLES.AUDIO_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.AUDIO}
    >
      {content}
    </Message>
  )
}

Audio.serialize = serialize
