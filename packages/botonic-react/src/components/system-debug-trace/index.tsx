import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'

import { ROLES } from '../../constants'
import { Message } from '../message'
import { getDebugEventComponent } from './events/factory'
import { DebugEvent } from './types'

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

  console.log('parsedData', parsedData)
  console.log('isBrowser', isBrowser())

  if (isBrowser()) {
    const content = getDebugEventComponent(parsedData.action, parsedData)

    console.log('content', content)

    return (
      <Message
        role={ROLES.SYSTEM_DEBUG_TRACE_MESSAGE}
        json={serialize(props)}
        {...props}
        type={INPUT.SYSTEM_DEBUG_TRACE}
      >
        {content}
      </Message>
    )
  }
  return null
}

SystemDebugTrace.serialize = serialize
