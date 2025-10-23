import React from 'react'

import {
  AiAgentDebugEvent,
  FallbackDebugEvent,
  HandoffSuccessDebugEvent,
  KeywordDebugEvent,
  KnowledgeBaseDebugEvent,
  SmartIntentDebugEvent,
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

export interface DebugEventConfig {
  action: string
  title: React.ReactNode
  component: React.ComponentType<any> | null
  icon?: React.ReactNode
  collapsible?: boolean
}
