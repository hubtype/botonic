import { BotonicEvent } from '../models/events'
export declare class MessageParsingFactory {
  parse(msgToParse: any): Partial<BotonicEvent>
}
