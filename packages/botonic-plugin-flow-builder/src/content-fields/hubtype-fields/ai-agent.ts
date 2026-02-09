import type { HtBaseNode } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtInputGuardrailRule {
  name: string
  description: string
  is_active: boolean
}

export interface HtAiAgentNode extends HtBaseNode {
  type: HtNodeWithContentType.AI_AGENT
  content: {
    name: string
    instructions: string
    active_tools?: { name: string }[]
    input_guardrail_rules?: HtInputGuardrailRule[]
    sources?: { id: string; name: string }[]
  }
}
