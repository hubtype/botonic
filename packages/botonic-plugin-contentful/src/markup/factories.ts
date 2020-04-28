import { MarkUp, MarkupType } from './markup'
import { Markdown } from './markdown'
import { WhatsApp } from './whatsapp'

export function createMarkUp(type: MarkupType): MarkUp {
  switch (type) {
    case MarkupType.MARKDOWN:
    case MarkupType.GITHUB:
    case MarkupType.CONTENTFUL:
      return new Markdown(type)
    case MarkupType.WHATSAPP:
      return new WhatsApp()
    default:
      throw Error(`Invalid markdup type: ${type}`)
  }
}
