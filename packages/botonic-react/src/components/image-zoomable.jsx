import 'react-photoswipe/lib/photoswipe.css'

import React, { useEffect, useState } from 'react'
import { PhotoSwipe } from 'react-photoswipe'

import { Portal } from '../webchat/components/portal'

function getMeta(url) {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ height: img.height, width: img.width })
      img.onerror = reject
      img.src = url
    })
  } catch (e) {
    console.error(e)
  }
}

export const ImageZoomable = props => {
  const [imageDimensions, setImageDimensions] = useState({})
  useEffect(() => {
    // Remove fullscreen and share buttons
    if (props.isPreviewOpened) {
      const fullScreenButton = document.getElementsByClassName(
        'pswp__button pswp__button--fs'
      )[0]
      fullScreenButton.remove()
      const shareButton = document.getElementsByClassName(
        'pswp__button pswp__button--share'
      )[0]
      shareButton.remove()
    }
  }, [props.isPreviewOpened])

  useEffect(() => {
    if (props.src !== undefined) {
      ;(async () => {
        const dimensions = await getMeta(props.src)
        if (dimensions.width <= 1200 || dimensions.height <= 1200) {
          dimensions.width = 2 * dimensions.width
          dimensions.height = 2 * dimensions.height
        }
        setImageDimensions(dimensions)
      })()
    }
  }, [props.src])

  if (!props.isPreviewOpened) return null
  return (
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
        onClose={props.onClose}
      />
    </Portal>
  )
}
