export type IndexMode = 'number' | 'letter' | undefined //undefined means no index

export interface MultichannelViewOptions {
  boldIndex?: boolean
  indexSeparator?: string // after it, a space will always be added
}

export interface MultichannelContextType extends MultichannelViewOptions {
  currentIndex: number | string // can be letter or number
  /** @see same field at MultichannelProps */
  messageSeparator?: string
}

// Text
export interface MultichannelTextProps extends MultichannelViewOptions {
  index?: string
  indexMode?: IndexMode
  /** Defaults to no separator between lines*/
  newline?: string
  buttonsAsText?: boolean
  buttonsTextSeparator?: string
  menuButtonTextWhatsappList?: string
}

// Carousel
export interface MultichannelCarouselProps extends MultichannelViewOptions {
  enableURL?: boolean
  indexMode?: IndexMode
  showTitle?: boolean
  showSubtitle?: boolean
  buttonsAsText?: boolean
}

// Button
export interface MultichannelButtonProps {
  newline?: string
  path?: string
  payload?: string
  url?: string
  webview?: string
  asText?: boolean
}

// Reply

export interface MultichannelProps extends MultichannelViewOptions {
  firstIndex?: number | string
  carousel?: MultichannelCarouselProps
  text?: MultichannelTextProps
  /**
   * If undefined, each component will be served in a different botonic message
   * '' will concatenate in the same line
   * '\n' will split in different lines
   * '\n\n' will separate with an empty line
   **/
  messageSeparator?: string
}
