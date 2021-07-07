import { parse, X2jOptions } from 'fast-xml-parser'
import { decode } from 'html-entities'

import { BotonicEvent } from '../models/events'
import { MessageParsingFactory } from './factory'

export const TEXT_NODE_NAME = 'text'

export class BotonicOutputParser {
  private static OPTIONS: Partial<X2jOptions> = {
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: TEXT_NODE_NAME,
    arrayMode: true,
    attrValueProcessor: a => decode(a),
  }

  constructor(private readonly factory = new MessageParsingFactory()) {}

  xmlToMessageEvents(html: string): Partial<BotonicEvent>[] {
    const jsonMessages = this.xmlToJSONMessages(html)
    return jsonMessages.map(msgToParse => this.factory.parse(msgToParse))
  }

  parseFromUserInput(input: any): Partial<BotonicEvent> {
    return this.factory.parse(input)
  }

  private xmlToJSONMessages(html: any): any {
    return parse(html, BotonicOutputParser.OPTIONS).message
  }
}
