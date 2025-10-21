import { EventAction } from '@botonic/core'
import React, { useState } from 'react'

import {
  StyledDebugEventArrow,
  StyledDebugEventContainer,
  StyledDebugEventContent,
  StyledDebugEventHeader,
  StyledDebugEventIcon,
  StyledDebugEventTitle,
} from '../styles'
import { DebugEvent } from '../types'
import { aiAgentEventConfig } from './ai-agent'
import { fallbackEventConfig } from './fallback'
import { keywordEventConfig } from './keyword'
import { knowledgeBaseEventConfig } from './knowledge-base'

interface DebugEventConfig {
  action: string
  title: string
  component: React.ComponentType<any>
  icon?: React.ReactNode
}

type DebugEventKeys =
  | EventAction.Keyword
  | EventAction.AiAgent
  | EventAction.Knowledgebase
  | EventAction.Fallback

const debugEventMap: Record<DebugEventKeys, DebugEventConfig> = {
  [EventAction.Keyword]: keywordEventConfig,
  [EventAction.AiAgent]: aiAgentEventConfig,
  [EventAction.Knowledgebase]: knowledgeBaseEventConfig,
  [EventAction.Fallback]: fallbackEventConfig,
  // Add more events here as they are created:
}

const DebugEventContainer = ({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <StyledDebugEventContainer>
      <StyledDebugEventHeader onClick={() => setIsExpanded(!isExpanded)}>
        {icon && <StyledDebugEventIcon>{icon}</StyledDebugEventIcon>}
        <StyledDebugEventTitle>{title}</StyledDebugEventTitle>
        <StyledDebugEventArrow>{isExpanded ? '▲' : '▼'}</StyledDebugEventArrow>
      </StyledDebugEventHeader>
      {isExpanded && (
        <StyledDebugEventContent>{children}</StyledDebugEventContent>
      )}
    </StyledDebugEventContainer>
  )
}

export const getDebugEventComponent = (
  action: EventAction,
  data: DebugEvent
): React.ReactNode | null => {
  console.log('getDebugEventComponent')
  console.log('action', action)
  console.log('data', data)

  const eventConfig: DebugEventConfig | undefined =
    debugEventMap?.[action] || undefined

  console.log('eventConfig', eventConfig)

  if (!eventConfig) {
    return null
  }

  const DebugEventComponent = eventConfig.component

  return (
    <DebugEventContainer title={eventConfig.title} icon={eventConfig.icon}>
      <DebugEventComponent {...data} />
    </DebugEventContainer>
  )
}
