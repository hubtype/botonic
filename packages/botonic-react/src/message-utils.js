import { INPUT } from '@botonic/core'

import { MAX_ALLOWED_SIZE_MB, MIME_WHITELIST } from './constants'

export const isOfType = (msgType, type) => msgType === type

export const isText = msg => isOfType(msg.type, INPUT.TEXT)
export const isPostback = msg => isOfType(msg.type, INPUT.POSTBACK)
export const isAudio = msg => isOfType(msg.type, INPUT.AUDIO)
export const isImage = msg => isOfType(msg.type, INPUT.IMAGE)
export const isVideo = msg => isOfType(msg.type, INPUT.VIDEO)
export const isDocument = msg => isOfType(msg.type, INPUT.DOCUMENT)
export const isLocation = msg => isOfType(msg.type, INPUT.LOCATION)
export const isContact = msg => isOfType(msg.type, INPUT.CONTACT)
export const isCarousel = msg => isOfType(msg.type, INPUT.CAROUSEL)
export const isCustom = msg => isOfType(msg.type, INPUT.CUSTOM)
export const isButtonMessage = msg => isOfType(msg.type, INPUT.BUTTON_MESSAGE)

export const INPUT_MEDIA_TYPES = [
  INPUT.AUDIO,
  INPUT.IMAGE,
  INPUT.VIDEO,
  INPUT.DOCUMENT,
]

export const isMedia = message =>
  INPUT_MEDIA_TYPES.some(type => isOfType(message.type, type))

// TODO: Centralize handling attachments in class

export const readDataURL = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

export const isAllowedSize = fileSize => {
  const maxAllowedBytesSize = MAX_ALLOWED_SIZE_MB * 1024 * 1024
  if (fileSize > maxAllowedBytesSize) return false
  return true
}

export const getMediaType = fileType => {
  return Object.entries(MIME_WHITELIST)
    .filter(([_, formatsForType]) => formatsForType.includes(fileType))
    .map(([type, _]) => type)[0]
}

export const getFullMimeWhitelist = () =>
  Object.values(MIME_WHITELIST).map(acceptedFormatsForType =>
    acceptedFormatsForType.join(',')
  )
