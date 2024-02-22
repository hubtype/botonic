import { scrollToBottom } from '../../util/dom'
import { DEVICES } from '.'
import { ScrollbarController } from './scrollbar-controller'
import { WebchatResizer } from './webchat-resizer'

export class DeviceAdapter {
  constructor() {
    this.currentDevice = this.getCurrentDevice()
  }

  init(host) {
    this.webchatResizer = new WebchatResizer(this.currentDevice, host)
    this.scrollbarController = new ScrollbarController(this.currentDevice, host)
    this.scrollbarController.handleScrollEvents()
  }

  getCurrentDevice() {
    // navigator.platform deprecated. Ref: (https://erikmartinjordan.com/navigator-platform-deprecated-alternative)
    if (navigator.userAgentData) return navigator.userAgentData.platform
    return navigator.platform
  }

  onFocus(host) {
    setTimeout(() => {
      // Place onFocus logic to be run the last on the queue of asynchronous events to give enough time to init method to be called. Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#zero_delays
      this.webchatResizer?.onFocus(() =>
        this.scrollbarController.handleOnTouchMoveEvents()
      )
    }, 0)
  }

  onBlur() {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
    this.webchatResizer.onBlur()
    this.scrollbarController.handleOnTouchMoveEvents()
  }

  fontSize(defaultFontSize = 14) {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return defaultFontSize
    // Disabling auto-zoom on input (iPhone devices): https://stackoverflow.com/a/25614477, https://stackoverflow.com/a/6394497
    return 'initial'
  }
}
