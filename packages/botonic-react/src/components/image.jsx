import { INPUT, isBrowser } from '@botonic/core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { ROLES, WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { staticAsset } from '../util/environment'
import { Message } from './message'

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: -3px -6px;
  cursor: ${({ hasPreviewer }) => (hasPreviewer ? 'pointer' : 'auto')};
`

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
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
