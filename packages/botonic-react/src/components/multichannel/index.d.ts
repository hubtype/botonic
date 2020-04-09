import * as React from 'react'

type IndexMode = 'number' | 'letter' | undefined //undefined means no index

export interface MultichannelViewOptions {
  boldIndex?: boolean
  indexSeparator?: string // after it, a space will always be added
}

export interface MultichannelContextType extends MultichannelViewOptions {
  currentIndex: number | string // can be letter or number
  oneMessagePerElement?: boolean
}

// Text
export interface MultichannelTextProps extends MultichannelViewOptions {
  index?: string
  indexMode?: IndexMode
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
  newLine?: boolean
}
export const MultichannelButton: React.FunctionComponent<MultichannelButtonProps>

export interface MultichannelProps extends MultichannelViewOptions {
  firstIndex?: number | string
  carousel?: MultichannelCarouselProps
  text?: MultichannelTextProps
  oneMessagePerElement?: boolean
}

export const Multichannel: React.FunctionComponent<MultichannelProps>
