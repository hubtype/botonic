import { EventAction } from '@botonic/core'
import React, { useEffect, useRef, useState } from 'react'

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

  if (!eventConfig) {
    return null
  }

  const { title, icon, component, collapsible } = eventConfig
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Component = component

  const handleClick = (e: React.MouseEvent) => {
    if (collapsible) {
      // Check if click came from a button or interactive element
      const target = e.target as HTMLElement
      const isButton = target.closest('button, a, [role="button"]')
      
      // Only toggle if not clicking on a button
      if (!isButton) {
        e.stopPropagation() // Prevent bubbling when clicking header
        setIsExpanded(!isExpanded)
      }
    }
  }

  // Measure last label position and set CSS variable for line height
  useEffect(() => {
    if (!isExpanded || !wrapperRef.current) {
      if (wrapperRef.current) {
        wrapperRef.current.style.setProperty('--last-label-bottom', '0px')
      }
      return
    }

    const measure = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      // Check if visible
      const parent = wrapper.parentElement
      if (parent && window.getComputedStyle(parent).display === 'none') {
        return
      }

      // Find last container and its label
      const children = Array.from(wrapper.children) as HTMLElement[]
      const lastContainer = children[children.length - 1]
      if (!lastContainer) return

      const lastLabel = lastContainer.querySelector('strong, span[class*="GuardrailLabel"]') as HTMLElement | null
      if (!lastLabel) return

      // Calculate distance from wrapper top to label bottom
      const wrapperTop = wrapper.getBoundingClientRect().top
      const labelBottom = lastLabel.getBoundingClientRect().bottom
      const labelBottomPosition = labelBottom - wrapperTop

      // Set CSS variable for line height calculation
      wrapper.style.setProperty('--last-label-bottom', `${labelBottomPosition}px`)
    }

    // Measure after render
    const timeoutId = setTimeout(measure, 0)
    const resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(measure)
      : null

    if (resizeObserver && wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      resizeObserver?.disconnect()
    }
  }, [isExpanded, debugEvent])

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
