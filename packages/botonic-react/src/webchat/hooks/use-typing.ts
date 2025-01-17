import { useEffect } from 'react'

import { WebchatMessage } from '../../index-types'
import { WebchatState } from '../context'

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
    let delayTimeout, typingTimeout
    try {
      const nextMsg = webchatState.messagesJSON.filter(m => !m.display)[0]
      if (nextMsg) {
        if (nextMsg.delay && nextMsg.typing) {
          delayTimeout = setTimeout(
            () => updateTyping(true),
            nextMsg.delay * 1000
          )
        } else if (nextMsg.typing) updateTyping(true)
        const totalDelay = nextMsg.delay + nextMsg.typing
        if (totalDelay)
          typingTimeout = setTimeout(() => {
            updateMessage({ ...nextMsg, display: true })
            updateTyping(false)
          }, totalDelay * 1000)
      }
    } catch (e) {}
    return () => {
      clearTimeout(delayTimeout)
      clearTimeout(typingTimeout)
    }
  }, [webchatState.messagesJSON, webchatState.typing])
}
