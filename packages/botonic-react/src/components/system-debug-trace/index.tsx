import { INPUT, isBrowser } from '@botonic/core'

import { ROLES } from '../../constants'
import { Message } from '../message'

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

interface NluKeywordDebugEvent {
  action: 'nlu_keyword'
  bot_version: string
  flow_id: string
  flow_node_id: string
  flow_thread_id: string
  format_version: number
  nlu_keyword_is_regex: boolean
  nlu_keyword_message_id: string
  nlu_keyword_name: string
  system_locale: string
  user_country: string
  user_input: string
  user_locale: string
}

// Union type for all debug event types - add more as needed
type DebugEvent = NluKeywordDebugEvent // | OtherDebugEvent | AnotherDebugEvent

const getContentForDebugEvent = (
  action: string,
  data: DebugEvent
): JSX.Element | null => {
  switch (action) {
    case 'nlu_keyword':
      return (
        <>
          <h1>NLU Keyword Debug Event</h1>
          <h2>User Input: {(data as NluKeywordDebugEvent).user_input}</h2>
          <h3>Keyword: {(data as NluKeywordDebugEvent).nlu_keyword_name}</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )
    default:
      return (
        <>
          <h1>Unknown Debug Event: {action}</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )
  }
}

export const SystemDebugTrace = (props: SystemDebugTraceProps) => {
  const { data } = props

  // Parse data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data
  const { action } = parsedData

  if (isBrowser()) {
    const content = getContentForDebugEvent(action, parsedData)

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
