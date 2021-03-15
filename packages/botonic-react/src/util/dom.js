import { WEBCHAT } from '../constants'

export const getScrollableArea = webchatElement => {
  const getArea = area => {
    const botonicScrollableContent = webchatElement.querySelector(
      WEBCHAT.SELECTORS.SCROLLABLE_CONTENT
    )
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

export const BROWSER = Object.freeze({
  CHROME: 'chrome',
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox', // Firefox 1.0+
  SAFARI: 'safari', // Safari 3.0+
  IE: 'ie', // Internet Explorer 6-11
  EDGE: 'edge', // Edge 20+
  OPERA: 'opera', // Opera 8.0+
  OTHER: 'other',
})

export function getBrowser(userAgent) {
  // as per https://stackoverflow.com/a/9851769/145289
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
  // Order of ifs is important
  if (
    // eslint-disable-next-line no-undef
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0
  ) {
    return BROWSER.OPERA
  }
  if (typeof InstallTrigger !== 'undefined') {
    return BROWSER.FIREFOX
  }

  if (
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === '[object SafariRemoteNotification]'
    })(
      !window['safari'] ||
        // eslint-disable-next-line no-undef
        (typeof safari !== 'undefined' && safari.pushNotification)
    )
  ) {
    return BROWSER.SAFARI
  }

  if (/*@cc_on!@*/ false || !!document.documentMode) {
    return BROWSER.IE
  }

  if (window.StyleMedia) {
    return BROWSER.EDGE
  }

  if (
    !!window.chrome &&
    (!!window.chrome.webstore || !!window.chrome.runtime)
  ) {
    if (navigator.userAgent.indexOf('Edg') != -1) {
      return BROWSER.EDGE
    }
    return BROWSER.CHROME
  }

  return BROWSER.OTHER
}
