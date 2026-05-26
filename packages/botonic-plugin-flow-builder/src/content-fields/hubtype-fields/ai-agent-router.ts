import type { VerbosityLevel } from '@botonic/core'
import type { HtInputGuardrailRule } from './ai-agent'
import type { HtBaseNode, HtNodeLink } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtAiAgentSpecialistNode {
  id: string
  target: HtNodeLink
  name?: string
  description?: string
}

export interface HtAiAgentRouterNode extends HtBaseNode {
  type: HtNodeWithContentType.AI_AGENT_ROUTER
  content: {
    name: string
    instructions: string
    model: string
    verbosity: VerbosityLevel
    available_specialists: HtAiAgentSpecialistNode[]
    input_guardrail_rules?: HtInputGuardrailRule[]
  }
}
