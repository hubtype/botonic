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
import {
  FallbackDebugEvent,
  fallbackEventConfig,
  getFallbackEventConfig,
} from './fallback'
import { keywordEventConfig } from './keyword'
import { knowledgeBaseEventConfig } from './knowledge-base'

interface DebugEventConfig {
  action: string
  title: string | React.ReactNode
  component: React.ComponentType<any>
  icon?: React.ReactNode
  collapsible?: boolean
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
  collapsible = true,
}: {
  title: string | React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  collapsible?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!collapsible) {
    return (
      <StyledDebugEventContainer>
        <StyledDebugEventHeader style={{ cursor: 'default' }}>
          {icon && <StyledDebugEventIcon>{icon}</StyledDebugEventIcon>}
          <StyledDebugEventTitle>{title}</StyledDebugEventTitle>
        </StyledDebugEventHeader>
      </StyledDebugEventContainer>
    )
  }

  return (
    <StyledDebugEventContainer className={isExpanded ? 'expanded' : ''}>
      <StyledDebugEventHeader onClick={() => setIsExpanded(!isExpanded)}>
        {icon && <StyledDebugEventIcon>{icon}</StyledDebugEventIcon>}
        <StyledDebugEventTitle>{title}</StyledDebugEventTitle>
        <StyledDebugEventArrow>{isExpanded ? '▲' : '▼'}</StyledDebugEventArrow>
      </StyledDebugEventHeader>
      {isExpanded && children && (
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

  let eventConfig: DebugEventConfig | undefined =
    debugEventMap?.[action] || undefined

  // Handle fallback with dynamic title based on fallback_out
  if (action === EventAction.Fallback && 'fallback_out' in data) {
    eventConfig = getFallbackEventConfig(
      (data as FallbackDebugEvent).fallback_out
    )
  }

  console.log('eventConfig', eventConfig)

  if (!eventConfig) {
    return null
  }

  const DebugEventComponent = eventConfig.component

  return (
    <DebugEventContainer
      title={eventConfig.title}
      icon={eventConfig.icon}
      collapsible={eventConfig.collapsible}
    >
      {eventConfig.collapsible !== false && <DebugEventComponent {...data} />}
    </DebugEventContainer>
  )
}
