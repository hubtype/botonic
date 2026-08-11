import type { Session as CoreSession } from '@botonic/core'
import { useCallback, useEffect, useRef } from 'react'
import {
  buildChatEventPayload,
  type TypingChatEvent,
  TypingNetworkSender,
} from './typing-network-sender'

export type TypingChatEventPayload = ReturnType<typeof buildChatEventPayload>

interface UseTypingChatEventSenderArgs {
  onUserInput?: (args: TypingChatEventPayload) => Promise<void>
  session: Partial<CoreSession>
  lastRoutePath?: string
}

export function useTypingChatEventSender({
  onUserInput,
  session,
  lastRoutePath,
}: UseTypingChatEventSenderArgs) {
  const contextRef = useRef({ onUserInput, session, lastRoutePath })
  const typingSenderRef = useRef<TypingNetworkSender | null>(null)

  contextRef.current = { onUserInput, session, lastRoutePath }

  if (!typingSenderRef.current) {
    typingSenderRef.current = new TypingNetworkSender(
      () => ({
        session: contextRef.current.session,
        lastRoutePath: contextRef.current.lastRoutePath,
      }),
      async (chatEvent, context) => {
        const handler = contextRef.current.onUserInput

        if (!handler) {
          return false
        }

        try {
          await handler(buildChatEventPayload(chatEvent, context))
          return true
        } catch {
          return false
        }
      }
    )
  }

  useEffect(() => {
    return () => {
      typingSenderRef.current?.dispose()
    }
  }, [])

  return useCallback(async (chatEvent: TypingChatEvent): Promise<boolean> => {
    return (await typingSenderRef.current?.send(chatEvent)) ?? false
  }, [])
}
