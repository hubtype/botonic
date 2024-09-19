import { getWebchatElement } from '../../util/dom'
import { BotonicContainerId } from '../constants'

export const useScrollToBottom = ({
  host,
  behavior = 'smooth',
  timeout = 200,
}) => {
  const scrollToBottom = () => {
    const webchatElement = getWebchatElement(host)
    if (!webchatElement) return
    const scrollableMessagesList = document.getElementById(
      BotonicContainerId.ScrollableMessagesList
    )

    setTimeout(() => {
      scrollableMessagesList?.scrollTo({
        top: scrollableMessagesList?.scrollHeight,
        behavior: behavior as ScrollBehavior,
      })
    }, timeout)
  }

  return { scrollToBottom }
}
