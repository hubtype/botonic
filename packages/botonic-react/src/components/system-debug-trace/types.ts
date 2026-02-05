import type React from 'react'

import type {
  AiAgentDebugEvent,
  BotActionDebugEvent,
  ConditionalChannelDebugEvent,
  ConditionalCountryDebugEvent,
  ConditionalCustomDebugEvent,
  ConditionalQueueStatusDebugEvent,
  FallbackDebugEvent,
  HandoffSuccessDebugEvent,
  KeywordDebugEvent,
  KnowledgeBaseDebugEvent,
  RedirectFlowDebugEvent,
  SmartIntentDebugEvent,
  WebviewActionTriggeredDebugEvent,
} from './events'

export interface IconProps {
  color?: string
}

// Union type of all debug event types
export type DebugEvent =
  | KeywordDebugEvent
  | AiAgentDebugEvent
  | KnowledgeBaseDebugEvent
  | FallbackDebugEvent
  | SmartIntentDebugEvent
  | HandoffSuccessDebugEvent
  | BotActionDebugEvent
  | ConditionalChannelDebugEvent
  | ConditionalCountryDebugEvent
  | ConditionalCustomDebugEvent
  | ConditionalQueueStatusDebugEvent
  | RedirectFlowDebugEvent
  | WebviewActionTriggeredDebugEvent

export interface DebugEventConfig {
  action: string
  title: React.ReactNode
  component: React.ComponentType<any> | null
  icon?: React.ReactNode
  collapsible?: boolean
}
