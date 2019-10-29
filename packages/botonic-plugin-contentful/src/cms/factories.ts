import {
  Button,
  ButtonStyle,
  FollowUp,
  Content,
  Text,
  CommonFields
} from './contents'

abstract class ModelBuilder {
  protected constructor(readonly name: string) {}

  abstract build(): Content
}

/**
 * Helps constructing @link Text, which has many fields and it's immutable
 */
export class TextBuilder extends ModelBuilder {
  buttons: Button[] = []
  shortText?: string
  keywords: string[] = []
  followUp?: FollowUp
  buttonsStyle = ButtonStyle.BUTTON

  constructor(readonly name: string, readonly text: string) {
    super(name)
  }

  withButtons(buttons: Button[]): TextBuilder {
    this.buttons = buttons
    return this
  }

  withShortText(shortText: string): TextBuilder {
    this.shortText = shortText
    return this
  }

  withFollowUp(followUp: FollowUp): TextBuilder {
    this.followUp = followUp
    return this
  }

  withKeywords(kw: string[]): TextBuilder {
    this.keywords = kw
    return this
  }

  withButtonStyle(style: ButtonStyle): TextBuilder {
    this.buttonsStyle = style
    return this
  }

  build(): Text {
    return new Text(
      new CommonFields(this.name, {
        shortText: this.shortText,
        keywords: this.keywords,
        followUp: this.followUp
      }),
      this.text,
      this.buttons,
      this.buttonsStyle
    )
  }
}
