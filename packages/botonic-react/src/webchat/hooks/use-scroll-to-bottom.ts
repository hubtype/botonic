import {
  getScrollableMessagesListElement,
  getWebchatElement,
} from '../../util/dom'

interface UseScrollToBottom {
  host: any
  behavior?: ScrollBehavior
  timeout?: number
}

export const useScrollToBottom = ({
  host,
  behavior = 'smooth',
  timeout = 200,
}: UseScrollToBottom) => {
  const scrollToBottom = () => {
    const webchatElement = getWebchatElement(host)
    if (!webchatElement) return
    const scrollableMessagesListElement = getScrollableMessagesListElement(host)
    if (!scrollableMessagesListElement) return

    setTimeout(() => {
      scrollableMessagesListElement.scrollTo({
        top: scrollableMessagesListElement.scrollHeight,
        behavior: behavior,
      })
    }, timeout)
  }

  return { scrollToBottom }
}
