import { ContentId } from '../../cms'

export interface TextFields {
  name?: string
  text?: string
  buttons?: string[]
  followup?: ContentId
  buttonsStyle?: 'Buttons' | 'QuickReplies'
}

export interface ButtonFields {
  name?: string
  text?: string
  target?: ContentId
}

export interface ImageFields {
  name?: string
  imgUrl?: string
  followup?: ContentId
}

export interface CarouselFields {
  name?: string
  elements?: string[]
}

export interface ElementFields {
  name?: string
  title?: string
  subtitle?: string
  image?: string
  buttons?: string[]
}

export interface UrlFields {
  name?: string
  url?: string
}

export interface PayloadFields {
  payload?: string
}
