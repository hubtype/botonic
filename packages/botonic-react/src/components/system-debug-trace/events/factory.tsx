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
import { nluKeywordEventConfig } from './nlu-keyword'

interface DebugEventConfig {
  action: string
  title: string
  component: React.ComponentType<any>
  icon?: React.ReactNode
}

const debugEventRegistry: Map<EventAction, DebugEventConfig> = new Map([
  [EventAction.Keyword, nluKeywordEventConfig],
  // Add more events here as they are created:
])

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
  const eventConfig = debugEventRegistry.get(action)

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
