export const getScrollableArea = webchatElement => {
  const getArea = area => {
    const botonicScrollableContent = webchatElement.querySelector(
      '#botonic-scrollable-content'
    )
    const scrollableArea =
      botonicScrollableContent && botonicScrollableContent.querySelector(area)
    return scrollableArea
  }
  return {
    full: getArea('.simplebar-content'),
    visible: getArea('.simplebar-content-wrapper'),
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
  host && host.querySelector('#botonic-webchat')

// https://stackoverflow.com/questions/9457891/how-to-detect-if-domcontentloaded-was-fired
export const onDOMLoaded = f => {
  if (/complete|interactive|loaded/.test(document.readyState)) {
    // In case the document has finished parsing, document's readyState will
    // be one of "complete", "interactive" or (non-standard) "loaded".
    f()
  } else {
    // The document is not ready yet, so wait for the DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', f, false)
  }
}
