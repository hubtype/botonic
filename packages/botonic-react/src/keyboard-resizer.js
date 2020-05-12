import {
  getWebchatElement,
  setWebchatElementHeight,
  scrollToBottom,
  getScrollableArea,
} from './utils'

export class KeyboardResizer {
  constructor() {
    this.isIphone = this.isIphone()
  }

  isIphone() {
    // Detecting iOS solution, relying on navigator.platform: https://stackoverflow.com/a/9039885
    return !!navigator.platform && navigator.platform.includes('iPhone')
  }

  onFocus() {
    if (this.isIphone) {
      /*
        Based on Tip #4 from https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d,
        taking window.innerHeight as the amount of pixels the virtual keyboard adds
      */
      const waitUntilKeyboardIsShown = 400
      const calculateNewWebchatElementHeight = () => {
        const webchatHeight = getWebchatElement().clientHeight
        // Some iOS versions keep track of this height with VisualViewport API: https://stackoverflow.com/a/59056851
        const keyboardOffset =
          (window.visualViewport && window.visualViewport.height) ||
          window.innerHeight
        let newWebchatPercentualHeight = keyboardOffset / webchatHeight
        const toTwoDecimal = toRound => Math.round(toRound * 100) / 100
        newWebchatPercentualHeight =
          toTwoDecimal(newWebchatPercentualHeight) * 100
        return newWebchatPercentualHeight
      }
      setTimeout(() => {
        setWebchatElementHeight(`${calculateNewWebchatElementHeight()}%`)
        scrollToBottom()
      }, waitUntilKeyboardIsShown)
    }
  }

  onBlur() {
    if (this.isIphone) setWebchatElementHeight('100%')
  }

  limitScrollbarBoundaries() {
    if (this.isIphone) {
      const frame = getScrollableArea()
      const dStopAtScrollLimit = debounced(200, stopAtScrollLimit)
      if (frame) {
        if (window.addEventListener) {
          frame.addEventListener(
            'scroll',
            () => dStopAtScrollLimit(frame),
            true
          )
        } else if (window.attachEvent) {
          frame.attachEvent('scroll', () => dStopAtScrollLimit(frame))
        }
      }
    }
  }
  fontSize(defaultFontSize = 14) {
    // Disabling auto-zoom on input (iPhone devices): https://stackoverflow.com/a/25614477
    return this.isIphone ? 'initial' : defaultFontSize
  }
}

const debounced = (delay, fn) => {
  let timerId
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

const stopAtScrollLimit = element => {
  if (element.scrollTop === 0) element.scrollTop = 1
  if (element.scrollHeight - element.scrollTop === element.clientHeight)
    element.scrollTop -= 1
}
