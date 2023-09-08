// TODO refactor through conversion of followUp chain to lists of contents
// eg. MessageContent.fromList(content.toList().filter()...map())

import {
  Button,
  Carousel,
  Document,
  Element,
  Image,
  MessageContent,
  StartUp,
  Text,
  Video,
} from '../contents'
import { Context } from '../context'
import { CmsException } from '../exceptions'
import { ElementBuilder } from '../factories/content-factories'

export type MessageContentFilter<T> = (
  t: T,
  context: Context
) => Promise<MessageContent>

export type FilterByMessageContentType = {
  carousel?: MessageContentFilter<Carousel>
  image?: MessageContentFilter<Image>
  video?: MessageContentFilter<Video>
  startUp?: MessageContentFilter<StartUp>
  text?: MessageContentFilter<Text>
  document?: MessageContentFilter<Document>
}

export function enableDependingOnContext(
  inFilter: FilterByMessageContentType,
  enabler: (ctx: Context) => boolean
): FilterByMessageContentType {
  const filter =
    <T>(filter?: MessageContentFilter<T>) =>
    (c: T, ctx: Context) => {
      return (enabler(ctx) && filter && filter(c, ctx)) || Promise.resolve(c)
    }
  return {
    carousel: filter(inFilter.carousel),
    image: filter(inFilter.image),
    video: filter(inFilter.video),
    startUp: filter(inFilter.startUp),
    text: filter(inFilter.text),
    document: filter(inFilter.document),
  }
}

/**
 * Recursively (through followUps chain) maps a MessageContent to another
 */
export class RecursiveMessageContentFilter {
  constructor(private readonly filters: FilterByMessageContentType) {}

  async filterContent(
    content: MessageContent,
    context: Context | undefined
  ): Promise<MessageContent> {
    context = context || {}
    if (content.common.followUp) {
      const followUp = await this.filterContent(
        content.common.followUp,
        context
      )
      content = content.cloneWithFollowUp(followUp)
    }

    return (await this.filterTop(content, context)) || content
  }

  private async filterTop(
    content: MessageContent,
    context: Context
  ): Promise<MessageContent | undefined> {
    if (content instanceof Carousel) {
      return (
        this.filters.carousel && (await this.filters.carousel(content, context))
      )
    }
    if (content instanceof Text) {
      return this.filters.text && (await this.filters.text(content, context))
    }
    if (content instanceof StartUp) {
      return this.filters.startUp && this.filters.startUp(content, context)
    }
    if (content instanceof Image) {
      return this.filters.image && (await this.filters.image(content, context))
    }
    if (content instanceof Video) {
      return this.filters.video && (await this.filters.video(content, context))
    }
    if (content instanceof Document) {
      return (
        this.filters.document && (await this.filters.document(content, context))
      )
    }
    throw new CmsException(`Type '${content.contentType}' not supported`)
  }
}

export type StringFilter = (txt: string) => string

export const buttonsTextFilter =
  (filter: StringFilter) => (buttons: Button[]) =>
    buttons.map(b => b.cloneWithText(filter(b.text)))

// only applies filter to buttons text
export const elementsTextFilter =
  (filter: StringFilter) => (elements: Element[]) =>
    elements.map(e => e.cloneWithButtons(buttonsTextFilter(filter)(e.buttons)))

/**
 * Applies a transformation to all visible string in a MessageContent
 */
export const stringsFilter = (filter: StringFilter) => {
  const filterButtons = buttonsTextFilter(filter)

  return {
    text: (text: Text) => {
      return Promise.resolve(
        text
          .cloneWithText(filter(text.text))
          .cloneWithButtons(filterButtons(text.buttons))
      )
    },
    carousel: (carousel: Carousel) => {
      const elements = carousel.elements.map(e => {
        const element = new ElementBuilder(e.id)
          .withButtons(filterButtons(e.buttons))
          .withTitle(filter(e.title))
          .withSubtitle(filter(e.subtitle))
          .withImgUrl(e.imgUrl)
          .build()
        return element
      })
      return Promise.resolve(carousel.cloneWithElements(elements))
    },
    startUp: (startUp: StartUp) => {
      return Promise.resolve(
        startUp
          .cloneWithText(filter(startUp.text))
          .cloneWithButtons(filterButtons(startUp.buttons))
      )
    },
  }
}
