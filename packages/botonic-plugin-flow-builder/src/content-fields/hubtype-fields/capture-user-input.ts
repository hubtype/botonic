import { HtBaseNode, HtNodeLink } from './common'
import { HtNodeWithContentType } from './node-types'

export enum HtAiValidationType {
  NONE = 'None',
  NAME = 'Name',
  EMAIL = 'Email',
  PHONE = 'Phone number',
  CUSTOM = 'Custom',
}

export interface HtCaptureUserInputNode extends HtBaseNode {
  type: HtNodeWithContentType.CAPTURE_USER_INPUT
  content: {
    field_name: string
    ai_validation_type?: HtAiValidationType
    ai_validation_instructions?: string
    capture_success: HtNodeLink
    capture_fail: HtNodeLink
  }
}
