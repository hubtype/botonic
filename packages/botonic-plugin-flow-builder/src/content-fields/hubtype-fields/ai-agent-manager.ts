import type { VerbosityLevel } from '@botonic/core'
import type { HtInputGuardrailRule } from './ai-agent'
import type { HtAiAgentSlotNode } from './ai-agent-router'
import type { HtBaseNode } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtAiAgentManagerNode extends HtBaseNode {
  type: HtNodeWithContentType.AI_AGENT_MANAGER
  content: {
    instructions: string
    model: string
    verbosity: VerbosityLevel
    active_tools?: { name: string }[]
    agent_slots: HtAiAgentSlotNode[]
    input_guardrail_rules?: HtInputGuardrailRule[]
  }
}
