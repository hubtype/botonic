import { WEBCHAT } from './constants'
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
