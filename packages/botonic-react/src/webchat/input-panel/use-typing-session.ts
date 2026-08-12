import { useCallback, useEffect, useRef } from 'react'

import { Typing } from '../../index-types'
import type { TypingChatEvent } from './typing-network-sender'

/** Local UI inactivity before the textarea stops emitting typing events. */
export const TYPING_IDLE_MS = 20 * 1000

type SendTypingEvent = (event: TypingChatEvent) => Promise<boolean>

/**
 * UI-layer typing session for the textarea.
 *
 * Decides *when* the user is typing and requests typing_on / typing_off.
 * Deduplication and network debouncing live in TypingNetworkSender instead.
 */
export function useTypingSession(sendChatEvent: SendTypingEvent) {
  const isTyping = useRef(false)
  // Bumps on each start/stop so stale async stopTyping() calls can be ignored.
  const startOrStopTypingCount = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Shares one in-flight typing_on while delivery is still pending.
  const pendingTypingOn = useRef<Promise<boolean> | null>(null)

  const stopTyping = useCallback(async () => {
    const countWhenStopWasRequested = ++startOrStopTypingCount.current

    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }

    // Wait for typing_on to settle before deciding whether to send typing_off.
    if (pendingTypingOn.current) {
      await pendingTypingOn.current
    }

    // Let same-turn input events (e.g. Enter then type next message) bump the counter first.
    await Promise.resolve()

    if (countWhenStopWasRequested !== startOrStopTypingCount.current) {
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

    if (pendingTypingOn.current) {
      return pendingTypingOn.current
    }

    pendingTypingOn.current = (async () => {
      try {
        const accepted = await sendChatEvent(Typing.On)

        // Only mark active after the network layer confirms delivery.
        if (accepted) {
          isTyping.current = true
        }

        return accepted
      } finally {
        pendingTypingOn.current = null
      }
    })()

    return pendingTypingOn.current
  }, [sendChatEvent])

  const onTextChange = useCallback(
    async (value: string) => {
      if (value === '') {
        await stopTyping()
        return
      }

      const countWhenUserTyped = ++startOrStopTypingCount.current
      await startTyping()

      if (countWhenUserTyped !== startOrStopTypingCount.current) {
        return
      }

      if (!isTyping.current) {
        return
      }

      // Reset the idle timer on every keystroke.
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
