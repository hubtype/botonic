/* eslint-disable no-empty */
import { useEffect } from 'react'

import type { WebchatMessage } from '../../index-types'
import type { WebchatState } from '../context'

interface UseTyping {
  webchatState: WebchatState
  updateTyping: (typing: boolean) => void
  updateMessage: (message: WebchatMessage) => void
  host: any
}

export function useTyping({
  webchatState,
  updateTyping,
  updateMessage,
}: UseTyping): void {
  useEffect(() => {
    let delayTimeout: NodeJS.Timeout | null = null
    let typingTimeout: NodeJS.Timeout | null = null
    try {
      const nextMsg = webchatState.messagesJSON.filter(m => !m.display)[0]
      if (nextMsg) {
        if (nextMsg.delay && nextMsg.typing) {
          delayTimeout = setTimeout(
            () => updateTyping(true),
            nextMsg.delay * 1000
          )
        } else if (nextMsg.typing) {
          updateTyping(true)
        }
        const totalDelay = nextMsg.delay + nextMsg.typing
        if (totalDelay) {
          typingTimeout = setTimeout(() => {
            updateMessage({ ...nextMsg, display: true })
            updateTyping(false)
          }, totalDelay * 1000)
        }
      }
      // biome-ignore lint/suspicious/noEmptyBlockStatements: error is not used
    } catch (_e) {}
    return () => {
      delayTimeout && clearTimeout(delayTimeout)
      typingTimeout && clearTimeout(typingTimeout)
    }
  }, [webchatState.messagesJSON, webchatState.typing])
}
