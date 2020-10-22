import * as cms from '@botonic/plugin-contentful'
import { msgsToBotonic } from '@botonic/react'
import React from 'react'

const converter = new cms.BotonicMsgConverter()

export function renderText(text: cms.Text): React.ReactNode {
  const msg = converter.text(text)
  return msgsToBotonic(msg)
}

export function renderCarousel(carousel: cms.Carousel): React.ReactNode {
  let msg = converter.carousel(carousel)
  return msgsToBotonic(msg)
}
