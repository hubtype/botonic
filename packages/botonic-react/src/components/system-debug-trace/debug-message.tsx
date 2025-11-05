import { EventAction } from '@botonic/core'
import React, { useRef, useState } from 'react'

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
  StyledDebugContentWrapper,
  StyledDebugHeader,
  StyledDebugIcon,
  StyledDebugTitle,
} from './styles'
import { DebugEvent, DebugEventConfig } from './types'
import { useLastLabelPosition } from './use-last-label-position'

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
  const wrapperRef = useRef<HTMLDivElement>(null)

  const eventConfig = getEventConfig(debugEvent)

  useLastLabelPosition({
    wrapperRef,
    isExpanded,
    debugEvent,
    isCollapsible: eventConfig?.collapsible ?? false,
  })

  if (!eventConfig) {
    return null
  }

  const { title, icon, component, collapsible } = eventConfig
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Component = component

  const handleClick = (e: React.MouseEvent) => {
    if (collapsible) {
      const target = e.target as HTMLElement
      const isButton = target.closest('button, a, [role="button"]')

      if (!isButton) {
        e.stopPropagation()
        setIsExpanded(!isExpanded)
      }
    }
  }

  const containerClassName = collapsible
    ? `collapsible${isExpanded ? ' expanded' : ''}`
    : ''

  return (
    <StyledDebugContainer
      className={containerClassName}
      onClick={collapsible ? handleClick : undefined}
    >
      <StyledDebugHeader>
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
          <StyledDebugContentWrapper ref={wrapperRef}>
            <Component {...debugEvent} messageId={messageId} />
          </StyledDebugContentWrapper>
        </StyledDebugContent>
      )}
    </StyledDebugContainer>
  )
}
