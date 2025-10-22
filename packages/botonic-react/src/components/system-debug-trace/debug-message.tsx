import { EventAction } from '@botonic/core'
import React, { useState } from 'react'

import {
  aiAgentEventConfig,
  FallbackDebugEvent,
  fallbackEventConfig,
  getFallbackEventConfig,
  keywordEventConfig,
  knowledgeBaseEventConfig,
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
import { DebugEvent, DebugEventConfig, DebugEventKeys } from './types'

const debugEventMap: Record<DebugEventKeys, DebugEventConfig> = {
  [EventAction.Keyword]: keywordEventConfig,
  [EventAction.AiAgent]: aiAgentEventConfig,
  [EventAction.Knowledgebase]: knowledgeBaseEventConfig,
  [EventAction.Fallback]: fallbackEventConfig,
  // Add more events here as they are created:
}

export const DebugMessage = ({
  action,
  data,
}: {
  action: EventAction
  data: DebugEvent
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  let eventConfig: DebugEventConfig | undefined =
    debugEventMap?.[action] || undefined

  // Handle fallback with dynamic title based on fallback_out
  if (action === EventAction.Fallback && 'fallback_out' in data) {
    eventConfig = getFallbackEventConfig(
      (data as FallbackDebugEvent).fallback_out
    )
  }

  if (!eventConfig) {
    return null
  }

  const { title, icon, component: component, collapsible = true } = eventConfig
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Component = component

  const handleClick = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  const containerClassName = collapsible && isExpanded ? 'expanded' : ''

  return (
    <StyledDebugContainer className={containerClassName}>
      <StyledDebugHeader onClick={handleClick}>
        <StyledDebugIcon>{icon}</StyledDebugIcon>
        <StyledDebugTitle>{title}</StyledDebugTitle>
        {collapsible && (
          <StyledDebugArrow>
            {isExpanded ? (
              <CaretUpSvg color='#666a7a' />
            ) : (
              <CaretDownSvg color='#666a7a' />
            )}
          </StyledDebugArrow>
        )}
      </StyledDebugHeader>
      {isExpanded && Component && (
        <StyledDebugContent>
          <Component {...data} />
        </StyledDebugContent>
      )}
    </StyledDebugContainer>
  )
}
