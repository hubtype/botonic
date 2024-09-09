import { getWebchatElement, scrollToBottom } from '../../util/dom'
import { BotonicContainerId } from '../constants'
import { DEVICES } from '.'

export class WebchatResizer {
  constructor(currentDevice, host) {
    this.currentDevice = currentDevice
    this.host = host
    this.webchat = getWebchatElement(host)
    this.chatArea = document.getElementById(BotonicContainerId.ChatArea)
    this.originalChatAreaHeight = 0
  }

  onFocus(onKeyboardShownFn) {
    if (!this.originalChatAreaHeight) {
      this.originalChatAreaHeight = this.chatArea.clientHeight
    }
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
    /*
      Based on Tip #4 from https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d,
      taking window.innerHeight as the amount of pixels the virtual keyboard adds
    */
    const waitUntilKeyboardIsShown = 400
    const calculateNewWebchatElementHeight = () => {
      const webchatHeight = this.webchat.clientHeight
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
      const newWebchatPercentualHeight = calculateNewWebchatElementHeight()
      this.setWebchatElementHeight(`${newWebchatPercentualHeight}%`)
      const webchatHeight = this.webchat.clientHeight
      const headerHeight = document.getElementById(
        BotonicContainerId.Header
      )?.clientHeight
      const inputPanelHeight = document.getElementById(
        BotonicContainerId.InputPanel
      )?.clientHeight
      if (webchatHeight && headerHeight && inputPanelHeight) {
        this.setChatAreaHeight(
          `${webchatHeight - headerHeight - inputPanelHeight}px`
        )
      }
      // scrollToBottom(this.host)
      onKeyboardShownFn()
    }, waitUntilKeyboardIsShown)
  }

  onBlur() {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
    this.setWebchatElementHeight('100%')
    this.setChatAreaHeight(`${this.originalChatAreaHeight}px`)
  }

  setChatAreaHeight(newHeight) {
    this.chatArea.style.height = newHeight
  }

  setWebchatElementHeight(newHeight) {
    this.webchat.style.height = newHeight
  }
}
