import { WEBCHAT } from '../constants'

export const getScrollableContent = webchatElement => {
  return webchatElement.querySelector(WEBCHAT.SELECTORS.SCROLLABLE_CONTENT)
}

export const getScrollableArea = webchatElement => {
  const getArea = area => {
    const botonicScrollableContent = getScrollableContent(webchatElement)
    const scrollableArea =
      botonicScrollableContent && botonicScrollableContent.querySelector(area)
    return scrollableArea
  }
  return {
    full: getArea(WEBCHAT.SELECTORS.SIMPLEBAR_CONTENT),
    visible: getArea(WEBCHAT.SELECTORS.SIMPLEBAR_WRAPPER),
  }
}

export const scrollToBottom = ({
  timeout = 200,
  behavior = 'smooth',
  host,
} = {}) => {
  const webchatElement = getWebchatElement(host)
  if (!webchatElement) return
  const frame = getScrollableArea(webchatElement).visible
  if (frame) {
    setTimeout(
      () => frame.scrollTo({ top: frame.scrollHeight, behavior: behavior }),
      timeout
    )
  }
}

export const getWebchatElement = host =>
  host && host.querySelector(`#${WEBCHAT.DEFAULTS.ID}`)

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
