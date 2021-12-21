import 'react-photoswipe/lib/photoswipe.css'

import { INPUT, isBrowser } from '@botonic/core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { WebchatContext } from '../contexts'
import { ImageZoomable } from './image-zoomable'
import { Message } from './message'

const StyledImage = styled.img`
  border-radius: 8px;
  max-width: 150px;
  max-height: 150px;
  margin: -3px -6px;
  cursor: pointer;
`

const serialize = imageProps => {
  return { image: imageProps.src }
}

export const Image = props => {
  let content = props.children
  const [isPreviewerOpened, setIsPreviewerOpened] = useState(false)
  // const { getThemeProperty } = useContext(WebchatContext)
  // console.log({ getThemeProperty })
  // const customPreviewer = getThemeProperty('customPreviewer', null)
  // const onClickHandler = () => setisPreviewOpened(true)
  // const onCloseHandler = () => setisPreviewOpened(false)

  if (isBrowser()) {
    content = (
      <>
        <StyledImage
          src={props.src}
          onClick={() => setIsPreviewerOpened(true)}
        />
        <ImageZoomable
          src={props.src}
          isPreviewOpened={isPreviewerOpened}
          onClose={() => setIsPreviewerOpened(false)}
        />
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
