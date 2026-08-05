import { useRef, useState } from 'react'

import type { PreviewUtils } from '../../../../index-types'
import {
  getCachedRehydratedEvent,
  getOrStartRehydration,
} from './rehydrate-ai-agent-event'
import type { AiAgentDebugEvent } from './types'

interface UseRehydratedAiAgentEventResult {
  resolvedEvent: AiAgentDebugEvent
  isRehydrating: boolean
}

export const useRehydratedAiAgentEvent = (
  props: AiAgentDebugEvent,
  previewUtils?: PreviewUtils
): UseRehydratedAiAgentEventResult => {
  const hubtypeMessageId = props.hubtype_message_id
  const needsRehydration = Boolean(
    props.truncated && hubtypeMessageId && previewUtils
  )

  const cachedEvent =
    hubtypeMessageId && needsRehydration
      ? getCachedRehydratedEvent(hubtypeMessageId)
      : undefined

  const [resolvedEvent, setResolvedEvent] = useState<AiAgentDebugEvent>(
    () => cachedEvent ?? props
  )
  const [isRehydrating, setIsRehydrating] = useState(
    () => needsRehydration && !cachedEvent
  )

  const fetchStartedRef = useRef(false)

  if (!needsRehydration) {
    return { resolvedEvent: props, isRehydrating: false }
  }

  if (!cachedEvent && !fetchStartedRef.current && hubtypeMessageId && previewUtils) {
    fetchStartedRef.current = true

    getOrStartRehydration(props, previewUtils, hubtypeMessageId)
      .then(mergedEvent => {
        if (mergedEvent) {
          setResolvedEvent(mergedEvent)
        }
        setIsRehydrating(false)
      })
      .catch(error => {
        console.error('Error rehydrating truncated AI agent event:', error)
        setIsRehydrating(false)
      })
  }

  return {
    resolvedEvent: cachedEvent ?? resolvedEvent,
    isRehydrating: cachedEvent ? false : isRehydrating,
  }
}
