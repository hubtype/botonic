import { useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { getWebchatElement } from '../../util/dom'

export const useScrollToBottom = ({
  host,
  behavior = 'smooth',
  timeout = 200,
}) => {
  const {
    webchatState: { isWebchatOpen },
    scrollableMessagesListRef,
  } = useContext(WebchatContext)

  const scrollToBottom = () => {
    const webchatElement = getWebchatElement(host)
    if (!webchatElement) return
    if (!isWebchatOpen) return
    setTimeout(() => {
      scrollableMessagesListRef.current?.scrollTo({
        top: scrollableMessagesListRef.current?.scrollHeight,
        behavior: behavior as ScrollBehavior,
      })
    }, timeout)
  }

  return { scrollToBottom }
}
