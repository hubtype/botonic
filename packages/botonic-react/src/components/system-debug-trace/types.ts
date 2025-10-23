import React from 'react'

import { AiAgentDebugEvent } from './events/ai-agent'
import { FallbackDebugEvent } from './events/fallback'
import { KeywordDebugEvent } from './events/keyword'
import { KnowledgeBaseDebugEvent } from './events/knowledge-base'

export interface IconProps {
  color?: string
}

// Union type of all debug event types
export type DebugEvent =
  | KeywordDebugEvent
  | AiAgentDebugEvent
  | KnowledgeBaseDebugEvent
  | FallbackDebugEvent

export interface DebugEventConfig {
  action: string
  title: React.ReactNode
  component: React.ComponentType<any> | null
  icon?: React.ReactNode
  collapsible?: boolean
}
