// TODO refactor through conversion of lists of contents

import {
  Button,
  Carousel,
  Element,
  Image,
  MessageContent,
  StartUp,
  Text,
} from './contents'
import { CmsException } from './exceptions'
import { ElementBuilder } from './factories'

export type MessageContentFilter<T> = (t: T) => Promise<MessageContent>
export type FilterByMessageContentType = {
  carousel?: MessageContentFilter<Carousel>
  text?: MessageContentFilter<Text>
  startUp?: MessageContentFilter<StartUp>
  image?: MessageContentFilter<Image>
}

export class RecursiveMessageContentFilter {
  constructor(private readonly filters: FilterByMessageContentType) {}

  async filterContent(content: MessageContent): Promise<MessageContent> {
    if (content.common.followUp) {
      const followUp = await this.filterContent(content.common.followUp)
      content = content.cloneWithFollowUp(followUp)
    }

    return (await this.filterTop(content)) || content
  }

  private async filterTop(
    content: MessageContent
  ): Promise<MessageContent | undefined> {
    if (content instanceof Carousel) {
      return this.filters.carousel && (await this.filters.carousel(content))
    }
    if (content instanceof Text) {
      return this.filters.text && (await this.filters.text(content))
    }
    if (content instanceof StartUp) {
      return this.filters.startUp && this.filters.startUp(content)
    }
    if (content instanceof Image) {
      return this.filters.image && (await this.filters.image(content))
    }
    throw new CmsException(`Type '${content.contentType}' not supported`)
  }
}

export type StringFilter = (txt: string) => string

export const buttonsTextFilter = (filter: StringFilter) => (
  buttons: Button[]
) => buttons.map(b => b.cloneWithText(filter(b.text)))

// only applies filter to buttons text
export const elementsTextFilter = (filter: StringFilter) => (
  elements: Element[]
) => elements.map(e => e.cloneWithButtons(buttonsTextFilter(filter)(e.buttons)))

export const textUpdaterFilter = (filter: StringFilter) => {
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
