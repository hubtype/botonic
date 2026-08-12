import type { PreviewUtils } from '../../../../index-types'
import type { AiAgentDebugEvent } from './types'

const rehydratedEventsCache = new Map<string, AiAgentDebugEvent>()
const rehydrationInFlight = new Map<string, Promise<AiAgentDebugEvent | null>>()

export const clearRehydrationCacheForTests = () => {
  rehydratedEventsCache.clear()
  rehydrationInFlight.clear()
}

export const getCachedRehydratedEvent = (
  hubtypeMessageId: string
): AiAgentDebugEvent | undefined => rehydratedEventsCache.get(hubtypeMessageId)

export const rehydrateTruncatedEvent = async (
  props: AiAgentDebugEvent,
  previewUtils: PreviewUtils,
  hubtypeMessageId: string
): Promise<AiAgentDebugEvent | null> => {
  const message = await previewUtils.getMessageById(hubtypeMessageId, {
    includeDebugEvents: true,
  })

  if (!message?.event_data) {
    return null
  }

  const eventData = message.event_data as Partial<AiAgentDebugEvent>

  return {
    ...props,
    ...eventData,
    action: props.action,
    messageId: props.messageId,
    truncated: false,
  }
}

export const getOrStartRehydration = (
  props: AiAgentDebugEvent,
  previewUtils: PreviewUtils,
  hubtypeMessageId: string
): Promise<AiAgentDebugEvent | null> => {
  const cached = rehydratedEventsCache.get(hubtypeMessageId)
  if (cached) {
    return Promise.resolve(cached)
  }

  const inFlight = rehydrationInFlight.get(hubtypeMessageId)
  if (inFlight) {
    return inFlight
  }

  const promise = rehydrateTruncatedEvent(props, previewUtils, hubtypeMessageId)
    .then(mergedEvent => {
      if (mergedEvent) {
        rehydratedEventsCache.set(hubtypeMessageId, mergedEvent)
      }
      rehydrationInFlight.delete(hubtypeMessageId)
      return mergedEvent
    })
    .catch(error => {
      rehydrationInFlight.delete(hubtypeMessageId)
      throw error
    })

  rehydrationInFlight.set(hubtypeMessageId, promise)
  return promise
}
