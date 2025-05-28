import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtAiAgentNode extends HtBaseNode {
  type: HtNodeWithContentType.AI_AGENT
  content: {
    name: string
    instructions: string
  }
}
