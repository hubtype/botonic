import { WEBCHAT } from './constants'
import { isBrowser, isNode, PROVIDER } from '@botonic/core'

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

export const isURL = urlPath => {
  // @stephenhay (38 chars) from: https://mathiasbynens.be/demo/url-regex
  const URL_PATTERN = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
  const pattern = new RegExp(URL_PATTERN)
  return !!pattern.test(urlPath)
}

export const resolveImage = src => {
  if (isURL(src)) return src
  return staticAsset(src)
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

export const getBotonicScrollableContent = () => {
  return document.getElementById('botonic-scrollable-content')
}

export const getScrollableArea = () => {
  const getArea = area => {
    const botonicScrollableContent = getBotonicScrollableContent()
    const scrollableArea =
      botonicScrollableContent &&
      botonicScrollableContent.getElementsByClassName(area)[0]
    return scrollableArea
  }
  return {
    full: getArea('simplebar-content'),
    visible: getArea('simplebar-content-wrapper'),
  }
}

export const scrollToBottom = ({ timeout = 200, behavior = 'smooth' } = {}) => {
  const frame = getScrollableArea().visible
  if (frame) {
    setTimeout(
      () => frame.scrollTo({ top: frame.scrollHeight, behavior: behavior }),
      timeout
    )
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

export const getWebchatElement = () =>
  document.getElementById('botonic-webchat')

export const setWebchatElementHeight = newHeight => {
  getWebchatElement().style.height = newHeight
}

export const serializeRegex = (_, value) => {
  // To be used as a 2nd argument (replacer) of JSON.stringify
  // Ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  if (value instanceof RegExp) return value.toString()
  return value
}

export const deserializeRegex = regexStr => {
  /* eslint-disable no-useless-escape */
  const fragments = regexStr.match(/\/(.[^\/]+)\/([a-z]{1})?$/i) // https://stackoverflow.com/a/33642463, https://github.com/hubtype/botonic/pull/805#discussion_r437309074
  const deserialized = new RegExp(fragments[1], fragments[2] || '')
  return deserialized
}

export const stringifyWithRegexs = object => {
  // Serialization of regexs: https://stackoverflow.com/questions/12075927/serialization-of-regexp
  return JSON.stringify(object, serializeRegex)
}

export const isWebchatOrDev = context =>
  context.session &&
  context.session.user &&
  context.session.user.provider == (PROVIDER.WEBCHAT || PROVIDER.DEV)
