import * as React from 'react'

export const Multichannel: React.FunctionComponent<{
  firstIndex: number
  boldIndex: boolean
}>

// Text
export interface MultichannelTextProps {
  index?: string
}

export const MultichannelText: React.FunctionComponent<MultichannelTextProps>

// Carousel
export interface MultichannelCarouselProps {
  enableURL?: boolean
}
export const MultichannelCarousel: React.FunctionComponent<MultichannelCarouselProps>
