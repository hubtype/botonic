import type { HtBaseNode, HtNodeLink } from './common'
import type { HtNodeWithContentType } from './node-types'

export enum HtAiValidationType {
  NONE = 'none',
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  CUSTOM = 'custom',
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
