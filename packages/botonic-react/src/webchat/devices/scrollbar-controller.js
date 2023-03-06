import {
  getScrollableArea,
  getScrollableContent,
  getWebchatElement,
} from '../../util/dom'
import { DEVICES, isMobileDevice } from '.'

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
  constructor(currentDevice, host) {
    this.currentDevice = currentDevice
    this.webchat = getWebchatElement(host)
  }

  handleScrollEvents() {
    /*
      It handles scroll events for Mobile/Desktop.
      "ontouchmove" is the phone equivalent for "onmouseover"
    */
    if (isMobileDevice()) {
      if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
      this.limitScrollBoundaries()
      this.webchat.ontouchstart = e => {
        this.handleOnTouchMoveEvents(e)
      }
      this.webchat.ontouchmove = e => {
        this.handleOnTouchMoveEvents(e)
      }
    } else {
      this.webchat.onmouseover = e => this.handleOnMouseOverEvents(e)
    }
  }

  hasScrollbar() {
    const scrollableArea = getScrollableArea(this.webchat)
    const isScrollable =
      scrollableArea.visible.clientHeight - scrollableArea.full.clientHeight < 0
    return isScrollable
  }

  handleOnMouseOverEvents(e) {
    let target = e.currentTarget
    while (target) {
      this.toggleOnMouseWheelEvents()
      target = target.parentNode
    }
  }

  toggleOnMouseWheelEvents() {
    const scrollableContent = getScrollableContent(this.webchat)
    if (this.hasScrollbar()) {
      scrollableContent.onmousewheel = {}
      return
    }
    scrollableContent.onmousewheel = e => e.preventDefault()
  }

  handleOnTouchMoveEvents(e) {
    this.toggleOnTouchMoveEvents()
  }

  toggleOnTouchMoveEvents() {
    if (this.hasScrollbar()) {
      this.webchat.ontouchmove = {}
      this.webchat.ontouchstart = {}
      return
    }
    this.webchat.ontouchmove = e => {
      if (e.target === e.currentTarget) e.preventDefault()
    }
  }

  limitScrollBoundaries() {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
    /*
      It adds a bounce effect when top or bottom limits of the scrollbar are reached for iOS,
      as an alternative of overscroll-behavior (https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
    */
    const frame = getScrollableArea(this.webchat).visible
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
