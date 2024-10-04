import { BotonicContainerId } from '../webchat/constants'

export const getWebchatElement = host =>
  host && host.querySelector(`#${BotonicContainerId.Webchat}`)

export const getScrollableMessagesListElement = host =>
  host && host.querySelector(`#${BotonicContainerId.ScrollableMessagesList}`)

// https://stackoverflow.com/questions/9457891/how-to-detect-if-domcontentloaded-was-fired
export const onDOMLoaded = callback => {
  if (/complete|interactive|loaded/.test(document.readyState)) {
    // In case the document has finished parsing, document's readyState will
    // be one of "complete", "interactive" or (non-standard) "loaded".
    callback()
  } else {
    // The document is not ready yet, so wait for the DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', callback, false)
  }
}

export const isShadowDOMSupported = () => {
  try {
    return document.head.createShadowRoot || document.head.attachShadow
  } catch (e) {
    return false
  }
}
