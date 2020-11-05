import { DEVICES, isMobileDevice } from '.'
import { getWebchatElement, getScrollableArea } from '../../util/dom'

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

export class ScrollbarController {
  constructor(currentDevice) {
    this.currentDevice = currentDevice
  }

  handleScrollEvents() {
    /*
      It handles scroll events for Mobile/Desktop. 
      "ontouchmove" is the phone equivalent for "onmouseover"
    */
    const webchat = getWebchatElement()
    if (isMobileDevice()) {
      if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
      this.limitScrollBoundaries()
      webchat.ontouchmove = e => this.handleOnTouchMoveEvents(e)
    } else {
      webchat.onmouseover = e => this.handleOnMouseOverEvents(e)
    }
  }

  hasScrollbar() {
    const scrollableArea = getScrollableArea()
    const isScrollable =
      scrollableArea.visible.clientHeight - scrollableArea.full.clientHeight < 0
    if (isScrollable) return true
    return false
  }

  handleOnMouseOverEvents(e) {
    let target = e.currentTarget
    while (target) {
      this.toggleOnMouseWheelEvents()
      target = target.parentNode
    }
  }

  toggleOnMouseWheelEvents() {
    const webchat = getWebchatElement()
    if (this.hasScrollbar()) {
      webchat.onmousewheel = {}
      return
    }
    webchat.onmousewheel = e => e.preventDefault()
  }

  handleOnTouchMoveEvents(e) {
    this.toggleOnTouchMoveEvents()
  }

  toggleOnTouchMoveEvents() {
    const webchat = getWebchatElement()
    if (this.hasScrollbar()) {
      webchat.ontouchmove = {}
      return
    }
    webchat.ontouchmove = e => e.preventDefault()
  }

  limitScrollBoundaries() {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
    /*
      It adds a bounce effect when top or bottom limits of the scrollbar are reached for iOS,
      as an alternative of overscroll-behavior (https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
    */
    const frame = getScrollableArea().visible
    const dStopAtScrollLimit = debounced(100, stopAtScrollLimit)
    if (frame) {
      if (window.addEventListener) {
        frame.addEventListener('scroll', () => dStopAtScrollLimit(frame), true)
      } else if (window.attachEvent) {
        frame.attachEvent('scroll', () => dStopAtScrollLimit(frame))
      }
    }
  }
}
