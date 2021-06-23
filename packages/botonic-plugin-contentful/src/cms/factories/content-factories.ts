import {
  Button,
  ButtonStyle,
  Carousel,
  CommonFields,
  Content,
  Document,
  Element,
  FollowUp,
  Handoff,
  HandoffAgent,
  Image,
  OnFinish,
  Queue,
  StartUp,
  Text,
} from '../contents'

abstract class ContentBuilder {
  protected constructor(public id: string, public name: string) {}

  withId(id: string): this {
    this.id = id
    return this
  }

  withName(name: string): this {
    this.name = name
    return this
  }

  abstract build(): Content
}

/** @deprecated use ContentBuilder */
export type ModelBuilder = ContentBuilder

export abstract class TopContentBuilder extends ContentBuilder {
  shortText?: string
  keywords: string[] = []
  followUp?: FollowUp // TODO move to MessageContentBuilder when removed from CommonFields

  withShortText(shortText: string): this {
    this.shortText = shortText
    return this
  }

  withKeywords(kw: string[]): this {
    this.keywords = kw
    return this
  }

  buildCommonFields(): CommonFields {
    return new CommonFields(this.id, this.name, {
      shortText: this.shortText,
      keywords: this.keywords,
      followUp: this.followUp,
    })
  }
}

abstract class MessageContentBuilder extends TopContentBuilder {
  withFollowUp(followUp?: FollowUp): this {
    this.followUp = followUp
    return this
  }
}

export class TextBuilder extends MessageContentBuilder {
  buttons: Button[] = []
  buttonsStyle = ButtonStyle.BUTTON

  constructor(id: string, name: string, public text: string) {
    super(id, name)
  }

  withText(text: string): this {
    this.text = text
    return this
  }

  withButtons(buttons: Button[]): this {
    this.buttons = buttons
    return this
  }

  withButtonStyle(style: ButtonStyle): this {
    this.buttonsStyle = style
    return this
  }

  build(): Text {
    return new Text(
      this.buildCommonFields(),
      this.text,
      this.buttons,
      this.buttonsStyle
    )
  }
}

export class ElementBuilder {
  title?: string
  subtitle?: string
  imgUrl?: string
  buttons: Button[] = []

  constructor(public id: string) {}

  withTitle(title: string): this {
    this.title = title
    return this
  }

  withSubtitle(subtitle: string): this {
    this.subtitle = subtitle
    return this
  }

  withImgUrl(imgUrl: string): this {
    this.imgUrl = imgUrl
    return this
  }

  withButtons(buttons: Button[]): this {
    this.buttons = buttons
    return this
  }

  build(): Element {
    return new Element(
      this.id,
      this.buttons,
      this.title || '',
      this.subtitle,
      this.imgUrl
    )
  }
}

export class CarouselBuilder extends MessageContentBuilder {
  private elements: Element[] = []
  elementBuilder: ElementBuilder | undefined

  constructor(id: string, name: string) {
    super(id, name)
  }

  withElementBuilder(elementId: string): ElementBuilder {
    if (!this.elementBuilder) {
      this.elementBuilder = new ElementBuilder(elementId)
    }
    return this.elementBuilder
  }

  addElement(): this {
    if (!this.elementBuilder) {
      throw new Error('You need to previously call withElementBuilder')
    }
    this.elements.push(this.elementBuilder.build())
    return this
  }

  build(): Carousel {
    return new Carousel(this.buildCommonFields(), this.elements)
  }
}

export class StartUpBuilder extends MessageContentBuilder {
  imgUrl?: string
  buttons: Button[] = []

  constructor(id: string, name: string, public text: string) {
    super(id, name)
  }

  withText(text: string): this {
    this.text = text
    return this
  }

  withButtons(buttons: Button[]): this {
    this.buttons = buttons
    return this
  }

  build(): StartUp {
    return new StartUp(
      this.buildCommonFields(),
      this.imgUrl,
      this.text,
      this.buttons
    )
  }
}

export class ImageBuilder extends MessageContentBuilder {
  constructor(id: string, name: string, public imgUrl: string) {
    super(id, name)
  }

  withUrl(url: string): this {
    this.imgUrl = url
    return this
  }

  build(): Image {
    return new Image(this.buildCommonFields(), this.imgUrl)
  }
}

export class DocumentBuilder extends MessageContentBuilder {
  constructor(id: string, name: string, public docUrl: string) {
    super(id, name)
  }

  withUrl(url: string): this {
    this.docUrl = url
    return this
  }

  build(): Document {
    return new Document(this.buildCommonFields(), this.docUrl)
  }
}

export class HandoffBuilder extends MessageContentBuilder {
  message?: string
  failMessage?: string
  queue?: Queue
  agent?: HandoffAgent
  shadowing?: boolean
  constructor(id: string, name: string, public onFinish: OnFinish) {
    super(id, name)
  }

  withHandoffMessage(message?: string): this {
    this.message = message
    return this
  }

  withHandoffFailMessage(failMessage?: string): this {
    this.failMessage = failMessage
    return this
  }

  withQueue(queue?: Queue): this {
    this.queue = queue
    return this
  }

  withAgent(agent?: HandoffAgent): this {
    this.agent = agent
    return this
  }

  withShadowing(shadowing?: boolean): this {
    this.shadowing = shadowing
    return this
  }

  build(): Handoff {
    return new Handoff(
      this.buildCommonFields(),
      this.onFinish,
      this.message,
      this.failMessage,
      this.queue,
      this.agent,
      this.shadowing
    )
  }
}
