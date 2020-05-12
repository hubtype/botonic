import { INPUT } from '@botonic/core'

export const isType = (msgType, type) => msgType === type
export const isText = msg => isType(msg.type, INPUT.TEXT)
export const isPostback = msg => isPostback(msg.type, INPUT.POSTBACK)
export const isAudio = msg => isType(msg.type, INPUT.AUDIO)
export const isImage = msg => isType(msg.type, INPUT.IMAGE)
export const isVideo = msg => isType(msg.type, INPUT.VIDEO)
export const isDocument = msg => isType(msg.type, INPUT.DOCUMENT)
export const isLocation = msg => isType(msg.type, INPUT.LOCATION)
export const isContact = msg => isType(msg.type, INPUT.CONTACT)
export const isCarousel = msg => isType(msg.type, INPUT.CAROUSEL)
export const isCustom = msg => isType(msg.type, INPUT.CUSTOM)

export const MEDIA_TYPES = [
  INPUT.AUDIO,
  INPUT.IMAGE,
  INPUT.VIDEO,
  INPUT.DOCUMENT,
]

export const isMedia = message =>
  MEDIA_TYPES.some(type => isType(message.type, type))

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
