import { WEBCHAT } from './constants'
import { isBrowser, isNode } from '@botonic/core'
export function isDev() {
  return process.env.NODE_ENV == 'development'
}

export function isProd() {
  return process.env.NODE_ENV == 'production'
}

export const staticAsset = path => {
  try {
    const scriptBaseURL = document
      .querySelector('script[src$="webchat.botonic.js"]')
      .getAttribute('src')
    const scriptName = scriptBaseURL.split('/').pop()
    const basePath = scriptBaseURL.replace('/' + scriptName, '/')
    return basePath + path
  } catch (e) {
    return path
  }
}

/**
 * given an object and a property, returns the property if exists (recursively), else undefined
 * ex:
 * let obj = { a: { b: { c: 5 } } }
 * getProperty(obj, 'a.b.c'), returns 5
 * getProperty(obj, 'a.b.z'), returns undefined
 */
export const getProperty = (obj, property) => {
  if (!property) return undefined
  const properties = property.split('.')
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i]
    // eslint-disable-next-line no-prototype-builtins
    if (!obj || !obj.hasOwnProperty(prop)) {
      return undefined
    } else {
      obj = obj[prop]
    }
  }
  return obj
}

/*
 * returns the value of a property defined in bot's theme based on WEBCHAT.CUSTOM_PROPERTIES dictionary.
 * it gives preference to nested defined properties (e.g.: header.style) over plain properties (e.g.: headerStyle).
 * if property doesn't exist, returns the defaultValue
 */

export const _getThemeProperty = theme => (
  property,
  defaultValue = undefined
) => {
  for (const [k, v] of Object.entries(WEBCHAT.CUSTOM_PROPERTIES)) {
    if (v == property) {
      const nestedProperty = getProperty(theme, v)
      if (nestedProperty !== undefined) return nestedProperty
      const plainProperty = getProperty(theme, k)
      if (plainProperty !== undefined) return plainProperty
      return defaultValue
    }
  }
  return undefined
}

export const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export const scrollToBottom = (timeout = 100) => {
  const botonicScrollableArea = document.getElementById(
    'botonic-scrollable-content'
  )
  const frame =
    botonicScrollableArea &&
    botonicScrollableArea.querySelectorAll('.simplebar-content-wrapper')[0]
  if (frame) {
    frame.scrollTop = frame.scrollHeight
    setTimeout(() => (frame.scrollTop = frame.scrollHeight), timeout)
  }
}

export const getParsedAction = botonicAction => {
  const splittedAction = botonicAction.split('create_case:')
  if (splittedAction.length <= 1) return undefined
  return JSON.parse(splittedAction[1])
}

export function renderComponent({ renderBrowser, renderNode }) {
  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
  throw new Error('Unexpected process type. Not recognized as browser nor node')
}

export const isIphone = () => {
  // Detecting iOS solution, relying on navigator.platform: https://stackoverflow.com/a/9039885
  return !!navigator.platform && /iPhone/.test(navigator.platform)
}

const getWebchatElement = () => document.getElementById('botonic-webchat')

const setWebchatElementHeight = newHeight => {
  getWebchatElement().style.height = newHeight
}

export const handleIphoneOnFocus = () => {
  /*
    Based on Tip #4 from https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d,
    taking window.innerHeight as the amount of pixels the virtual keyboard adds
  */
  const waitUntilKeyboardIsShown = 200
  const calculateNewWebchatElementHeight = () => {
    const keyboardOffset = window.innerHeight
    const webchatHeight = getWebchatElement().clientHeight
    let newWebchatPercentualHeight = keyboardOffset / webchatHeight
    const toTwoDecimal = toRound => Number(Math.round(toRound + 'e2') + 'e-2')
    newWebchatPercentualHeight = toTwoDecimal(newWebchatPercentualHeight) * 100
    return newWebchatPercentualHeight
  }
  setTimeout(() => {
    setWebchatElementHeight(`${calculateNewWebchatElementHeight()}%`)
    scrollToBottom()
  }, waitUntilKeyboardIsShown)
}
export const handleIphoneOnBlur = () => {
  setWebchatElementHeight('100%')
}
