import { scrollToBottom } from '../../util/dom'
import { DEVICES } from '.'
import { ScrollbarController } from './scrollbar-controller'
import { WebchatResizer } from './webchat-resizer'

export class DeviceAdapter {
  init(host) {
    this.currentDevice = navigator.platform
    this.webchatResizer = new WebchatResizer(this.currentDevice, host)
    this.scrollbarController = new ScrollbarController(this.currentDevice, host)
    this.scrollbarController.handleScrollEvents()
  }

  onFocus(host) {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) {
      scrollToBottom({ host, timeout: 800 })
      return
    }
    this.webchatResizer.onFocus(() =>
      this.scrollbarController.handleOnTouchMoveEvents()
    )
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
