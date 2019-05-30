import { Button, ButtonStyle, FollowUp, Model, Text } from './model';

abstract class ModelBuilder {
  protected constructor(readonly name: string) {}

  abstract build(): Model;
}

/**
 * Helps constructing @link Text, which has many fields and it's immutable
 */
export class TextBuilder extends ModelBuilder {
  buttons: Button[] = [];
  shortText?: string;
  keywords: string[] = [];
  followUp?: FollowUp;
  buttonsStyle = ButtonStyle.BUTTON;

  constructor(readonly name: string, readonly text: string) {
    super(name);
  }

  withButtons(buttons: Button[]): TextBuilder {
    this.buttons = buttons;
    return this;
  }

  withShortText(shortText: string): TextBuilder {
    this.shortText = shortText;
    return this;
  }

  withFollowUp(followUp: FollowUp): TextBuilder {
    this.followUp = followUp;
    return this;
  }

  withKeywords(kw: string[]): TextBuilder {
    this.keywords = kw;
    return this;
  }

  withButtonStyle(style: ButtonStyle): TextBuilder {
    this.buttonsStyle = style;
    return this;
  }

  build(): Text {
    return new Text(
      this.name,
      this.text,
      this.buttons,
      this.shortText,
      this.keywords,
      this.followUp,
      this.buttonsStyle
    );
  }
}
