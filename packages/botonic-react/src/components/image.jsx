import 'react-photoswipe/lib/photoswipe.css'

import { INPUT, isBrowser } from '@botonic/core'
import React, { useState } from 'react'
import { PhotoSwipe } from 'react-photoswipe'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { Portal } from '../webchat/components/portal-modal'
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
  const [isGalleryOpened, setIsGalleryOpened] = useState(false)

  if (isBrowser()) {
    content = (
      <>
        <StyledImage src={props.src} onClick={() => setIsGalleryOpened(true)} />
        {isGalleryOpened && (
          <Portal>
            <PhotoSwipe
              isOpen={true}
              items={[{ src: props.src, w: 1200, h: 900 }]}
              options={{ bgOpacity: 0.7 }}
              onClose={() => setIsGalleryOpened(false)}
            />
          </Portal>
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
