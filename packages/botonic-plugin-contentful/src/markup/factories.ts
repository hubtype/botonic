import { Markdown } from './markdown'
import { MarkUp, MarkupType } from './markup'
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw Error(`Invalid markdup type: ${type}`)
  }
}
