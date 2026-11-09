import { INPUT, isBrowser } from '@botonic/core'
import { useContext, useState } from 'react'
import styled from 'styled-components'

import { ROLES, WEBCHAT } from '../constants'
import { staticAsset } from '../util/environment'
import { WebchatContext } from '../webchat/context'
import type { ImageProps } from './index-types'
import { serializeMedia, withMediaCaption } from './media-caption'
import { Message } from './message'

interface StyledImageProps {
  hasPreviewer: boolean
}

const StyledImage = styled.img<StyledImageProps>`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: -3px -6px;
  cursor: ${({ hasPreviewer }) => (hasPreviewer ? 'pointer' : 'auto')};
`

const serialize = (imageProps: { src: string; caption?: string }) =>
  serializeMedia('image', imageProps)

export const Image = (props: ImageProps) => {
  const { caption, ...messageProps } = props
  const resolved = messageProps.input?.data
    ? { ...messageProps, src: messageProps.input.data }
    : { ...messageProps, src: staticAsset(messageProps.src) }

  let content = resolved.children

  const [isPreviewerOpened, setIsPreviewerOpened] = useState(false)
  const openPreviewer = () => setIsPreviewerOpened(true)
  const closePreviewer = () => setIsPreviewerOpened(false)

  const { getThemeProperty } = useContext(WebchatContext)
  const ImagePreviewer = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.imagePreviewer
  )

  if (isBrowser()) {
    content = (
      <>
        <StyledImage
          src={resolved.src}
          onClick={openPreviewer}
          hasPreviewer={Boolean(ImagePreviewer)}
        />
        {ImagePreviewer && (
          <ImagePreviewer
            src={resolved.src}
            isPreviewerOpened={isPreviewerOpened}
            openPreviewer={openPreviewer}
            closePreviewer={closePreviewer}
          />
        )}
      </>
    )
  }

  content = withMediaCaption(content, caption)

  return (
    <Message
      role={ROLES.IMAGE_MESSAGE}
      json={serialize({ src: resolved.src, caption })}
      {...resolved}
      type={INPUT.IMAGE}
    >
      {content}
    </Message>
  )
}

Image.serialize = serialize
