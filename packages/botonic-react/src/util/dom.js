export const getBotonicScrollableContent = () => {
  return document.getElementById('botonic-scrollable-content')
}

export const getScrollableArea = () => {
  const getArea = area => {
    const botonicScrollableContent = getBotonicScrollableContent()
    const scrollableArea =
      botonicScrollableContent &&
      botonicScrollableContent.getElementsByClassName(area)[0]
    return scrollableArea
  }
  return {
    full: getArea('simplebar-content'),
    visible: getArea('simplebar-content-wrapper'),
  }
}

export const scrollToBottom = ({ timeout = 200, behavior = 'smooth' } = {}) => {
  const frame = getScrollableArea().visible
  if (frame) {
    setTimeout(
      () => frame.scrollTo({ top: frame.scrollHeight, behavior: behavior }),
      timeout
    )
  }
}

export const getWebchatElement = () =>
  document.getElementById('botonic-webchat')

export const setWebchatElementHeight = newHeight => {
  getWebchatElement().style.height = newHeight
}
