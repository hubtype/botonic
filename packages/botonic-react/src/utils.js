import { CUSTOM_WEBCHAT_PROPERTIES } from './constants'
export function isDev() {
  return process.env.NODE_ENV == 'development'
}

export function isProd() {
  return process.env.NODE_ENV == 'production'
}

export const staticAsset = path => {
  try {
    let scriptBaseURL = document
      .querySelector('script[src$="webchat.botonic.js"]')
      .getAttribute('src')
    let scriptName = scriptBaseURL.split('/').pop()
    let basePath = scriptBaseURL.replace('/' + scriptName, '/')
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
  let properties = property.split('.')
  for (let i = 0; i < properties.length; i++) {
    let prop = properties[i]
    if (!obj || !obj.hasOwnProperty(prop)) {
      return undefined
    } else {
      obj = obj[prop]
    }
  }
  return obj
}

/*
 * returns the value of a property defined in bot's theme based on CUSTOM_WEBCHAT_PROPERTIES dictionary.
 * it gives preference to nested defined properties (e.g.: header.style) over plain properties (e.g.: headerStyle).
 * if property doesn't exist, returns the defaultValue
 */

export const _getThemeProperty = theme => (
  property,
  defaultValue = undefined
) => {
  for (let [k, v] of Object.entries(CUSTOM_WEBCHAT_PROPERTIES)) {
    if (v == property) {
      let nestedProperty = getProperty(theme, v)
      if (nestedProperty !== undefined) return nestedProperty
      let plainProperty = getProperty(theme, k)
      if (plainProperty !== undefined) return plainProperty
      return defaultValue
    }
  }
}
