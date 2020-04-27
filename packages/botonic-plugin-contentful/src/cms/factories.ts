import {
  Button,
  ButtonStyle,
  Element,
  FollowUp,
  Content,
  Text,
  CommonFields,
  Carousel,
  StartUp,
} from './contents'

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
  withFollowUp(followUp: FollowUp): this {
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
  elements: Element[] = []

  constructor(id: string, name: string, public text: string) {
    super(id, name)
  }

  withText(text: string): this {
    this.text = text
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
