import { INPUT, isBrowser } from '@botonic/core'
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

export const SystemDebugTrace = (props: SystemDebugTraceProps) => {
  const { data } = props

  // Parse data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data

  if (isBrowser()) {
    const eventData = {
      ...parsedData,
    }

    return (
      <Message
        role={ROLES.SYSTEM_DEBUG_TRACE_MESSAGE}
        json={serialize(props)}
        {...props}
        type={INPUT.SYSTEM_DEBUG_TRACE}
      >
        <DebugMessage debugEvent={eventData} />
      </Message>
    )
  }
  return null
}

SystemDebugTrace.serialize = serialize
