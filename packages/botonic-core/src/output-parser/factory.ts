import { BotonicEvent } from '../models/events'
import { MessageEventTypes } from '../models/events/message'
import { MEDIA_TYPES } from '../models/events/message/media'
import {
  parseButtons,
  parseCarousel,
  parseCustom,
  parseLocation,
  parseMedia,
  parseMessage,
  parseReplies,
  parseText,
} from './parsers'

export class MessageParsingFactory {
  parse(msgToParse: any): Partial<BotonicEvent> {
    const type = msgToParse.type
    const parsedMessage = parseMessage({ toParse: msgToParse })
    if (type === MessageEventTypes.TEXT) {
      return parseText(parseReplies(parseButtons(parsedMessage))).parsed
    }
    if (MEDIA_TYPES.includes(type)) {
      return parseMedia(parseButtons(parsedMessage)).parsed
    }
    if (type === MessageEventTypes.LOCATION) {
      return parseLocation(parsedMessage).parsed
    }
    if (type === MessageEventTypes.CAROUSEL) {
      return parseCarousel(parsedMessage).parsed
    }
    if (type === MessageEventTypes.CUSTOM) {
      return parseCustom(parseReplies(parsedMessage)).parsed
    }
    throw new Error(`Parsing for type: '${type}' not implemented.`)
  }
}
