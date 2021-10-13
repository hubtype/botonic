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
  name: string
  elements: string[]
}

export interface ElementFields {
  title: string
  subtitle: string
  imageId: string
  buttons: string[]
}
