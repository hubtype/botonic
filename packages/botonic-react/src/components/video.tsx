import { INPUT, isBrowser } from '@botonic/core'
import styled from 'styled-components'

import { COLORS, ROLES } from '../constants'
import { staticAsset } from '../util/environment'
import type { VideoProps } from './index-types'
import { serializeMedia, withMediaCaption } from './media-caption'
import { Message } from './message'

const StyledVideo = styled.video`
  background-color: ${COLORS.SOLID_BLACK_ALPHA_0_5};
  border-radius: 8px;
  max-height: 180px;
  max-width: 300px;
  margin: 10px;
`

const serialize = (videoProps: { src: string; caption?: string }) =>
  serializeMedia('video', videoProps)

export const Video = (props: VideoProps) => {
  const { caption, ...messageProps } = props
  const resolved = { ...messageProps, src: staticAsset(messageProps.src) }
  let content = resolved.children
  if (isBrowser()) {
    content = (
      <StyledVideo controls>
        <source src={resolved.src} />
      </StyledVideo>
    )
  }
  content = withMediaCaption(content, caption)
  return (
    <Message
      role={ROLES.VIDEO_MESSAGE}
      json={serialize({ src: resolved.src, caption })}
      {...resolved}
      type={INPUT.VIDEO}
    >
      {content}
    </Message>
  )
}

Video.serialize = serialize
