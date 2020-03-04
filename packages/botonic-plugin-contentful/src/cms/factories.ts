import {
  Button,
  ButtonStyle,
  FollowUp,
  Content,
  Text,
  CommonFields,
} from './contents'

abstract class ModelBuilder {
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

/**
 * Helps constructing @link Text, which has many fields and it's immutable
 */
export class TextBuilder extends ModelBuilder {
  // TODO move CommonFields to a new TopContentBuilder
  shortText?: string
  keywords: string[] = []
  followUp?: FollowUp

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

  withShortText(shortText: string): this {
    this.shortText = shortText
    return this
  }

  withFollowUp(followUp: FollowUp): this {
    this.followUp = followUp
    return this
  }

  withKeywords(kw: string[]): this {
    this.keywords = kw
    return this
  }

  withButtonStyle(style: ButtonStyle): this {
    this.buttonsStyle = style
    return this
  }

  build(): Text {
    return new Text(
      new CommonFields(this.id, this.name, {
        shortText: this.shortText,
        keywords: this.keywords,
        followUp: this.followUp,
      }),
      this.text,
      this.buttons,
      this.buttonsStyle
    )
  }
}
