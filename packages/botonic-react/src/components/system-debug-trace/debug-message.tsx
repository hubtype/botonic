import { EventAction } from '@botonic/core'
import React, { useState } from 'react'

import {
  getAiAgentEventConfig,
  getFallbackEventConfig,
  getHandoffSuccessEventConfig,
  getKeywordEventConfig,
  getKnowledgeBaseEventConfig,
  getSmartIntentEventConfig,
} from './events'
import { CaretDownSvg, CaretUpSvg } from './icons'
import {
  StyledDebugArrow,
  StyledDebugContainer,
  StyledDebugContent,
  StyledDebugHeader,
  StyledDebugIcon,
  StyledDebugTitle,
} from './styles'
import { DebugEvent, DebugEventConfig } from './types'

const getEventConfig = (
  debugEvent: DebugEvent
): DebugEventConfig | undefined => {
  switch (debugEvent.action) {
    case EventAction.Keyword:
      return getKeywordEventConfig(debugEvent)
    case EventAction.IntentSmart:
      return getSmartIntentEventConfig(debugEvent)
    case EventAction.HandoffSuccess:
      return getHandoffSuccessEventConfig(debugEvent)
    case EventAction.AiAgent:
      return getAiAgentEventConfig(debugEvent)
    case EventAction.Knowledgebase:
      return getKnowledgeBaseEventConfig(debugEvent)
    case EventAction.Fallback:
      return getFallbackEventConfig(debugEvent)
    default:
      return undefined
  }
}

interface DebugMessageProps {
  debugEvent: DebugEvent
  messageId?: string
}

export const DebugMessage = ({ debugEvent, messageId }: DebugMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const eventConfig = getEventConfig(debugEvent)

  if (!eventConfig) {
    return null
  }

  const { title, icon, component, collapsible } = eventConfig
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Component = component

  const handleClick = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  let containerClassName = collapsible ? 'collapsible' : ''
  containerClassName += collapsible && isExpanded ? ' expanded' : ''

  return (
    <StyledDebugContainer className={containerClassName}>
      <StyledDebugHeader onClick={handleClick}>
        <StyledDebugIcon>{icon}</StyledDebugIcon>
        <StyledDebugTitle>{title}</StyledDebugTitle>
        {collapsible && (
          <StyledDebugArrow>
            {isExpanded ? <CaretUpSvg /> : <CaretDownSvg />}
          </StyledDebugArrow>
        )}
      </StyledDebugHeader>
      {Component && (
        <StyledDebugContent style={{ display: isExpanded ? 'block' : 'none' }}>
          <Component {...debugEvent} messageId={messageId} />
        </StyledDebugContent>
      )}
    </StyledDebugContainer>
  )
}
