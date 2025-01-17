import { INPUT, isBrowser } from '@botonic/core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { ROLES, WEBCHAT } from '../constants'
import { staticAsset } from '../util/environment'
import { WebchatContext } from '../webchat/context'
import { ImageProps } from './index-types'
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

const serialize = (imageProps: { src: string }) => {
  return { image: imageProps.src }
}

export const Image = (props: ImageProps) => {
  props = props.input?.data
    ? { ...props, src: props.input.data }
    : { ...props, src: staticAsset(props.src) }

  let content = props.children

  const [isPreviewerOpened, setIsPreviewerOpened] = useState(false)
  const openPreviewer = () => setIsPreviewerOpened(true)
  const closePreviewer = () => setIsPreviewerOpened(false)

  const { getThemeProperty } = useContext(WebchatContext)
  const ImagePreviewer = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.imagePreviewer,
    null
  )
  if (isBrowser()) {
    content = (
      <>
        <StyledImage
          src={props.src}
          onClick={openPreviewer}
          hasPreviewer={Boolean(ImagePreviewer)}
        />
        {ImagePreviewer && (
          <ImagePreviewer
            src={props.src}
            isPreviewerOpened={isPreviewerOpened}
            openPreviewer={openPreviewer}
            closePreviewer={closePreviewer}
          />
        )}
      </>
    )
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
