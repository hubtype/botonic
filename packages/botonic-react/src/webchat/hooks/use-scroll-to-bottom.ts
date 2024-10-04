import {
  getScrollableMessagesListElement,
  getWebchatElement,
} from '../../util/dom'

export const useScrollToBottom = ({
  host,
  behavior = 'smooth',
  timeout = 200,
}) => {
  const scrollToBottom = () => {
    const webchatElement = getWebchatElement(host)
    if (!webchatElement) return
    const scrollableMessagesListElement = getScrollableMessagesListElement(host)
    if (!scrollableMessagesListElement) return

    setTimeout(() => {
      scrollableMessagesListElement.scrollTo({
        top: scrollableMessagesListElement.scrollHeight,
        behavior: behavior as ScrollBehavior,
      })
    }, timeout)
  }

  return { scrollToBottom }
}
