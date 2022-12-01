import { BotonicEvent, MEDIA_TYPES, MessageEventTypes } from '../models'
import {
  parseButtons,
  parseCarousel,
  parseCustom,
  parseLocation,
  parseMedia,
  parseMessage,
  parseMissed,
  parsePostback,
  parseReplies,
  parseText,
  parseForm,
} from './parsers'

export class MessageParsingFactory {
  parse(msgToParse: any): Partial<BotonicEvent> {
    const type = msgToParse.type
    const parsedMessage = parseMessage({ toParse: msgToParse })
    if (MEDIA_TYPES.includes(type)) {
      return parseMedia(parseButtons(parsedMessage)).parsed
    }
    switch (type) {
      case MessageEventTypes.TEXT:
        // statement 1
        return parseText(parseReplies(parseButtons(parsedMessage))).parsed
      case MessageEventTypes.POSTBACK:
        return parsePostback(parsedMessage).parsed
      case MessageEventTypes.LOCATION:
        return parseLocation(parsedMessage).parsed
      case MessageEventTypes.CAROUSEL:
        return parseCarousel(parsedMessage).parsed
      case MessageEventTypes.CUSTOM:
        return parseCustom(parseReplies(parsedMessage)).parsed
      case MessageEventTypes.MISSED:
        return parseForm(parsedMessage).parsed
      case MessageEventTypes.MISSED:
        return parseMissed(parsedMessage).parsed
    }
    throw new Error(`Parsing for type: '${type}' not implemented.`)
  }
}
