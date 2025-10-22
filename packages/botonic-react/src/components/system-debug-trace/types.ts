import { EventAction } from '@botonic/core'
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
  title: string | React.ReactNode
  component: React.ComponentType<any>
  icon?: React.ReactNode
  collapsible?: boolean
}

export type DebugEventKeys =
  | EventAction.Keyword
  | EventAction.AiAgent
  | EventAction.Knowledgebase
  | EventAction.Fallback
