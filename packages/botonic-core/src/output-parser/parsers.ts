import {
  AudioMessageEvent,
  BotonicMessageEvent,
  Button,
  CarouselElement,
  CarouselMessageEvent,
  CustomMessageEvent,
  DocumentMessageEvent,
  EventTypes,
  FormMessageEvent,
  ImageMessageEvent,
  LocationMessageEvent,
  MissedMessageEvent,
  PostbackMessageEvent,
  Reply,
  TextMessageEvent,
  VideoMessageEvent,
  WithButtons,
  WithReplies,
} from '../models'
import { ContactMessageEvent } from '../models/events/message/contact'
import { TEXT_NODE_NAME } from './botonic-output-parser'

export function parseNumber(strNumber: string): number {
  return parseInt(strNumber)
}

export function parseBoolean(strNumber: string): boolean {
  if (strNumber === '0') return false
  return true
}

export type ParseFunction<Out> = (args: { toParse: any; parsed?: any }) => {
  toParse: any
  parsed: Partial<Out>
}

// COMMON
export const parseMessage: ParseFunction<BotonicMessageEvent> = args => {
  const typingAndDelay = {}
  if (args.toParse.delay !== undefined) {
    typingAndDelay['delay'] = parseNumber(args.toParse.delay)
  }
  if (args.toParse.typing !== undefined) {
    typingAndDelay['typing'] = parseNumber(args.toParse.typing)
  }
  return {
    toParse: args.toParse,
    parsed: {
      // Following properties added later before saving event: eventId, userId, createdAt, from, ack
      eventType: EventTypes.MESSAGE,
      type: args.toParse.type,
      ack: args.toParse.ack,
      from: args.toParse.from,
      ...typingAndDelay,
    },
  }
}

// BUTTONS
export const parseButton = (button: any): Button => {
  const title = button[TEXT_NODE_NAME]
  if ('payload' in button) {
    return { title, payload: button.payload }
  }
  if ('url' in button) {
    const b = { title, url: button.url, target: button.target }
    if (button.target) b.target = button.target
    return b
  }
  if ('webview' in button) {
    return {
      title,
      webview: button.webview,
      params: button.params,
    }
  }
  throw new Error('Invalid parsed Button')
}

export const parseButtons: ParseFunction<WithButtons> = args => {
  const hasButtons = args.toParse?.button?.length > 0
  let buttons: Button[] = []
  if (hasButtons) {
    buttons = args.toParse.button.map(button => parseButton(button))
  }
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      buttons,
    },
  }
}

// REPLIES
export const parseReply = (reply: any): Reply => ({
  title: reply[TEXT_NODE_NAME],
  payload: reply.payload,
})

export const parseReplies: ParseFunction<WithReplies> = args => {
  const hasReplies = args.toParse?.reply?.length > 0
  let replies: Reply[] = []
  if (hasReplies) {
    replies = args.toParse.reply.map(reply => parseReply(reply))
  }
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      replies,
    },
  }
}

// TEXT
export const parseText: ParseFunction<TextMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      text: args.toParse[TEXT_NODE_NAME],
      markdown: parseBoolean(args.toParse.markdown),
    },
  }
}

// POSTBACK
export const parsePostback: ParseFunction<PostbackMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      payload: args.toParse.payload,
    },
  }
}

// MEDIA
export const parseMedia: ParseFunction<
  | AudioMessageEvent
  | DocumentMessageEvent
  | ImageMessageEvent
  | VideoMessageEvent
> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      src: args.toParse.src,
    },
  }
}

// LOCATION
export const parseLocation: ParseFunction<LocationMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      lat: args.toParse.lat,
      long: args.toParse.long,
    },
  }
}

// CAROUSEL
export const parseElement = (element: any): CarouselElement => {
  const e: CarouselElement = {
    pic: element.pic,
    title: element.title,
    subtitle: element.desc,
  }
  const hasButtons = element.button !== undefined
  if (hasButtons) e.buttons = element.button.map(b => parseButton(b))
  return e
}

export const parseCarousel: ParseFunction<CarouselMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      elements: args.toParse.element.map(element => parseElement(element)),
    },
  }
}

// CUSTOM
export const parseCustom: ParseFunction<CustomMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      json: JSON.parse(args.toParse.json),
    },
  }
}

// MISSED
export const parseMissed: ParseFunction<MissedMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      reason: args.toParse.reason,
      media_type: args.toParse.media_type,
    },
  }
}

// FORM
export const parseForm: ParseFunction<FormMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      form_title: args.toParse.form_title,
      form_answers: args.toParse.form_answers,
    },
  }
}

// CONTACT
export const parseContact: ParseFunction<ContactMessageEvent> = args => {
  return {
    toParse: args.toParse,
    parsed: {
      ...args.parsed,
      phone_number: args.toParse.phone_number,
      first_name: args.toParse.first_name,
      last_name: args.toParse.last_name,
      vcard: args.toParse.vcard,
    },
  }
}
