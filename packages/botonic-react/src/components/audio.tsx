import { INPUT, isBrowser } from '@botonic/core'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { staticAsset } from '../util/environment'
import type { AudioProps } from './index-types'
import { serializeMedia, withMediaCaption } from './media-caption'
import { Message } from './message'

const StyledAudio = styled.audio`
  max-width: 100%;
`

const serialize = (audioProps: { src: string; caption?: string }) =>
  serializeMedia('audio', audioProps)

export const Audio = (props: AudioProps) => {
  const { caption, ...messageProps } = props
  const resolved = { ...messageProps, src: staticAsset(messageProps.src) }
  let content = resolved.children
  if (isBrowser()) {
    content = (
      <StyledAudio id='myAudio' controls>
        <source src={resolved.src} type='audio/mpeg' />
        Your browser does not support this audio format.
      </StyledAudio>
    )
  }
  content = withMediaCaption(content, caption)
  return (
    <Message
      role={ROLES.AUDIO_MESSAGE}
      json={serialize({ src: resolved.src, caption })}
      {...resolved}
      type={INPUT.AUDIO}
    >
      {content}
    </Message>
  )
}

Audio.serialize = serialize
