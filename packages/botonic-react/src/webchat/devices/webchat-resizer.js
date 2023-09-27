import { getWebchatElement, scrollToBottom } from '../../util/dom'
import { DEVICES } from '.'

export class WebchatResizer {
  constructor(currentDevice, host) {
    this.currentDevice = currentDevice
    this.host = host
    this.webchat = getWebchatElement(host)
  }

  onFocus(onKeyboardShownFn) {
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
      this.setWebchatElementHeight(`${calculateNewWebchatElementHeight()}%`)
      // scrollToBottom(this.host)
      onKeyboardShownFn()
    }, waitUntilKeyboardIsShown)
  }

  onBlur() {
    if (this.currentDevice !== DEVICES.MOBILE.IPHONE) return
    this.setWebchatElementHeight('100%')
  }

  setWebchatElementHeight(newHeight) {
    this.webchat.style.height = newHeight
  }
}
