import * as React from 'react'

type IndexMode = 'number' | 'letter' | undefined //undefined means no index

export interface MultichannelViewOptions {
  boldIndex?: boolean
  indexSeparator?: string // after it, a space will always be added
}

export interface MultichannelContextType extends MultichannelViewOptions {
  currentIndex: number | string // can be letter or number
  oneMessagePerComponent?: boolean
}

// Text
export interface MultichannelTextProps extends MultichannelViewOptions {
  index?: string
  indexMode?: IndexMode
  newline?: boolean
}

export const MultichannelText: React.FunctionComponent<MultichannelTextProps>

// Carousel
export interface MultichannelCarouselProps extends MultichannelViewOptions {
  enableURL?: boolean
  indexMode?: IndexMode
  showTitle?: boolean
  showSubtitle?: boolean
}
export const MultichannelCarousel: React.FunctionComponent<MultichannelCarouselProps>

// Button
export interface MultichannelButtonProps {
  newline?: boolean
}
export const MultichannelButton: React.FunctionComponent<MultichannelButtonProps>

export interface MultichannelProps extends MultichannelViewOptions {
  firstIndex?: number | string
  carousel?: MultichannelCarouselProps
  text?: MultichannelTextProps
  oneMessagePerComponent?: boolean
}

export const Multichannel: React.FunctionComponent<MultichannelProps>
