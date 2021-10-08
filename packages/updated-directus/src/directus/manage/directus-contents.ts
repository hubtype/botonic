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
