import { MessageContentType, NonMessageContentType } from '../../cms'

export interface TextFields {
  name?: string
  text?: string
  buttons?: string[]
  followup?: FollowupField
}

export interface ButtonFields {
  name?: string
  text?: string
  target?: TargetField
}

export interface ImageFields {
  name?: string
  imgUrl?: string
  followup?: FollowupField
}

type FollowupField = {
  id: string
  type: MessageContentType
}

type TargetField = {
  id: string
  type: MessageContentType | NonMessageContentType.PAYLOAD
}
