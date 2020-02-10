import * as React from 'react'

export interface MultiChannelProps {
  channel: string
}

export class MultiChannel extends React.Component<MultiChannelProps, any> {
}

// Text
export interface MultiChannelTextProps {
  index?: string
}

export class MultichannelText extends React.Component<MultiChannelTextProps, any> {
}

// Carousel
export interface MultichannelCarouselProps {
  enableURL?: boolean
}

export class MultichannelCarousel extends React.Component<MultichannelCarouselProps, any> {
}
