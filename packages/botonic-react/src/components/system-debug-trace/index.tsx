import { INPUT, isBrowser } from '@botonic/core'

import { ROLES } from '../../constants'
import { Message } from '../message'
import { DebugMessage } from './debug-message'

interface SystemDebugTraceProps {
  type: string
  data: Record<string, any> | string
  id?: string
}

const serialize = (props: SystemDebugTraceProps) => {
  const { data } = props
  // Return the event data as an object, ensuring it's not stringified
  return typeof data === 'string' ? JSON.parse(data) : data
}

export const SystemDebugTrace = (props: SystemDebugTraceProps) => {
  const { data, id, ...otherProps } = props

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
        {...otherProps}
        type={INPUT.SYSTEM_DEBUG_TRACE}
        id={id}
      >
        <DebugMessage debugEvent={eventData} messageId={id} />
      </Message>
    )
  }
  return null
}

SystemDebugTrace.serialize = serialize
