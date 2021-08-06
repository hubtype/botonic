import { BotonicEvent } from '../models/events'
import { MessageParsingFactory } from './factory'
export declare const TEXT_NODE_NAME = 'text'
export declare class BotonicOutputParser {
  private readonly factory
  private static OPTIONS
  constructor(factory?: MessageParsingFactory)
  xmlToMessageEvents(html: string): Partial<BotonicEvent>[]
  /**
   * Right now, when saving BotonicEvents to DataProvider, we need the standarized Botonic event
   * to be saved. This is, converting a botonic input like: '{id: 'msgId', data: 'rawData', payload: 'somePayload'}'
   * into a BotonicEvent with the expected properties.
   */
  parseFromUserInput(input: any): Partial<BotonicEvent>
  private xmlToJSONMessages
}
