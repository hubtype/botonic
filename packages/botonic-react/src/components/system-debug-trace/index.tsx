import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'

import { ROLES } from '../../constants'
import { Message } from '../message'

interface SystemDebugTraceProps {
  type: string
  data: Record<string, any>
}

const serialize = (props: SystemDebugTraceProps) => {
  const { type, data } = props
  return {
    type,
    data: JSON.parse(JSON.stringify(data)),
  }
}

export const SystemDebugTrace = (props: SystemDebugTraceProps) => {
  const { type, data } = props
  const { action, ...rest } = data

  if (isBrowser()) {
    const content = (
      <div>
        type: {type}
        action: {action}
        json: {JSON.stringify(rest)}
      </div>
    )

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
