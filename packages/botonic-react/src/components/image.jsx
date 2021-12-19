import 'react-photoswipe/lib/photoswipe.css'

import { INPUT, isBrowser } from '@botonic/core'
import React, { useEffect, useState } from 'react'
import { PhotoSwipe } from 'react-photoswipe'
import styled from 'styled-components'

import { ROLES } from '../constants'
import { Portal } from '../webchat/components/portal-modal'
import { Message } from './message'
import { getMeta } from './size-checker'

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
  const [imageDimensions, setImageDimensions] = useState({})
  useEffect(() => {
    // Remove fullscreen and share buttons
    if (isGalleryOpened) {
      const fullScreenButton = document.getElementsByClassName(
        'pswp__button pswp__button--fs'
      )[0]
      fullScreenButton.remove()
      const shareButton = document.getElementsByClassName(
        'pswp__button pswp__button--share'
      )[0]
      shareButton.remove()
    }
  }, [isGalleryOpened])

  useEffect(async () => {
    if (props.src !== undefined) {
      let dimensions = await getMeta(props.src)
      if (dimensions.width <= 1200 || dimensions.height <= 1200) {
        dimensions.width = 2 * dimensions.width
        dimensions.height = 2 * dimensions.height
      }
      setImageDimensions(dimensions)
    }
  }, [props.src])

  if (isBrowser()) {
    content = (
      <>
        <StyledImage src={props.src} onClick={() => setIsGalleryOpened(true)} />
        {isGalleryOpened && (
          <Portal>
            <PhotoSwipe
              isOpen={true}
              items={[
                {
                  src: props.src,
                  w: imageDimensions.width,
                  h: imageDimensions.height,
                },
              ]}
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
