import React from 'react'
import { Text } from './components/text'
import { Title } from './components/title'
import { Subtitle } from './components/subtitle'
import { Element } from './components/element'
import { Button } from './components/button'
import { Carousel } from './components/carousel'
import { Reply } from './components/reply'
import { Image } from './components/image'
import { Audio } from './components/audio'
import { Pic } from './components/pic'
import { Video } from './components/video'
import { Document } from './components/document'
import { Location } from './components/location'

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
 * given an object and a property, returns if the property exists (recursively)
 * @param  {Object} arg1 object to be checked
 * @param  {String} arg2 string describing the property (for nested values, separate them with '.')
 * @return {Boolean}     true if property exists, false otherwise
 */
export const getProperty = (obj, property) => {
  if (!property) return false
  let properties = property.split('.')
  for (let i = 0; i < properties.length; i++) {
    let prop = properties[i]
    if (!obj || !obj.hasOwnProperty(prop)) {
      return false
    } else {
      obj = obj[prop]
    }
  }
  return obj
}
