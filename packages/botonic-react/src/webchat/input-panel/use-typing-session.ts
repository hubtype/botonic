import { useCallback, useEffect, useRef } from 'react'

import { Typing } from '../../index-types'
import type { TypingChatEvent } from './typing-network-sender'

/** Local UI inactivity before the textarea stops emitting typing events. */
export const TYPING_IDLE_MS = 20 * 1000

type SendTypingEvent = (event: TypingChatEvent) => Promise<boolean>

/**
 * Tracks whether the end user is typing in the input and emits
 * typing_on / typing_off through sendChatEvent.
 */
export function useTypingSession(sendChatEvent: SendTypingEvent) {
  const isTyping = useRef(false)
  const typingEpoch = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTypingPromise = useRef<Promise<boolean> | null>(null)

  const stopTyping = useCallback(async () => {
    const stopEpoch = ++typingEpoch.current

    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }

    if (startTypingPromise.current) {
      await startTypingPromise.current
    }

    await Promise.resolve()

    if (stopEpoch !== typingEpoch.current) {
      return
    }

    if (!isTyping.current) {
      return
    }

    isTyping.current = false
    await sendChatEvent(Typing.Off)
  }, [sendChatEvent])

  const startTyping = useCallback(async () => {
    if (isTyping.current) {
      return true
    }

    if (startTypingPromise.current) {
      return startTypingPromise.current
    }

    startTypingPromise.current = (async () => {
      try {
        const accepted = await sendChatEvent(Typing.On)

        if (accepted) {
          isTyping.current = true
        }

        return accepted
      } finally {
        startTypingPromise.current = null
      }
    })()

    return startTypingPromise.current
  }, [sendChatEvent])

  const onTextChange = useCallback(
    async (value: string) => {
      if (value === '') {
        await stopTyping()
        return
      }

      const epoch = ++typingEpoch.current
      await startTyping()

      if (epoch !== typingEpoch.current) {
        return
      }

      if (!isTyping.current) {
        return
      }

      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }

      idleTimer.current = setTimeout(() => {
        void stopTyping()
      }, TYPING_IDLE_MS)
    },
    [startTyping, stopTyping]
  )

  const stopTypingRef = useRef(stopTyping)
  stopTypingRef.current = stopTyping

  useEffect(() => {
    return () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }

      void stopTypingRef.current()
    }
  }, [])

  return { stopTyping, onTextChange }
}
