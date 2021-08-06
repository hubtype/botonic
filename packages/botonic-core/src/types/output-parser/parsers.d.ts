import { BotonicMessageEvent } from '../models/events/message'
import { Button, WithButtons } from '../models/events/message/buttons'
import {
  CarouselElement,
  CarouselMessageEvent,
} from '../models/events/message/carousel'
import { CustomMessageEvent } from '../models/events/message/custom'
import { LocationMessageEvent } from '../models/events/message/location'
import {
  AudioMessageEvent,
  DocumentMessageEvent,
  ImageMessageEvent,
  VideoMessageEvent,
} from '../models/events/message/media'
import { PostbackMessageEvent } from '../models/events/message/postback'
import { Reply, WithReplies } from '../models/events/message/replies'
import { TextMessageEvent } from '../models/events/message/text'
export declare type ParseFunction<Out> = (args: {
  toParse: any
  parsed?: any
}) => {
  toParse: any
  parsed: Partial<Out>
}
export declare const parseMessage: ParseFunction<BotonicMessageEvent>
export declare const parseButton: (button: any) => Button
export declare const parseButtons: ParseFunction<WithButtons>
export declare const parseReply: (reply: any) => Reply
export declare const parseReplies: ParseFunction<WithReplies>
export declare const parseText: ParseFunction<TextMessageEvent>
export declare const parsePostback: ParseFunction<PostbackMessageEvent>
export declare const parseMedia: ParseFunction<
  | AudioMessageEvent
  | DocumentMessageEvent
  | ImageMessageEvent
  | VideoMessageEvent
>
export declare const parseLocation: ParseFunction<LocationMessageEvent>
export declare const parseElement: (element: any) => CarouselElement
export declare const parseCarousel: ParseFunction<CarouselMessageEvent>
export declare const parseCustom: ParseFunction<CustomMessageEvent>
