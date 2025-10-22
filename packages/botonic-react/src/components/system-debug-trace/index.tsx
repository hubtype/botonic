import { EventAction, INPUT, isBrowser } from '@botonic/core'
import React from 'react'

import { ROLES } from '../../constants'
import { Message } from '../message'
import { DebugMessage } from './debug-message'

interface SystemDebugTraceProps {
  type: string
  data: Record<string, any> | string
}

const serialize = (props: SystemDebugTraceProps) => {
  const { type, data } = props
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data
  // Flatten the structure - merge type and all data fields at the same level
  return {
    type,
    ...parsedData,
  }
}

// Map backend action strings to EventAction enum
const mapEventAction = (action: string): EventAction | undefined => {
  const mapping: Record<string, EventAction> = {
    nlu_keyword: EventAction.Keyword,
    ai_agent: EventAction.AiAgent,
    knowledgebase: EventAction.Knowledgebase,
    fallback: EventAction.Fallback,
  }
  return mapping[action]
}

export const SystemDebugTrace = (props: SystemDebugTraceProps) => {
  const { data } = props

  // Parse data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data

  if (isBrowser()) {
    const eventAction = mapEventAction(parsedData.action)

    if (!eventAction) {
      console.warn('Unknown action:', parsedData.action)
      return null
    }

    const eventData = {
      ...parsedData,
      action: eventAction,
    }

    return (
      <Message
        role={ROLES.SYSTEM_DEBUG_TRACE_MESSAGE}
        json={serialize(props)}
        {...props}
        type={INPUT.SYSTEM_DEBUG_TRACE}
      >
        <DebugMessage action={eventAction} data={eventData} />
      </Message>
    )
  }
  return null
}

SystemDebugTrace.serialize = serialize
