import type { HtInputGuardrailRule } from './ai-agent'
import type { HtBaseNode, HtNodeLink } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtAiAgentSlotNode {
  id: string
  target: HtNodeLink
  name?: string
  description?: string
}

export interface HtAiAgentRouterNode extends HtBaseNode {
  type: HtNodeWithContentType.AI_AGENT_ROUTER
  content: {
    instructions: string
    model: string
    agent_slots: HtAiAgentSlotNode[]
    input_guardrail_rules?: HtInputGuardrailRule[]
  }
}
